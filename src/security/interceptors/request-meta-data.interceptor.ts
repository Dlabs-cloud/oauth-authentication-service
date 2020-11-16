import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RequestMetaData } from '../data/request-meta-data.dto';
import { isBlank } from '@tss/common/utils/string.utlls';

@Injectable()
export class RequestMetaDataInterceptor implements NestInterceptor {

  private proxyIpHeader: string = 'X-REAL-IP';
  private tokenPrefix: string = 'Bearer ';

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    let requestMetaData = new RequestMetaData();
    requestMetaData.accessClaims = null;
    requestMetaData.accessToken = this.getAccessToken(request);
    requestMetaData.ipAddress = this.getIpAddress(request);
    requestMetaData.localHost = RequestMetaDataInterceptor.isIpLocalHost(this.getIpAddress(request));
    requestMetaData.userAgent = request.headers['user-agent'];
    request.metadata = requestMetaData;
    return next.handle();
  }


  public accessClaims(){

  }

  private getIpAddress(request) {
    const ipAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    return !isBlank(request.headers[this.proxyIpHeader]) ? request.headers[this.proxyIpHeader] : ipAddress;
  }


  private static isIpLocalHost(ipAddress: string) {
    let possibleIpAddress = ['127.0.0.1', '0:0:0:0:0:0:0:1', '::1', '::ffff:127.0.0.1'];
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