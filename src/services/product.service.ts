import { UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import { productFolder } from '../constants/cloudinaryFolder';
import { pagination } from '../constants/pagination';
import { ProductModel } from '../models/product';
import { AppError } from '../types/error.type';
import { PaginationResponseProps } from '../types/http/pagination.type';
import {
  DeleteProductRequestProps,
  ToggleProductRequestProps,
  UpdateProductRequestProps,
} from '../types/http/product.type';
import { ProductProps } from '../types/model/product.type';
import { catchServiceFunc } from '../utils/catchErrors';
import ApiError from '../utils/classes/ApiError';
import { deleteEmptyObjectFields, parseJson } from '../utils/object';
import { generateSlug } from '../utils/slug';
import { uploadCloudinary, UploadCloudinaryProps } from './cloudinary.service';
import { createEmbedding } from '../apis/openai';
import { createVectorIndex } from '../utils/createVectocIndex';
import { PipelineStage } from 'mongoose';
import { openaiService } from './openai.service';
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

    const content = [product.description, product.name];
    const checkViolation = await openaiService.checkCommunityViolation(content, product.image);
    if (!checkViolation.status) return checkViolation;

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

  const content = [product.description, product.name];
  const checkViolation = await openaiService.checkCommunityViolation(content, product.image);
  if (!checkViolation.status) return checkViolation;

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

export const createEmbeddingData = async () => {
  try {
    const products = await ProductModel.find({
      name: { $regex: '.*' },
    }).limit(100);

    const updatedProducts = await Promise.all(
      products?.map(async (product) => {
        const embeddingResponse = await createEmbedding({
          input: product.name,
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

const getProductByEmbedding = async (req: Request, res: Response) => {
  try {
    const { search } = req.body;
    const queryEmbedding = await createEmbedding({
      input: search,
    });

    const embedding = queryEmbedding.data?.[0]?.embedding;

    const pipeline: PipelineStage[] = [
      {
        $vectorSearch: {
          index: 'vector_product',
          queryVector: embedding,
          path: 'embedding',
          limit: 10,
          numCandidates: 30,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ];

    const result = await ProductModel.aggregate(pipeline);

    const highSimilarityResults = result.filter((item) => item.score >= 0.7);
    const remainingResults = result.filter((item) => item.score < 0.7);

    return {
      highSimilarity: highSimilarityResults,
      remaining: remainingResults,
    };
  } catch (error: AppError) {
    return new ApiError({ message: error.message, statusCode: error.statusCode }).rejectError();
  }
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
};
