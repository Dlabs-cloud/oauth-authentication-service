import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { PortalUserRegistrationService } from '../service/portal-user-registration.service';
import { UserRegistrationApiRequest } from '../data/request/user-registration-api.request';
import { RequestMetaDataContext } from '../security/decorators/request-meta-data.decorator';
import { RequestMetaData } from '../security/data/request-meta-data.dto';
import { ApiResponseDto } from '@tss/common/data/api.response.dto';
import { AccessTokenApiResponseHandler } from './handler/access-token-api-response.handler';
import { Public } from '../security/decorators/public.decorator';
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { AccessTokenApiResponse } from '../data/response/access-token-api.response';

@Controller()
@Public()
export class PortalUserRegistrationController {

  constructor(@Inject(PortalUserRegistrationService) private readonly portalUserRegistrationService: PortalUserRegistrationService,
              protected readonly accessTokenApiResponseHandler: AccessTokenApiResponseHandler) {
  }

  @Post('/users')
  @ApiCreatedResponse({ type: AccessTokenApiResponse })
  public async registerUser(@Body() request: UserRegistrationApiRequest, @RequestMetaDataContext() requestMetaData: RequestMetaData) {
    let portalUserAuthentication = await this.portalUserRegistrationService.register(request, requestMetaData);
    if (!request.password) {
      let portalUser = portalUserAuthentication.portalUser;
      return new ApiResponseDto(HttpStatus.CREATED, new AccessTokenApiResponse(portalUser));
    }
    return this.accessTokenApiResponseHandler.getAccessToken(portalUserAuthentication)
      .then(accessTokenApiResponse => {
        return new ApiResponseDto(HttpStatus.CREATED, accessTokenApiResponse);
      });
  }
}