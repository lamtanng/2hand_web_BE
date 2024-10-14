import { ActionPermission } from '../constants/actionPermission';
import { Role } from '../types/enum/role.enum';
import { RoleProps } from '../types/model/role.type';

const { Category, User, Product } = ActionPermission;

const customerPermission = [Category.Read, User.Read, User.Update, Product.Read];
const sellerPermission = [...customerPermission, Product.Create, Product.Update];
const adminPermission = Object.values(Category).concat(Object.values(User), Object.values(Product));
export const appRole: Omit<RoleProps, '_id'>[] = [
  {
    name: Role.Admin,
    permission: adminPermission,
  },
  {
    name: Role.Seller,
    permission: sellerPermission,
  },
  {
    name: Role.Customer,
    permission: customerPermission,
  },
];
