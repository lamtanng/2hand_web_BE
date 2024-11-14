import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './config/db_mongoose';
import { env } from './config/environment';
import { corsOptions } from './constants/corsOptions';
import { V1_ROUTE } from './constants/routes';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { APIs_V1 } from './routers/v1';
import cookieParser from 'cookie-parser';

const exitHook = require('async-exit-hook');
dotenv.config();

const startServer = () => {
  const app = express();

  // enable req.body json parsing
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  //enable read cookie
  app.use(cookieParser());

  //enable cors
  app.use(cors(corsOptions));

  // app routes
  app.use(V1_ROUTE, APIs_V1);

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`I am running server`);
  });

  //middleware for error handling
  app.use(errorHandler);

  // Close the DB connection when the Node process is terminated
  exitHook(() => {
    // closeDB();
    console.log('Disconnected from MongoDB');
  });
};

//anonymous async function (IIFE)
(async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB successfully');
    startServer();
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(0);
  }
})();
