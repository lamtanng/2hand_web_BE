import { Db, MongoClient, ServerApiVersion } from 'mongodb';
import { env } from './environment';

let dbInstance: Db | null = null;

let client = new MongoClient(env.MONGO_URI as string, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const connectDB = async () => {
  try {
    await client.connect();
    dbInstance = client.db(env.MONGO_NAME);
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
};

export const getDB = () => {
  if (!dbInstance) throw new Error('Must connect to DB before calling getDB');
  return dbInstance;
};

export const closeDB = async () => {
  await client.close();
};
