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
  (response) => {
    return response.data;
  },
  (error) => {
    // console.log('error axios: ', error.response);
    const errorMessage =
      error.response.data.message || error.response.data.error.message || error.response.statusText;
    return new ApiError({
      statusCode:
        error.response.data.status || error.response.data.error.status || error.response.status,
      message: errorMessage,
    }).rejectError();
  },
);
