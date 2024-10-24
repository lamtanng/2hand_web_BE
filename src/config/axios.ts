import axios from 'axios';
import { MOMO } from '../constants/momo';

const baseURL = MOMO.baseURL;
const timeout = 30000;
const headers = {
  'Content-Type': 'application/json',
  'Content-Encoding': 'utf8',
};

export const axiosClient = axios.create({ baseURL, timeout, headers });

axiosClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
);
