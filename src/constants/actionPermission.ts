import { CATEGORY_COLLECTION_NAME } from '../models/category/category.doc';
import { ORDER_COLLECTION_NAME } from '../models/order/order.doc';
import { PRODUCT_COLLECTION_NAME } from '../models/product/product.doc';
import { USER_COLLECTION_NAME } from '../models/user/user.doc';
import { generateModelAction } from '../utils/getPermissionAction';

const User = generateModelAction(USER_COLLECTION_NAME);
const Product = generateModelAction(PRODUCT_COLLECTION_NAME);
const Category = generateModelAction(CATEGORY_COLLECTION_NAME);
const Order = generateModelAction(ORDER_COLLECTION_NAME);

export const ActionPermission = { User, Product, Category, Order };
