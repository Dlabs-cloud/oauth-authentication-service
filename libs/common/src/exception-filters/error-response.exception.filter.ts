import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { APP_FILTER } from '@nestjs/core';
import { ErrorResponseException } from '@tss/common/exceptions/error-response.exception';

@Catch(ErrorResponseException)
export class ErrorResponseExceptionFilter implements ExceptionFilter {
  catch(exception: ErrorResponseException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response
      .status(exception.status)
      .json({
        code: exception.status,
        message: exception.message,
      });
  }

}

export const errorResponseFilter = {
  provide: APP_FILTER,
  useClass: ErrorResponseExceptionFilter,
};
