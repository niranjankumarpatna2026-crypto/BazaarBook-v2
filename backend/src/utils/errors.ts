export class AppError extends Error {
  statusCode: number;
  code?: string;
  field?: string;
  constructor(message: string, statusCode = 400, opts?: { code?: string; field?: string }) {
    super(message);
    this.statusCode = statusCode;
    this.code = opts?.code;
    this.field = opts?.field;
  }
}
export const BadRequest = (msg: string, field?: string) => new AppError(msg, 400, { field });
export const Unauthorized = (msg = 'Login zaroori') => new AppError(msg, 401);
export const Forbidden = (msg = 'Permission nahi') => new AppError(msg, 403);
export const NotFound = (msg = 'Nahi mila') => new AppError(msg, 404);
export const Conflict = (msg: string, field?: string) => new AppError(msg, 409, { field });
