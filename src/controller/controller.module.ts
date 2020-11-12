import { Module } from '@nestjs/common';
import { ServiceModule } from '../service/service.module';
import { DaoModule } from '../dao/dao.module';
import { PortalUserIdentifierVerificationController } from './portal-user-identifier-verification.controller';
import {
  ResponseTransformInterceptor,
  responseTransformInterceptor,
} from '@tss/common/interceptors/response-transform.interceptor';
import { AccessTokenApiResponseHandler } from './handler/access-token-api-response.handler';
import { SecurityModule } from '../security/security.module';
import { PortalUserRegistrationController } from './portal-user-registration.controller';

@Module({
  imports: [
    ServiceModule,
    DaoModule,
    SecurityModule,
  ],
  controllers: [
    PortalUserIdentifierVerificationController,
    PortalUserRegistrationController,
  ],
  providers: [
    ResponseTransformInterceptor,
    AccessTokenApiResponseHandler,
    responseTransformInterceptor,
  ],
})
export class ControllerModule {
}
