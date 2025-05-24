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
import exitHook from 'async-exit-hook';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { verifyAccessToken } from './utils/jwt';
import { DecodedTokenProps } from './types/token.type';
dotenv.config();

// Khai báo global.socketIO để có thể truy cập từ bất kỳ đâu
declare global {
  var socketIO: Server | null;
}

// Khởi tạo global.socketIO
global.socketIO = null;

const startServer = () => {
  const app = express();
  const server = http.createServer(app);

  // Set up Socket.IO with CORS
  const io = new Server(server, {
    cors: {
      origin: corsOptions.origin,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Lưu Socket.IO instance vào biến global để có thể truy cập từ mọi nơi
  global.socketIO = io;

  // Make io accessible to our route handlers
  app.set('io', io);

  // Socket.IO authentication and connection setup
  io.use(async (socket, next) => {
    // Get token from handshake auth or query params
    const token = socket.handshake.auth.token || socket.handshake.query.token;

    if (!token) {
      return next(new Error('Authentication error: Token not provided'));
    }

    try {
      const decodedToken = (await verifyAccessToken(token)) as DecodedTokenProps;
      socket.data.user = decodedToken;
      socket.join(decodedToken._id.toString());
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Socket.IO connection event
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a room with the user's ID for private notifications
    if (socket.data.user && socket.data.user._id) {
      socket.join(socket.data.user._id);
      console.log(`User ${socket.data.user._id} joined their private room`);
    }

    // Disconnect event
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  // enable req.body json parsing
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  //enable read cookie
  app.use(cookieParser());

  //enable cors
  app.use(cors(corsOptions));

  // app routes
  app.use(V1_ROUTE, APIs_V1);

  //middleware for error handling
  app.use(errorHandler);

  // Start the server with http module instead of app.listen
  server.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Server running on http://${env.APP_HOST}:${env.APP_PORT}`);
  });

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
