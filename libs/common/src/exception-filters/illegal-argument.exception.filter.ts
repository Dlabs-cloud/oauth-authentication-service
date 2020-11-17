import { IllegalArgumentException } from '@tss/common';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { APP_FILTER } from '@nestjs/core';

@Catch(IllegalArgumentException)
export class IllegalArgumentExceptionFilter implements ExceptionFilter {

  catch(exception: IllegalArgumentException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response
      .status(400)
      .json({
        code: 400,
        message: exception.message,
      });
  }
}

export const illegalArgumentExceptionFilter = {
  provide: APP_FILTER,
  useClass: IllegalArgumentExceptionFilter,
};
