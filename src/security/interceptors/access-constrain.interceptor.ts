import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AccessTypes } from '../enums/enum';
import { Reflector } from '@nestjs/core';
import { RequestMetaData } from '../data/request-meta-data.dto';

@Injectable()
export class AccessConstrainInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {
  }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const publicAccessType = this.reflector.getAll(AccessTypes.PUBLIC, [
      context.getHandler(), context.getClass(),
    ]);
    let accessTokenTypes = this.reflector.getAll(AccessTypes.NOTCLIENTTOKEN, [
      context.getHandler(), context.getClass(),
    ]);

    if (publicAccessType.includes(AccessTypes.PUBLIC)) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    let requestMetaData = request.metadata as RequestMetaData;
    if (!requestMetaData.accessToken) {
      throw new UnauthorizedException('Token is not provided');
    }
    if (!requestMetaData.accessClaims) {
      AccessConstrainInterceptor.inValidTokenResponse(requestMetaData);
    }

    if (accessTokenTypes.includes(AccessTypes.NOTCLIENTTOKEN)) {
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