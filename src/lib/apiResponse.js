// src/lib/apiResponse.js

export class ApiResponse {
  constructor(success, data = null, message = '', error = null, statusCode = 200) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.error = error;
    this.timestamp = new Date().toISOString();
    this.statusCode = statusCode;
  }

  static success(data = null, message = 'Operation successful', statusCode = 200) {
    return new ApiResponse(true, data, message, null, statusCode);
  }

  static error(error, message = 'Operation failed', statusCode = 500) {
    return new ApiResponse(false, null, message, error, statusCode);
  }

  static validationError(errors, message = 'Validation failed', statusCode = 400) {
    return new ApiResponse(false, null, message, { type: 'validation', details: errors }, statusCode);
  }

  toResponse() {
    return new Response(JSON.stringify(this), {
      status: this.statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// ✅ دالة لإنشاء رد خطأ وتسجيله في الـ console
export const createErrorResponse = (error, message, statusCode = 500) => {
  console.error('API Error:', error);
  return ApiResponse.error(
    process.env.NODE_ENV === 'development' ? error.toString() : 'Internal server error',
    message,
    statusCode
  ).toResponse();
};

// ✅ هذه هي الدوال التي كنت تحاول استيرادها
export const successResponse = (data, message = 'Operation successful', statusCode = 200) => {
  return ApiResponse.success(data, message, statusCode).toResponse();
};

export const errorResponse = (error, message = 'Operation failed', statusCode = 500) => {
  return ApiResponse.error(error, message, statusCode).toResponse();
};
