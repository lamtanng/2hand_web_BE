import { UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import { mean } from 'lodash';
import mongoose, { PipelineStage } from 'mongoose';
import { createEmbedding } from '../apis/openai';
import { productFolder } from '../constants/cloudinaryFolder';
import { pagination } from '../constants/pagination';
import { CartModel } from '../models/cart';
import { OrderModel } from '../models/order';
import { ProductModel } from '../models/product';
import { AppError } from '../types/error.type';
import { Datum, PromptType } from '../types/http/openai.type';
import { PaginationResponseProps } from '../types/http/pagination.type';
import {
  DeleteProductRequestProps,
  ToggleProductRequestProps,
  UpdateProductRequestProps,
} from '../types/http/product.type';
import { ProductProps } from '../types/model/product.type';
import { SearchHistoryProps } from '../types/model/searchHistory.type';
import { catchServiceFunc } from '../utils/catchErrors';
import ApiError from '../utils/classes/ApiError';
import { averageVectors, createVectorIndex, VECTOR_INDEX_NAME } from '../utils/createVectocIndex';
import { deleteEmptyObjectFields, parseJson } from '../utils/object';
import { generateSlug } from '../utils/slug';
import { uploadCloudinary, UploadCloudinaryProps } from './cloudinary.service';
import { openaiService } from './openai.service';
import { searchHistoryService } from './searchHistory.service';
const findAll = async (req: Request, res: Response) => {
  try {
    const { page, limit, search, skip } = pagination(req);

    const sort = parseJson(req.query.sort as string);
    const quality = parseJson(req.query.quality as string);
    const cateID = parseJson(req.query.cateID as string);
    const price = parseJson(req.query.price as string);
    const storeID = parseJson(req.query.storeID as string);
    const isPublish = parseJson(req.query.isPublish as string);
    const isActive = parseJson(req.query.isActive as string);
    const isApproved = parseJson(req.query.isApproved as string);
    const isSoldOut = !!req.query?.isSoldOut
      ? parseJson(req.query?.isSoldOut as string)
      : undefined;

    const findCondition = {
      name: search && { $regex: search, $options: 'i' },
      cateID: cateID && { $in: cateID },
      isPublish: isPublish && String(isPublish),
      isActive: isActive && String(isActive),
      quantity: isSoldOut !== undefined ? (isSoldOut ? { $eq: 0 } : { $gt: 0 }) : undefined,
      quality: quality && { $in: quality },
      price: price && { $gte: price.min, $lte: price.max },
      storeID: storeID && { $in: storeID },
      isApproved: isApproved,
    };

    deleteEmptyObjectFields(findCondition);
    const products = await ProductModel.find(findCondition)
      .populate('cateID')
      .populate('storeID')
      .limit(limit)
      .skip(skip)
      .sort(sort);

    const total = await ProductModel.countDocuments(findCondition);
    const response: PaginationResponseProps = {
      page,
      limit,
      total,
      data: products,
    };
    return { response };
  } catch (error: AppError) {
    return new ApiError({ message: error.message, statusCode: error.statusCode }).rejectError();
  }
};

const findOneById = catchServiceFunc(async (req: Request, res: Response) => {
  const { productID } = req.params;
  const product = await ProductModel.findById(productID)
    .populate('cateID')
    .populate({
      path: 'storeID',
      populate: {
        path: 'userID',
      },
    });
  return product;
});

const findOneBySlug = catchServiceFunc(async (req: Request, res: Response) => {
  const { productSlug } = req.params;
  const product = await ProductModel.findOne({ slug: productSlug })
    .populate('cateID')
    .populate({
      path: 'storeID',
      populate: {
        path: 'userID',
      },
    });
  return product;
});

const addProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body as ProductProps;

    //upload image to cloudinary
    const urlImages = await uploadProductImages({ files: product.image });
    const newProduct = await ProductModel.create({ ...product, image: urlImages });
    return {
      status: newProduct ? true : false,
      data: {
        slug: newProduct.slug,
      },
    };
  } catch (error: AppError) {
    return new ApiError({ message: error.message, statusCode: error.statusCode }).rejectError();
  }
};

const updateProduct = catchServiceFunc(async (req: Request, res: Response) => {
  const product = req.body as UpdateProductRequestProps;

  //upload image to cloudinary
  const urlImages = await uploadProductImages({ files: product.image });

  const updatedProduct = await ProductModel.findByIdAndUpdate(
    product._id,
    { ...product, image: urlImages, slug: generateSlug(product.name) },
    {
      new: true,
    },
  );

  return {
    status: updatedProduct ? true : false,
    data: {
      slug: updatedProduct?.slug,
    },
  };
});

const deleteProduct = catchServiceFunc(async (req: Request, res: Response) => {
  const { _id } = req.query as unknown as DeleteProductRequestProps;
  return await ProductModel.deleteOne({ _id });
});

const toggleActiveProduct = async (req: Request, res: Response) => {
  try {
    const { _id } = req.query as unknown as ToggleProductRequestProps;
    const product = await ProductModel.findById(_id);
    if (product) {
      product.isActive = !product.isActive;
      return product.save();
    }
  } catch (error: AppError) {
    return new ApiError({ message: error.message, statusCode: error.statusCode }).rejectError();
  }
};

const uploadProductImages = async ({ files }: Pick<UploadCloudinaryProps, 'files'>) => {
  const uploadedFiles = await uploadCloudinary({
    files,
    asset_folder: productFolder,
    resource_type: 'image',
  });

  return uploadedFiles.map((file: UploadApiResponse) => file.secure_url);
};

function formatProductForEmbedding(product: any) {
  const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, '').trim();
  const qm = {
    New: 'mới 100%',
    LikeNew: 'gần như mới',
    Good: 'sử dụng tốt, còn mới',
    Average: 'qua sử dụng, còn dùng được',
    Old: 'cũ, hư hỏng nhẹ',
  };
  const ward = product.address?.ward?.WardName;
  const district = product.address?.district?.DistrictName;
  const province = product.address?.province?.ProvinceName;
  const location = [ward, district, province].filter(Boolean).join(', ');

  const keywords = ['đồ chơi', 'mô hình', product.name.match(/Halloween/i) ? 'Halloween' : ''];

  return `
Keywords: ${keywords.filter(Boolean).join(', ')}

Tên: ${product.name}
Danh mục: ${product.cateID?.name || ''}
Cửa hàng: ${product.storeID?.name || ''}
Tình trạng: ${qm[product.quality as keyof typeof qm] || product.quality}

Giá: ${product.price.toLocaleString()} VND
Kích thước: ${product.height} cm × ${product.width} cm × ${product.length} cm
Trọng lượng: ${product.weight} g

Mô tả: ${stripHtml(product.description)}

Địa chỉ: ${location}
`.trim();
}

export const createEmbeddingData = async () => {
  try {
    const products = await ProductModel.find({
      name: { $regex: '.*' },
    })
      .populate('cateID', 'name')
      .populate('storeID', 'name')
      .limit(100);

    await Promise.all(
      products?.map(async (product) => {
        const text = formatProductForEmbedding(product);
        const embeddingResponse = await createEmbedding({
          input: text,
        });

        const embedding = embeddingResponse.data?.[0]?.embedding;

        return await ProductModel.findByIdAndUpdate(
          product._id,
          { $set: { embedding } },
          { new: true },
        );
      }),
    );

    const result = await createVectorIndex(ProductModel, VECTOR_INDEX_NAME.PRODUCT);

    return { result };
  } catch (err) {
    console.log('Error: ', err);
    throw err;
  }
};

export const getProductByEmbedding = async (req: Request, res: Response) => {
  try {
    const search = req.query?.search;
    if (!search) {
      return findAll(req, res);
    }

    const embeddingResponse = await createEmbedding({
      input: [search] as string[],
    });

    const vectors: number[][] = embeddingResponse?.data?.map((d: Datum) => d.embedding || []);
    const avgEmbedding = vectors?.[0]?.map((_, i) => mean(vectors.map((vec) => vec[i])));

    // Tạo matchStage để sử dụng trong $match
    const sort = parseJson(req.query.sort as string);
    const quality = parseJson(req.query.quality as string);
    const cateID = parseJson(req.query.cateID as string);
    const price = parseJson(req.query.price as string);
    const storeID = parseJson(req.query.storeID as string);
    const isPublish = parseJson(req.query.isPublish as string);
    const isActive = parseJson(req.query.isActive as string);
    const isApproved = parseJson(req.query.isApproved as string);
    const isSoldOut = !!req.query?.isSoldOut
      ? parseJson(req.query?.isSoldOut as string)
      : undefined;

    const findCondition = {
      cateID: cateID && { $in: cateID },
      isPublish: isPublish && String(isPublish),
      isActive: isActive && String(isActive),
      quantity: isSoldOut !== undefined ? (isSoldOut ? { $eq: 0 } : { $gt: 0 }) : undefined,
      quality: quality && { $in: quality },
      price: price && { $gte: price.min, $lte: price.max },
      storeID: storeID && { $in: storeID },
      isApproved: isApproved,
    };

    deleteEmptyObjectFields(findCondition);

    console.log('findCondition', findCondition);

    const pipeline: PipelineStage[] = [
      {
        $vectorSearch: {
          index: VECTOR_INDEX_NAME.PRODUCT,
          queryVector: avgEmbedding,
          path: 'embedding',
          limit: 30, // tăng limit vì có lọc
          numCandidates: 100,
        },
      },
      {
        $addFields: {
          score: { $meta: 'vectorSearchScore' },
        },
      },
      {
        $replaceWith: {
          $mergeObjects: ['$$ROOT', { score: '$score' }],
        },
      },
      { $match: findCondition }, // lọc sau khi tìm bằng vector
      { $sort: { score: -1 } },
      // { $limit: 10 }, // lọc tiếp theo điểm
    ];

    const result = await ProductModel.aggregate(pipeline);
    const response: PaginationResponseProps = {
      page: 1,
      limit: 30,
      total: result.length,
      data: result,
    };

    // console.log('result', response);
    return { response };
  } catch (error: any) {
    return new ApiError({
      message: error.message,
      statusCode: error.statusCode || 500,
    }).rejectError();
  }
};

const updateProductsApproval = catchServiceFunc(async (req: Request, res: Response) => {
  const { products } = req.body;

  if (!products || !Array.isArray(products)) {
    throw new ApiError({ message: 'Invalid products data', statusCode: 400 });
  }

  const bulkOps = products.map(({ _id, isApproved }) => ({
    updateOne: {
      filter: { _id: new mongoose.Types.ObjectId(_id) },
      update: { $set: { isApproved } },
    },
  }));

  const result = await ProductModel.bulkWrite(bulkOps);

  return {
    status: true,
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  };
});

const getHistoryProducts = async (req: Request, res: Response) => {
  const historySearchTexts = (await searchHistoryService.findAllByUserIdWithoutRequest(
    req.query?.userId as string,
  )) as SearchHistoryProps[];

  const vectors: number[][] = historySearchTexts?.map((d: SearchHistoryProps) => d.embedding || []);

  const avgEmbedding = vectors?.[0]?.map((_, i) => mean(vectors.map((vec) => vec[i])));

  const pipeline: PipelineStage[] = [
    {
      $vectorSearch: {
        index: VECTOR_INDEX_NAME.PRODUCT,
        queryVector: avgEmbedding,
        path: 'embedding',
        limit: 10,
        numCandidates: 50,
      },
    },
    {
      $addFields: {
        score: { $meta: 'vectorSearchScore' },
      },
    },
    {
      $replaceWith: {
        $mergeObjects: ['$$ROOT', { score: '$score' }],
      },
    },
  ];

  const historyProducts = await ProductModel.aggregate(pipeline);

  return historyProducts;
};

async function createCombinedVector(sources: any) {
  const vectors = [];
  const weights = [];

  // Xử lý từ khóa tìm kiếm (weight: 0.2)
  if (sources.keywords && sources.keywords.length > 0) {
    const keywordAvgVector = averageVectors(sources.keywords);
    vectors.push(keywordAvgVector);
    weights.push(0.2);
  }

  // Xử lý sản phẩm trong giỏ hàng (weight: 0.5)
  if (sources.cartItems && sources.cartItems.length > 0) {
    const cartVector = averageVectors(sources.cartItems);
    vectors.push(cartVector);
    weights.push(0.5);
  }

  // Xử lý sản phẩm đã mua (weight: 0.3)
  if (sources.orderProducts && sources.orderProducts.length > 0) {
    const orderVector = averageVectors(sources.orderProducts);
    vectors.push(orderVector);
    weights.push(0.3);
  }

  // Nếu không có vector nào, trả về mảng rỗng
  if (vectors.length === 0) return [];
  console.log('vectors', vectors.length);
  // Tính vector kết hợp có trọng số
  const dimension = vectors[0].length;
  const combinedVector = Array(dimension).fill(0);
  let totalWeight = 0;

  for (let i = 0; i < vectors.length; i++) {
    const vector = vectors[i];
    const weight = weights[i];

    for (let j = 0; j < dimension; j++) {
      combinedVector[j] += vector[j] * weight;
    }
    totalWeight += weight;
  }

  return combinedVector.map((val) => val / totalWeight);
}

async function getRecommendations(req: Request, res: Response) {
  try {
    const { userId } = req.query;

    let historySearchTexts: SearchHistoryProps[] = [];
    let orders: any[] = [];
    let cart: any = null;
    let excludeProductIds: string[] = [];

    if (userId && typeof userId === 'string') {
      [historySearchTexts, orders, cart] = await Promise.all([
        searchHistoryService.findAllByUserIdWithoutRequest(userId),
        OrderModel.find({ userID: userId })
          .select('orderDetailIDs')
          .populate({
            path: 'orderDetailIDs',
            select: 'productID',
            populate: {
              path: 'productID',
              select: 'embedding _id',
            },
          })
          .lean(),
        CartModel.findOne({ userID: userId })
          .select('items')
          .populate({
            path: 'items',
            select: 'productID',
            populate: {
              path: 'productID',
              select: 'embedding _id',
            },
          })
          .lean(),
      ]);

      // Thu thập các productID cần loại trừ
      const cartProductIds =
        cart?.items?.map((item: any) => item.productID?._id?.toString()).filter(Boolean) || [];

      const orderProductIds =
        orders.flatMap((order: any) =>
          order.orderDetailIDs.map((p: any) => p.productID?._id?.toString()).filter(Boolean),
        ) || [];

      excludeProductIds = [
        ...new Set([...cartProductIds.slice(0, 10), ...orderProductIds.slice(0, 10)]),
      ];
    } else {
      historySearchTexts = await searchHistoryService.findAllByUserIdWithoutRequest();
    }

    // Extract embeddings efficiently
    const keywordVectors = historySearchTexts
      .slice(-5)
      .map((d) => d.embedding || [])
      .filter((v) => v.length > 0);

    const cartVectors =
      cart?.items?.flatMap((item: any) =>
        item.productID?.embedding ? [item.productID.embedding] : [],
      ) || [];

    const orderVectors =
      orders.flatMap((order: any) =>
        order.orderDetailIDs.flatMap((p: any) =>
          p.productID?.embedding ? [p.productID.embedding] : [],
        ),
      ) || [];

    // Create combined vector
    const combinedVector = await createCombinedVector({
      keywords: keywordVectors,
      cartItems: cartVectors,
      orderProducts: orderVectors,
    });

    console.log('combinedVector', keywordVectors.length, cartVectors.length, orderVectors.length);
    console.log('combinedVector length', combinedVector.length);
    if (combinedVector.length === 0) {
      return await ProductModel.find().limit(20);
    }

    const pipeline = getSearchPipeline(combinedVector, excludeProductIds);
    const recommendations = await ProductModel.aggregate(pipeline);

    return recommendations;
  } catch (error) {
    console.error('Recommendation error:', error);
    return await ProductModel.find().limit(20);
  }
}

function getSearchPipeline(queryVector: number[], excludeIds: string[] = []) {
  const vectorSearchStage: any = {
    $vectorSearch: {
      index: VECTOR_INDEX_NAME.PRODUCT,
      queryVector,
      path: 'embedding',
      limit: 30,
      numCandidates: 50,
    },
  };

  // Thêm bộ lọc nếu có sản phẩm cần loại trừ
  // if (excludeIds.length > 0) {
  //   vectorSearchStage.$vectorSearch.filter = {
  //     _id: {
  //       $nin: excludeIds.map((id) => new mongoose.Types.ObjectId(id)),
  //     },
  //   };
  // }

  return [
    vectorSearchStage,
    {
      $addFields: {
        score: { $meta: 'vectorSearchScore' },
      },
    },
    {
      $replaceWith: {
        $mergeObjects: ['$$ROOT', { score: '$score' }],
      },
    },
    {
      $project: {
        embedding: 0,
      },
    },
  ];
}

const getProductByImage = async (req: Request, res: Response) => {
  const { imageBase64 } = req.body;

  const input = [
    {
      type: 'image_url',
      image_url: { url: imageBase64 || '' },
    },
  ];

  const tags = await openaiService.askWithAI(input, PromptType.FindProductByImage);
  const tagsArray = tags?.length && tags[0]?.trim() ? JSON.parse(tags) : ['sản phẩm'];
  console.log('tagsArray', tagsArray);

  const embedding = await createEmbedding({
    input: tagsArray as string[],
  });

  const vectors: number[][] = embedding?.data?.map((d: Datum) => d.embedding || []);
  const avgEmbedding = vectors?.[0]?.map((_, i) => mean(vectors.map((vec) => vec[i])));

  const pipeline: PipelineStage[] = [
    {
      $vectorSearch: {
        index: VECTOR_INDEX_NAME.PRODUCT,
        queryVector: avgEmbedding,
        path: 'embedding',
        limit: 10,
        numCandidates: 50,
      },
    },
    {
      $addFields: {
        score: { $meta: 'vectorSearchScore' },
      },
    },
    {
      $replaceWith: {
        $mergeObjects: ['$$ROOT', { score: '$score' }],
      },
    },
    {
      $project: {
        embedding: 0,
      },
    },
  ];

  const result = await ProductModel.aggregate(pipeline);
  return result;
};

export const productService = {
  findAll,
  addProduct,
  updateProduct,
  deleteProduct,
  toggleActiveProduct,
  findOneById,
  findOneBySlug,
  createEmbeddingData,
  getProductByEmbedding,
  updateProductsApproval,
  getHistoryProducts: getRecommendations,
  getProductByImage,
  getRecommendations,
};
