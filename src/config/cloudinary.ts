import { v2 as cloudinary } from 'cloudinary';
import { env } from './environment';
const appCloudinary = cloudinary;
appCloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  //   secure_distribution: 'mydomain.com',
//   upload_prefix: 'myprefix.com',
  secure: true,
});

export { appCloudinary };
