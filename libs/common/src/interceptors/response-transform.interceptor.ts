import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { ApiResponseDto } from '../data/api.response.dto';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { APP_INTERCEPTOR } from '@nestjs/core';

export class ResponseTransformInterceptor<T> implements NestInterceptor<ApiResponseDto<T>> {
  intercept(context: ExecutionContext, next: CallHandler<ApiResponseDto<T>>): Observable<any> | Promise<Observable<any>> {
    const response = context.switchToHttp().getResponse();
    return next.handle().pipe(tap(responseVal => {
      response.status(responseVal.code ?? 200);
    }), map(responseVal => responseVal.data));
  }
}

export const responseTransformInterceptor = {
  provide: APP_INTERCEPTOR,
  useExisting: ResponseTransformInterceptor,
};