import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { LoginAuthenticationService } from '../service/login-authentication.service';
import { AccessTokenApiResponseHandler } from './handler/access-token-api-response.handler';
import { ApiOkResponse } from '@nestjs/swagger';
import { AccessTokenApiResponse } from '../data/response/access-token-api.response';
import { LoginRequest } from '../data/request/login.request';
import { RequestMetaDataContext } from '../security/decorators/request-meta-data.decorator';
import { RequestMetaData } from '../security/data/request-meta-data.dto';
import { AuthenticationResponseType } from '../domain/constants/authentication-response-type,constant';
import { ErrorResponseException } from '@tss/common/exceptions/error-response.exception';
import { ApiResponseDto } from '@tss/common/data/api.response.dto';
import { Public } from '../security/decorators/public.decorator';

@Controller()
@Public()
export class LoginController {
  constructor(@Inject(LoginAuthenticationService) private readonly loginAuthenticationService: LoginAuthenticationService,
              protected readonly accessTokenApiResponseHandler: AccessTokenApiResponseHandler) {
  }

  @Post('/login')
  @ApiOkResponse({ type: AccessTokenApiResponse })
  async login(@Body() loginRequest: LoginRequest, @RequestMetaDataContext() requestMetaData: RequestMetaData) {
    const portalUserAuthentication = await this.loginAuthenticationService.getAuthenticationResponse(loginRequest, requestMetaData);
    if (portalUserAuthentication.responseType !== AuthenticationResponseType.SUCCESSFUL) {
      if (portalUserAuthentication.responseType == AuthenticationResponseType.UNKNOWN_ACCOUNT) {
        throw new ErrorResponseException(HttpStatus.UNAUTHORIZED, 'UnAuthorized ');
      }
      throw new ErrorResponseException(HttpStatus.UNAUTHORIZED, 'UnAuthorized');
    }

    return this.accessTokenApiResponseHandler.getAccessToken(portalUserAuthentication)
      .then(accessTokenApiResponse => {
        return new ApiResponseDto(HttpStatus.OK, accessTokenApiResponse);
      });

  }
}
