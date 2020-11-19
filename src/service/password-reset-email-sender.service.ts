import { PasswordResetRequest } from '../domain/entity/password-reset-request.entity';

export interface PasswordResetEmailSenderService {
  sendResendLink(passwordRequest: PasswordResetRequest, host: string): Promise<any>
}

export const PasswordResetEmailSenderService = Symbol('PasswordResetEmailSenderService');