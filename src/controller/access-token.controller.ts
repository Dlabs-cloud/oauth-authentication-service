import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { AccessTokenRequest } from '../data/request/access-token.request';
import { AccessClaimsExtractor } from '../security/contracts/access-claims-extractor.contracts';
import { REFRESHCLAIMEXTRACTOR } from '../security/constants';
import { ErrorResponseException } from '@dlabs/common/exceptions/error-response.exception';
import { Connection } from 'typeorm';
import { RefreshTokenRepository } from '../dao/refresh-token.repository';
import { AccessTokenApiResponseHandler } from './handler/access-token-api-response.handler';
import { ApiResponseDto } from '../data/response/api.response.dto';
import { PortalUserAuthenticationRepository } from '../dao/portal-user-authentication.repository';
import { Public } from '../security/decorators/public.decorator';
import { AccessTokenApiResponse } from '../data/response/access-token-api.response';

@Controller()
@Public()
export class AccessTokenController {

  constructor(@Inject(REFRESHCLAIMEXTRACTOR) private readonly accessClaimsExtractor: AccessClaimsExtractor,
              private readonly connection: Connection,
              private readonly accessTokenApiResponseHandler: AccessTokenApiResponseHandler) {
  }

  @Post('/oauth2/token')
  async getAccessToken(@Body() accessTokenRequest: AccessTokenRequest): Promise<ApiResponseDto<AccessTokenApiResponse>> {
    const accessClaims = await this.accessClaimsExtractor.getClaims(accessTokenRequest.refresh_token);
    if (!accessClaims) {
      throw new ErrorResponseException(HttpStatus.UNAUTHORIZED, 'Un authorised');
    }
    const accessClaimId = Number(accessClaims.getId());
    const refreshToken = await this.connection.getCustomRepository(RefreshTokenRepository).findActive(accessClaimId);
    if (!refreshToken) {
      throw new ErrorResponseException(HttpStatus.UNAUTHORIZED, 'Un authorised');
    }
    const portalUserAuthentication = await this.connection.getCustomRepository(PortalUserAuthenticationRepository).findOne({
      id: refreshToken.portalUserAuthenticationId,
    });
    return this.accessTokenApiResponseHandler.getAccessToken(portalUserAuthentication)
      .then(accessTokenApiResponse => {
        return new ApiResponseDto(HttpStatus.OK, accessTokenApiResponse);
      });

  }
}
