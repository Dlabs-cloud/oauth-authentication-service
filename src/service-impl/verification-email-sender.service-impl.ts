import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { PortalUserIdentificationVerification } from '../domain/entity/portal-user-identification-verification.entity';
import { VerificationEmailSenderService } from '../service/verification-email-sender.service';
import { Injectable } from '@nestjs/common';
import * as config from 'config'

@Injectable()
export class VerificationEmailSenderServiceImpl implements VerificationEmailSenderService {

  constructor(private readonly mailerService: MailerService) {
  }


  sendVerificationCode(verification: PortalUserIdentificationVerification): Promise<any> {
    const sendMailOptions: ISendMailOptions = {
      to: verification.identifier,
      subject: 'EMAIL VERIFICATION',
      template: 'email_verification',
      context: {
        verification_code: verification.verificationCode,
      },
      from: config<string>('email.sender'),
      replyTo: config.get<string>('email.reply'),
    };

    return this.mailerService.sendMail(sendMailOptions);
  }

}