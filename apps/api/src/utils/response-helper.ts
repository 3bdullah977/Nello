import { HttpStatus } from '@nestjs/common';

export function ok<T = any>(message: string, data: T, created = false) {
  return {
    message,
    statusCode: created ? 201 : 200,
    data,
  };
}

export const res = (message: string, statusCode: HttpStatus) => {
  return {
    message,
    statusCode,
  };
};
