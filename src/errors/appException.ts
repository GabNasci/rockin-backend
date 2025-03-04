import { HttpException, HttpStatus } from '@nestjs/common';

export interface AppExceptionProps {
  message: string | string[];
  statusCode?: HttpStatus;
  error?: string;
}

export class AppException extends HttpException {
  constructor({
    message,
    statusCode = HttpStatus.BAD_REQUEST,
    error = 'Bad Request',
  }: AppExceptionProps) {
    super(
      {
        message: Array.isArray(message) ? message : [message],
        error,
        statusCode,
      },
      statusCode,
    );
  }
}
