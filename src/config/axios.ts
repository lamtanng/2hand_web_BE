import axios from 'axios';
import ApiError from '../utils/classes/ApiError';

const timeout = 30000;
const headers = {
  'Content-Type': 'application/json',
  'Content-Encoding': 'utf8',
};

export const axiosClient = axios.create({ timeout, headers });
axiosClient.interceptors.request.use(
  (config) => config,
  (error) =>
    new ApiError({
      statusCode: error.response.status,
      message: error.response.statusText,
    }).rejectError(),
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) =>
    new ApiError({
      statusCode: error.response.status,
      message: error.response.statusText,
    }).rejectError(),
);
