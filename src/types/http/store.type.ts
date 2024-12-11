import { StoreProps } from '../model/store.type';
import { UserProps } from '../model/user.type';

export type CreateStoreRequestProps = StoreProps & Pick<UserProps, 'phoneNumber'>;
export interface UpdateStoreRequestProps
  extends Pick<StoreProps, '_id' | 'address' | 'avatar' | 'coverImg' | 'name' | 'description'> {}
