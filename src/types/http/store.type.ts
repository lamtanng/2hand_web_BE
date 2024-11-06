import { StoreProps } from "../model/store.type";
import { UserProps } from "../model/user.type";

export type CreateStoreRequestProps = StoreProps & Pick<UserProps, 'phoneNumber'>