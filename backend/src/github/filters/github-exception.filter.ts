import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class GithubExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string;
    let error: string;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
      error = '';
    } else {
      const resp = exceptionResponse as Record<string, unknown>;
      message = Array.isArray(resp.message)
        ? (resp.message as string[]).join(', ')
        : (resp.message as string) || exception.message;
      error = (resp.error as string) || '';
    }

    response.status(statusCode).json({
      statusCode,
      message,
      error,
    });
  }
}
