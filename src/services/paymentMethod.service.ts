import { Request, Response } from 'express';
import { PaymentMethodModel } from '../models/paymentMethod';
import { PaymentMethodDocument } from '../models/paymentMethod/paymentMethod.doc';

const findAll = async (reqBody: Request, res: Response) => {
  try {
    const methods = await PaymentMethodModel.find({});
    return { methods };
  } catch (error) {
    console.error(error);
  }
};

const addMethod = async (reqBody: PaymentMethodDocument, res: Response) => {
  try {
    const method = reqBody;

    const newMethod = await PaymentMethodModel.create(method);
    return { newMethod };
  } catch (error) {
    console.error(error);
  }
};

export const paymentMethodService = { findAll, addMethod };
