import { ProductProps } from '../model/product.type';

export type DeleteProductRequestProps = Pick<ProductProps, '_id'>;
export type ToggleProductRequestProps = Pick<ProductProps, '_id'>;
export interface UpdateProductRequestProps extends ProductProps {}
