import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { productService } from '../services/product.service';
import { catchErrors } from '../utils/catchErrors';

const findAll = catchErrors(async (req: Request, res: Response) => {
  const result = await productService.findAll(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const findOneById = catchErrors(async (req: Request, res: Response) => {
  const result = await productService.findOneById(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const findOneBySlug = catchErrors(async (req: Request, res: Response) => {
  const result = await productService.findOneBySlug(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const addProduct = catchErrors(async (req: Request, res: Response) => {
  const result = await productService.addProduct(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const updateProduct = catchErrors(async (req: Request, res: Response) => {
  const result = await productService.updateProduct(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const deleteProduct = catchErrors(async (req: Request, res: Response) => {
  const result = await productService.deleteProduct(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const toggleActiveProduct = catchErrors(async (req: Request, res: Response) => {
  const result = await productService.toggleActiveProduct(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const createEmbeddingData = catchErrors(async (req: Request, res: Response) => {
  const result = await productService.createEmbeddingData();
  res.status(StatusCodes.OK).json(result).send();
});

const getProductByEmbedding = catchErrors(async (req: Request, res: Response) => {
  const result = await productService.getProductByEmbedding(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const updateProductsApproval = catchErrors(async (req: Request, res: Response) => {
  const result = await productService.updateProductsApproval(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const getHistoryProducts = catchErrors(async (req: Request, res: Response) => {
  const result = await productService.getHistoryProducts(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const productController = {
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
  getHistoryProducts,
};
