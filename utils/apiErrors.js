export class ApiError extends Error {
  constructor(code, message) {
    super();
    this.message = message;
    this.code = code;
  }
}
