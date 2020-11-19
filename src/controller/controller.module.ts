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
import { LoginAuthenticationController } from './login-authentication.controller';
import { errorResponseFilter } from '@tss/common/exception-filters/error-response.exception.filter';
import { illegalArgumentExceptionFilter } from '@tss/common/exception-filters/illegal-argument.exception.filter';
import { AccessTokenController } from './access-token.controller';
import { PasswordResetRequestController } from './password-reset-request.controller';

@Module({
  imports: [
    ServiceModule,
    DaoModule,
    SecurityModule,
  ],
  controllers: [
    PortalUserIdentifierVerificationController,
    PortalUserRegistrationController,
    LoginAuthenticationController,
    PasswordResetRequestController,
    AccessTokenController,
  ],
  providers: [
    ResponseTransformInterceptor,
    AccessTokenApiResponseHandler,
    responseTransformInterceptor,
    errorResponseFilter,
    illegalArgumentExceptionFilter,
  ],
})
export class ControllerModule {
}
