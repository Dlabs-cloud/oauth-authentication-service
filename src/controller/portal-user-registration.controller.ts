import { Body, Controller, Inject, Post } from '@nestjs/common';
import { PortalUserRegistrationService } from '../service/portal-user-registration.service';
import { UserRegistrationApiRequest } from '../data/request/user-registration-api.request';

@Controller()
export class PortalUserRegistrationController {

  constructor(@Inject(PortalUserRegistrationService) private readonly portalUserRegistrationService: PortalUserRegistrationService) {
  }

  @Post('/users')
  public registerUser(@Body() request: UserRegistrationApiRequest) {
    this.portalUserRegistrationService.register(request);
  }
}