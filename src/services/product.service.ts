import { UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import { mean } from 'lodash';
import mongoose, { PipelineStage } from 'mongoose';
import { createEmbedding, promptAI } from '../apis/openai';
import { productFolder } from '../constants/cloudinaryFolder';
import { pagination } from '../constants/pagination';
import { PROMPT_MAP } from '../constants/promptAI';
import { ProductModel } from '../models/product';
import { AppError } from '../types/error.type';
import {
  Datum,
  OpenAIRequestProps,
  OpenAIResponseProps,
  PromptType,
} from '../types/http/openai.type';
import { PaginationResponseProps } from '../types/http/pagination.type';
import {
  DeleteProductRequestProps,
  ToggleProductRequestProps,
  UpdateProductRequestProps,
} from '../types/http/product.type';
import { ProductProps } from '../types/model/product.type';
import { getRawProductText } from '../utils/analyticProduct';
import { catchServiceFunc } from '../utils/catchErrors';
import ApiError from '../utils/classes/ApiError';
import { createVectorIndex } from '../utils/createVectocIndex';
import { deleteEmptyObjectFields, parseJson } from '../utils/object';
import { generateSlug } from '../utils/slug';
import { uploadCloudinary, UploadCloudinaryProps } from './cloudinary.service';
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

const formatProductForEmbedding = (product: any): string => {
  const {
    name,
    description,
    price,
    quality,
    weight,
    height,
    width,
    length,
    cateID,
    storeID,
    address,
  } = product;

  const dimensions = `${length}cm x ${width}cm x ${height}cm`;
  const location = address
    ? `${address.ward}, ${address.district}, ${address.province}`
    : 'Unknown';

  const category = cateID?.name || 'Uncategorized';
  const store = storeID?.name || 'Unknown Store';

  return `
Tên sản phẩm: ${name}
Danh mục: ${category}
Cửa hàng: ${store}
Mô tả: ${description}
Chất lượng: ${quality}
Giá: ${price} VND
Kích thước: ${dimensions}
Trọng lượng: ${weight}kg
Địa chỉ: ${location}
`.trim();
};

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

    const result = await createVectorIndex(ProductModel);

    return { result };
  } catch (err) {
    console.log('Error: ', err);
    throw err;
  }
};

export const getProductByEmbedding = async (req: Request, res: Response) => {
  try {
    const { searches } = req.body;

    if (!searches || !Array.isArray(searches) || searches.length === 0) {
      throw new ApiError({ message: 'searches must be a non-empty array', statusCode: 400 });
    }

    const embeddingResponse = await createEmbedding({
      input: searches,
    });

    const vectors: number[][] = embeddingResponse.data.map((d: Datum) => d.embedding || []);

    const avgEmbedding = vectors[0].map((_, i) => mean(vectors.map((vec) => vec[i])));

    const pipeline: PipelineStage[] = [
      {
        $vectorSearch: {
          index: 'vector_product',
          queryVector: avgEmbedding,
          path: 'embedding',
          limit: 10,
          numCandidates: 30,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ];

    const result = await ProductModel.aggregate(pipeline);

    return result.sort((a, b) => b.score - a.score);
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
};
