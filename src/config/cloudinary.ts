import { v2 as cloudinary } from 'cloudinary';
import { env } from './environment';

cloudinary.config({
  cloud_name: 'ds3ifxwxb',
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  //   secure_distribution: 'mydomain.com',
  //   upload_prefix: 'myprefix.com',
  secure: true,
});

module.exports = cloudinary;
