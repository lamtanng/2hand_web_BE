import dotenv from 'dotenv';
import express from 'express';
import { closeDB, connectDB } from './config/mongodb';
import { APIs_V1 } from './routers/v1';
import { V1_ROUTE } from './constants/routes';
import { errorHandlingMiddleware } from './middlewares/errorHandling.middleware';
const exitHook = require('async-exit-hook');

dotenv.config();

const startServer = () => {
  const app = express();

  // enable req.body json parsing
  app.use(express.json());

  // V1_API routes
  app.use(V1_ROUTE, APIs_V1);

  app.listen(8017, 'localhost', () => {
    console.log(`I am running server`);
  });

  //middleware for error handling
  app.use(errorHandlingMiddleware);

  // Close the DB connection when the Node process is terminated
  exitHook(() => {
    closeDB();
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
