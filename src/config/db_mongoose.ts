import mongoose from 'mongoose';
import { env } from './environment';

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI, {
      dbName: env.MONGO_NAME,
    });
  } catch (error) {
    process.exit(0);
  }
};
