import { CategoryProps } from '../model/category.type';

export interface AddCategoryRequestProps
  extends Pick<CategoryProps, 'name' | 'parentID' | 'image'> {}
export interface UpdateCategoryRequestProps extends CategoryProps {}
