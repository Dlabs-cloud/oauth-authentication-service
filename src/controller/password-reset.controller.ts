import { Body, Controller, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { Public } from '../security/decorators/public.decorator';
import { Connection } from 'typeorm';
import { AccessClaimsExtractor } from '../security/contracts/access-claims-extractor.contracts';
import { PASSWORDCLAIMEXTRACTOR } from '../security/constants';
import { TokenExpiredError } from 'jsonwebtoken';
import { ErrorResponseException } from '@dlabs/common/exceptions/error-response.exception';
import { PasswordResetRequestRepository } from '../dao/password-reset-request.repository';
import { PasswordResetApiRequest } from '../data/request/password-reset-api.request';
import { PasswordUpdateService } from '../service/password-update.service';
import { RequestMetaDataContext } from '../security/decorators/request-meta-data.decorator';
import { RequestMetaData } from '../security/data/request-meta-data.dto';
import { AccessTokenApiResponseHandler } from './handler/access-token-api-response.handler';
import { ApiResponseDto } from '../data/response/api.response.dto';
import { AccessTokenApiResponse } from '../data/response/access-token-api.response';

@Controller()
@Public()
export class PasswordResetController {

  constructor(private readonly connection: Connection,
              private readonly accessTokenApiResponseHandler: AccessTokenApiResponseHandler,
              @Inject(PasswordUpdateService) private readonly passwordUpdateService: PasswordUpdateService,
              @Inject(PASSWORDCLAIMEXTRACTOR) private readonly accessClaimsExtractor: AccessClaimsExtractor) {
  }

  @Post('/password/:identifier/:resetToken')
  resetPasswordWithResetToken(@Param('identifier') identifier: string,
                              @Param('resetToken') resetToken: string,
                              @RequestMetaDataContext() requestMetaData: RequestMetaData,
                              @Body() request: PasswordResetApiRequest): Promise<ApiResponseDto<AccessTokenApiResponse>> {

    try {
      return this.accessClaimsExtractor.getClaims(resetToken)
        .then(claims => {
          if (!claims) {
            throw new ErrorResponseException(HttpStatus.FORBIDDEN, 'Token is not valid');
          }
          const passwordRequestId = Number(claims.getId());
          return this.connection
            .getCustomRepository(PasswordResetRequestRepository)
            .findOne({
              id: passwordRequestId,
            });
        }).then(passwordResetRequest => {
          if (passwordResetRequest.usedOn) {
            throw new ErrorResponseException(HttpStatus.FORBIDDEN, 'Token has already been used');
          }
          if (passwordResetRequest.portalUserIdentifier.identifier !== identifier) {
            throw new ErrorResponseException(HttpStatus.FORBIDDEN, 'Identifier does not match with token');
          }
          return this.passwordUpdateService.updatePassword(passwordResetRequest, request, requestMetaData);
        }).then(portalUserAuthentication => {
          return this.accessTokenApiResponseHandler.getAccessToken(portalUserAuthentication);
        }).then(accessTokenApiResponse => {
          return new ApiResponseDto(HttpStatus.CREATED, accessTokenApiResponse);
        });
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new ErrorResponseException(HttpStatus.FORBIDDEN, 'Reset token is expired');
      }
      throw e;
    }

  }
}
