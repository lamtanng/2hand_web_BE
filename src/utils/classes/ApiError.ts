/**
 * Định nghĩa riêng một Class ApiError kế thừa class Error sẵn (điều này cần thiết và là Best Practice vì class Error nó là class built-in sẵn)
 */

export interface ApiErrorProps {
  statusCode: number;
  message: string;
  data?: any;
}

class ApiError extends Error {
  //declare statusCode variable to use 'this' in the constructor
  statusCode: number;
  data?: any;
  constructor({ statusCode, message, data }: ApiErrorProps) {
    super(message);
    // this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
    // Ghi lại Stack Trace (dấu vết ngăn xếp) để thuận tiện cho việc debug
    Error.captureStackTrace(this, this.constructor);
  }
  rejectError = () => Promise.reject(this);
}

export default ApiError;
