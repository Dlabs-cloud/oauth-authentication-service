import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ErrorResponseException } from '@tss/common/exceptions/error-response.exception';
import { Response } from 'express';
import { APP_FILTER } from '@nestjs/core';

@Catch(ErrorResponseException)
export class ErrorResponseExceptionFilter implements ExceptionFilter {
  catch(exception: ErrorResponseException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response
      .status(400)
      .json({
        code: exception.status,
        message: exception.response.message,
      });
  }

}

export const errorResponseFilter = {
  provide: APP_FILTER,
  useClass: ErrorResponseExceptionFilter,
};
