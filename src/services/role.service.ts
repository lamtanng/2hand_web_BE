import { Request, Response } from 'express';
import { RoleModel } from '../models/role';
import { RoleDocument } from '../models/role/role.doc';

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
    return { newRole };
  } catch (error) {
    console.error(error);
  }
};

export const roleService = { findAll, addRole };
