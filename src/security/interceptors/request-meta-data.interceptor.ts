import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RequestMetaData } from '../data/request-meta-data.dto';
import { isBlank } from '@dlabs/common/utils/string.utlls';
import { AccessClaimsExtractor } from '../contracts/access-claims-extractor.contracts';
import { ACCESSCLAIMEXTRACTOR } from '../constants';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class RequestMetaDataInterceptor implements NestInterceptor {


  constructor(@Inject(ACCESSCLAIMEXTRACTOR) private readonly accessClaimsExtractor: AccessClaimsExtractor) {
  }

  private proxyIpHeader = 'X-REAL-IP';
  private tokenPrefix = 'Bearer ';

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const requestMetaData = new RequestMetaData();
    requestMetaData.accessClaims = await this.accessClaims(request, requestMetaData);
    requestMetaData.accessToken = this.getAccessToken(request);
    requestMetaData.ipAddress = this.getIpAddress(request);
    requestMetaData.localHost = RequestMetaDataInterceptor.isIpLocalHost(this.getIpAddress(request));
    requestMetaData.userAgent = request.headers['user-agent'];
    requestMetaData.host = request.headers['host'];
    request.metadata = requestMetaData;
    return next.handle();
  }


  private async accessClaims(request, requestMetaData: RequestMetaData) {
    const accessToken = this.getAccessToken(request);
    if (!accessToken) {
      return null;
    }
    try {
      const claims = await this.accessClaimsExtractor.getClaims(accessToken);
      if (!claims) {
        return null;
      }
      return claims;
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        requestMetaData.tokenExpired = true;
      }
    }

  }

  private getIpAddress(request) {
    const ipAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    return !isBlank(request.headers[this.proxyIpHeader]) ? request.headers[this.proxyIpHeader] : ipAddress;
  }


  private static isIpLocalHost(ipAddress: string) {
    const possibleIpAddress = ['127.0.0.1', '0:0:0:0:0:0:0:1', '::1', '::ffff:127.0.0.1'];
    return possibleIpAddress.includes(ipAddress);
  }

  private getAccessToken(request): string | null {
    const authorisationToken = request.header('Authorization');
    if (authorisationToken) {
      if (authorisationToken.startsWith(this.tokenPrefix)) {
        return authorisationToken.substring(this.tokenPrefix.length);
      }
    }
    return null;
  }

}
