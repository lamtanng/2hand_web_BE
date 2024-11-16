import { appCloudinary } from '../config/cloudinary';
import ApiError from '../utils/classes/ApiError';

interface UploadCloudinaryProps {
  files: string[];
  asset_folder: string;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
}

const uploadCloudinary = async ({ files, asset_folder, resource_type }: UploadCloudinaryProps) => {
  if (!files.length) return [];

  const uploadedFiles = files.map(async (file) => {
    return await appCloudinary.uploader.upload(file, {
      asset_folder: asset_folder,
      resource_type: resource_type,
      notification_url: 'http://localhost:5173/image',
      // public_id: 'product-test',
      // upload_preset: 'test',
      // use_asset_folder_as_public_id_prefix: true,
    });
  });
  const savedFiles = await Promise.all(uploadedFiles);
  if (savedFiles.length === 0) {
    return new ApiError({ message: 'No file uploaded', statusCode: 400 }).rejectError();
  }
  return savedFiles;
};

export { uploadCloudinary, UploadCloudinaryProps };
