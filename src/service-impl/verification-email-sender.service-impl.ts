import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { PortalUserIdentificationVerification } from '../domain/entity/portal-user-identification-verification.entity';
import { VerificationEmailSenderService } from '../service/verification-email-sender.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VerificationEmailSenderServiceImpl implements VerificationEmailSenderService {

  constructor(private readonly mailerService: MailerService, private readonly configService: ConfigService) {
  }


  sendVerificationCode(verification: PortalUserIdentificationVerification): Promise<any> {
    let sendMailOptions: ISendMailOptions = {
      to: verification.identifier,
      subject: 'EMAIL VERIFICATION',
      template: 'email_verification',
      context: {
        verification_code: verification.verificationCode,
      },
      from: this.configService.get<string>('EMAIL_SENDER', 'auth_Service@tssdevs.com'),
      replyTo: this.configService.get<string>('EMAIL_REPLY', 'noreply@tssdevs.com'),
    };

    return this.mailerService.sendMail(sendMailOptions);
  }

}