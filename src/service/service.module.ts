import { PortalUserIdentifierVerificationService } from './portal-user-identifier-verification.service';
import { forwardRef, Module } from '@nestjs/common';
import { PortalUserIdentifierVerificationServiceImpl } from '../service-impl/portal-user-identifier-verification.service-impl';
import { ServiceImplModule } from '../service-impl/service-impl.module';
import { VerificationEmailSenderService } from './verification-email-sender.service';
import { VerificationEmailSenderServiceImpl } from '../service-impl/verification-email-sender.service-impl';
import { PortalUserRegistrationServiceImpl } from '../service-impl/portal-user-registration.service-impl';
import { PortalUserRegistrationService } from './portal-user-registration.service';
import { ImplicitAuthenticationService } from './implicit-authentication.service';
import { ImplicitAuthenticationServiceImpl } from '../service-impl/implicit-authentication.service-impl';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshTokenServiceImpl } from '../service-impl/refresh-token.service-impl';
import { LoginAuthenticationService } from './login-authentication.service';
import { LoginAuthenticationServiceImpl } from '../service-impl/login-authentication.service-impl';

let portalUserIdentifierService = {
  provide: PortalUserIdentifierVerificationService,
  useExisting: PortalUserIdentifierVerificationServiceImpl,
};

let loginAuthenticationService = {
  provide: LoginAuthenticationService,
  useExisting: LoginAuthenticationServiceImpl,
};
let verificationEmailSenderService = {
  provide: VerificationEmailSenderService,
  useExisting: VerificationEmailSenderServiceImpl,
};

let portalUserRegistrationService = {
  provide: PortalUserRegistrationService,
  useExisting: PortalUserRegistrationServiceImpl,
};

let implicitAuthenticationService = {
  provide: ImplicitAuthenticationService,
  useExisting: ImplicitAuthenticationServiceImpl,
};

let refreshTokenService = {
  provide: RefreshTokenService,
  useExisting: RefreshTokenServiceImpl,
};

@Module({
  imports: [
    forwardRef(() => ServiceImplModule),
  ],
  providers: [
    portalUserIdentifierService,
    verificationEmailSenderService,
    portalUserRegistrationService,
    implicitAuthenticationService,
    refreshTokenService,
    loginAuthenticationService,
  ],
  exports: [
    portalUserIdentifierService,
    verificationEmailSenderService,
    portalUserRegistrationService,
    implicitAuthenticationService,
    refreshTokenService,
    loginAuthenticationService,
  ],
})
export class ServiceModule {
}
