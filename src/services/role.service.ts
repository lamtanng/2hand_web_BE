import { Request, Response } from 'express';
import { RoleModel } from '../models/role';
import { RoleDocument } from '../models/role/role.doc';
import { catchServiceFunc } from '../utils/catchErrors';

const findAll = async (reqBody: Request, res: Response) => {
  try {
    const roles = await RoleModel.find({});
    return { roles };
  } catch (error) {
    console.error(error);
  }
};

const addRole = catchServiceFunc(async (req: Request, res: Response) => {
  const role = req.body;
  const newRole = await RoleModel.create(role);
  return { newRole };
});

const updateRole = catchServiceFunc(async (req: Request, res: Response) => {
  const { _id, name, permission } = req.body;
  const role = await RoleModel.findById({ _id });
  if (!role) {
    return { error: 'Role not found' };
  }
  role.permission = [...new Set(role.permission?.concat(permission))];
  role.name = name || role.name;
  const updatedRole = await role.save();
  return updatedRole;
});

export const roleService = { findAll, addRole, updateRole };
