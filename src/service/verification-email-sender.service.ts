import { PortalUserIdentificationVerification } from '../domain/entity/portal-user-identification-verification.entity';

export interface VerificationEmailSenderService {
  sendVerificationCode(verification: PortalUserIdentificationVerification): Promise<any>
}

export const VerificationEmailSenderService = Symbol('VerificationEmailSenderService');