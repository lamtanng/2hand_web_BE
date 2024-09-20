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
    // Gọi tới hàm khởi tạo của class Error (class cha) để còn dùng this (kiến thức OOP lập trình hướng đối tượng căn bản)
    super(message);

    // Tên của cái custom Error này, nếu không set thì mặc định nó sẽ kế thừa là "Error"
    this.name = 'ApiError';

    // Gán thêm http status code của chúng ta ở đây, phải khai báo trước
    this.statusCode = statusCode;

    // Ghi lại Stack Trace (dấu vết ngăn xếp) để thuận tiện cho việc debug
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
