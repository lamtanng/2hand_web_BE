import mongoose from 'mongoose';
import { ROLE_COLLECTION_NAME, ROLE_COLLECTION_SCHEMA, RoleDocument } from './role.doc';

export const RoleModel = mongoose.model<RoleDocument>(ROLE_COLLECTION_NAME, ROLE_COLLECTION_SCHEMA);
