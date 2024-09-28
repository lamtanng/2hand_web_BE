/**
 * Định nghĩa riêng một Class ApiError kế thừa class Error sẵn (điều này cần thiết và là Best Practice vì class Error nó là class built-in sẵn)
 */

export interface ApiErrorProps {
  statusCode: number;
  message: string;
}

class ApiError extends Error {
  //declare statusCode variable to use 'this' in the constructor
  statusCode: number;

  constructor({ statusCode, message }: ApiErrorProps) {
    super(message);
    // this.name = 'ApiError';
    this.statusCode = statusCode;

    // Ghi lại Stack Trace (dấu vết ngăn xếp) để thuận tiện cho việc debug
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
