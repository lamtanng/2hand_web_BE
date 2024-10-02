import { MongoClient } from 'mongodb';
import { ROLE_COLLECTION_NAME, RoleDocument } from '../models/role/role.schema';
import { Request, Response } from 'express';
import { env } from '../../config/environment';
import { RoleModel } from '../models/role/role.model';
import mongoose from 'mongoose';

const findAll = async (reqBody: Request, res: Response) => {
  try {
    const roles = await RoleModel.find({});
    return { roles };
  } catch (error) {
    console.error(error);
  }
};

const addRole = async (reqBody: RoleDocument, res: Response) => {
  try {
    const role = reqBody;

    const newRole = await RoleModel.create(role);
    return {newRole};
  } catch (error) {
    console.error(error);
  }
}

export const roleService = { findAll, addRole };
