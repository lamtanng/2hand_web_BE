import { Types } from 'mongoose';

export interface SearchHistoryProps {
  userId: Types.ObjectId;
  searchText: string;
  searchTextUnaccented: string;
  slug: string;
  embedding: number[];
  createdAt: Date;
}
