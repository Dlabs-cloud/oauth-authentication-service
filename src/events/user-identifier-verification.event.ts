import { PortalUserIdentificationVerification } from '../domain/entity/portal-user-identification-verification.entity';
import { MailerService } from '@nestjs-modules/mailer';

export class UserIdentifierVerificationEvent {

  constructor(public readonly portalUserIdentificationVerification: PortalUserIdentificationVerification) {


  }
}