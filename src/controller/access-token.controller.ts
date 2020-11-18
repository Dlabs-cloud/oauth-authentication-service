import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { AccessTokenRequest } from '../data/request/access-token.request';
import { RequestMetaDataContext } from '../security/decorators/request-meta-data.decorator';
import { RequestMetaData } from '../security/data/request-meta-data.dto';
import { AccessClaimsExtractor } from '../security/contracts/access-claims-extractor.contracts';
import { ACCESSCLAIMEXTRACTOR, REFRESHCLAIMEXTRACTOR } from '../security/constants';
import { ErrorResponseException } from '@tss/common/exceptions/error-response.exception';
import { Connection } from 'typeorm';
import { RefreshTokenRepository } from '../dao/refresh-token.repository';
import { AccessTokenApiResponseHandler } from './handler/access-token-api-response.handler';
import { ApiResponseDto } from '@tss/common/data/api.response.dto';
import { PortalUserAuthenticationFactory } from '../domain/factory/portal-user-authentication.factory';
import { PortalUserAuthenticationRepository } from '../dao/portal-user-authentication.repository';
import { Public } from '../security/decorators/public.decorator';

@Controller()
@Public()
export class AccessTokenController {

  constructor(@Inject(REFRESHCLAIMEXTRACTOR) private readonly accessClaimsExtractor: AccessClaimsExtractor,
              private readonly connection: Connection,
              private readonly accessTokenApiResponseHandler: AccessTokenApiResponseHandler) {
  }

  @Post('/oauth2/token')
  async getAccessToken(@Body() accessTokenRequest: AccessTokenRequest, @RequestMetaDataContext() requestMetaData: RequestMetaData) {
    let accessClaims = await this.accessClaimsExtractor.getClaims(accessTokenRequest.refresh_token);
    if (!accessClaims) {
      throw new ErrorResponseException(HttpStatus.UNAUTHORIZED, 'Un authorised');
    }
    let accessClaimId = Number(accessClaims.getId());
    let refreshToken = await this.connection.getCustomRepository(RefreshTokenRepository).findActive(accessClaimId);
    if (!refreshToken) {
      throw new ErrorResponseException(HttpStatus.UNAUTHORIZED, 'Un authorised');
    }
    let portalUserAuthentication = await this.connection.getCustomRepository(PortalUserAuthenticationRepository).findOne({
      id: refreshToken.portalUserAuthenticationId,
    });
    return this.accessTokenApiResponseHandler.getAccessToken(portalUserAuthentication)
      .then(accessTokenApiResponse => {
        return new ApiResponseDto(HttpStatus.OK, accessTokenApiResponse);
      });

  }
}