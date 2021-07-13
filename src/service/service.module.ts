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
import { PasswordResetEmailSenderService } from './password-reset-email-sender.service';
import { PasswordResetEmailSenderServiceImpl } from '../service-impl/password-reset-email-sender.service-impl';
import { PasswordResetRequestService } from './password-reset-request.service';
import { PasswordResetRequestServiceImpl } from '../service-impl/password-reset-request.service-impl';
import { SecurityModule } from '../security/security.module';
import { ConfModule } from '../conf/conf.module';
import { CommonModule } from '@tss/common';
import { PasswordUpdateService } from './password-update.service';
import { PasswordUpdateServiceImpl } from '../service-impl/password-update.service-impl';

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

let passwordResetEmailSenderService = {
  provide: PasswordResetEmailSenderService,
  useExisting: PasswordResetEmailSenderServiceImpl,
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

let passwordResetRequestService = {
  provide: PasswordResetRequestService,
  useExisting: PasswordResetRequestServiceImpl,
};

let passwordUpdateService = {
  provide: PasswordUpdateService,
  useExisting: PasswordUpdateServiceImpl,
};

@Module({
  imports: [
    SecurityModule,
    forwardRef(() => ServiceImplModule),
    ConfModule,
    CommonModule,
  ],
  providers: [
    portalUserIdentifierService,
    verificationEmailSenderService,
    portalUserRegistrationService,
    implicitAuthenticationService,
    refreshTokenService,
    loginAuthenticationService,
    passwordResetEmailSenderService,
    passwordResetRequestService,
    passwordUpdateService,
  ],
  exports: [
    portalUserIdentifierService,
    verificationEmailSenderService,
    portalUserRegistrationService,
    implicitAuthenticationService,
    refreshTokenService,
    loginAuthenticationService,
    passwordResetEmailSenderService,
    passwordResetRequestService,
    passwordUpdateService,
    SecurityModule,
    ConfModule,
    CommonModule,
  ],
})
export class ServiceModule {
}
