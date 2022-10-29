import { Module } from '@nestjs/common';
import { ServiceModule } from '../service/service.module';
import { DaoModule } from '../dao/dao.module';
import { PortalUserIdentifierVerificationController } from './portal-user-identifier-verification.controller';
import {
  ResponseTransformInterceptor,
  responseTransformInterceptor,
} from '@dlabs/common/interceptors/response-transform.interceptor';
import { AccessTokenApiResponseHandler } from './handler/access-token-api-response.handler';
import { SecurityModule } from '../security/security.module';
import { PortalUserRegistrationController } from './portal-user-registration.controller';
import { errorResponseFilter } from '@dlabs/common/exception-filters/error-response.exception.filter';
import { illegalArgumentExceptionFilter } from '@dlabs/common/exception-filters/illegal-argument.exception.filter';
import { AccessTokenController } from './access-token.controller';
import { PasswordResetRequestController } from './password-reset-request.controller';
import { PasswordResetController } from './password-reset.controller';
import { SignatureKeyController } from './signature-key.controller';
import { LoginController } from './login.controller';
import { IndexController } from './index.controller';
import { ClientHandler } from './handler/client.handler';
import { ClientController } from './client.controller';

@Module({
  imports: [
    ServiceModule,
    DaoModule,
    SecurityModule,
  ],
  controllers: [
    PortalUserIdentifierVerificationController,
    PortalUserRegistrationController,
    LoginController,
    PasswordResetRequestController,
    AccessTokenController,
    PasswordResetController,
    IndexController,
    SignatureKeyController,
    ClientController,
  ],
  providers: [
    ResponseTransformInterceptor,
    AccessTokenApiResponseHandler,
    ClientHandler,
    responseTransformInterceptor,
    errorResponseFilter,
    illegalArgumentExceptionFilter,
  ],
})
export class ControllerModule {
}
