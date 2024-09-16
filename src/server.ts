import dotenv from 'dotenv';
import express from 'express';
import { env } from './config/environment';
import { closeDB, connectDB, getDB } from './config/mongodb';
const exitHook = require('async-exit-hook');

dotenv.config();

const startServer = () => {
  const app = express();

  app.get('/', async (req, res) => {
    res.end('<h1>Hello !</h1><hr>');
  });

  app.listen(8017, 'localhost', () => {
    console.log(`I am running server`);
  });

  exitHook(() => {
    closeDB();
    console.log('Disconnected from MongoDB');
  });
};

//anonymous async function (IIFE)
(async () => {
  try {
    console.log('>>>> URI', env.MONGO_URI);

    await connectDB();
    console.log('Connected to MongoDB successfully');
    startServer();
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(0);
  }
})();
