import { UserIdentifierType } from '../domain/constants/user-identifier-type.constant';

export interface PortalUserIdentifierVerificationService {
  createVerification(email, identifierType: UserIdentifierType): Promise<{ userVerification, verificationCode }>
}

export const PortalUserIdentifierVerificationService = Symbol('PortalUserIdentifierVerificationService');