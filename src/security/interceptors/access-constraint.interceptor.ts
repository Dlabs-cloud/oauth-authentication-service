import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AccessTypes } from '../enums/enum';
import { Reflector } from '@nestjs/core';
import { RequestMetaData } from '../data/request-meta-data.dto';

@Injectable()
export class AccessConstraintInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {
  }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const publicAccessType = this.reflector.getAll(AccessTypes.PUBLIC, [
      context.getHandler(), context.getClass(),
    ]);
    const accessTokenTypes = this.reflector.getAll(AccessTypes.ACCESS_TOKEN_REQUEST, [
      context.getHandler(), context.getClass(),
    ]);

    if (publicAccessType.includes(AccessTypes.PUBLIC)) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const requestMetaData = request.metadata as RequestMetaData;
    if (!requestMetaData.accessToken) {
      throw new UnauthorizedException('Token is not provided');
    }
    if (!requestMetaData.accessClaims) {
      AccessConstraintInterceptor.inValidTokenResponse(requestMetaData);
    }

    if (accessTokenTypes.includes(AccessTypes.ACCESS_TOKEN_REQUEST)) {
      if (requestMetaData.accessClaims.getAudience().length) {
        throw new UnauthorizedException('Access is only for authorised audience');
      }
    }

    return next.handle();
  }

  private static inValidTokenResponse(requestMetaData: RequestMetaData) {
    if (requestMetaData.tokenExpired) {
      throw new UnauthorizedException('Token is expired');
    }
    throw new UnauthorizedException('Invalid token');
  }

}
