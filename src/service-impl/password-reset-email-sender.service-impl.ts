import { PasswordResetRequest } from '../domain/entity/password-reset-request.entity';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

import { PasswordResetEmailSenderService } from '../service/password-reset-email-sender.service';
import { Inject, Injectable } from '@nestjs/common';
import { PasswordResetGenerator } from '../security/contracts/password-reset-generator.contracts';
import * as config from 'config'

@Injectable()
export class PasswordResetEmailSenderServiceImpl implements PasswordResetEmailSenderService {
  constructor(@Inject(PasswordResetGenerator) private readonly passwordResetGenerator: PasswordResetGenerator,
              private mailerService: MailerService) {
  }

  sendResendLink(passwordRequest: PasswordResetRequest, host: string): Promise<any> {
    return this.passwordResetGenerator.generateJwt(passwordRequest).then(passwordReset => {
      const sendMailOptions: ISendMailOptions = {
        to: passwordRequest.portalUserIdentifier.identifier,
        subject: 'EMAIL VERIFICATION',
        template: 'email_verification',
        context: {
          displayName: passwordRequest.portalUser.displayName,
          resetToken: passwordReset,
        },
        from: config.get<string>("email.sender"),
        replyTo:config.get<string>("email.reply"),
      };
      return Promise.resolve(sendMailOptions);
    }).then(sendMailOptions => {
      return this.mailerService.sendMail(sendMailOptions);
    });


  }
}