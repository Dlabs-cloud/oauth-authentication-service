import { PasswordResetRequest } from '../domain/entity/password-reset-request.entity';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { PasswordResetEmailSenderService } from '../service/password-reset-email-sender.service';
import { Inject, Injectable } from '@nestjs/common';
import { PasswordResetGenerator } from '../security/contracts/password-reset-generator.contracts';


@Injectable()
export class PasswordResetEmailSenderServiceImpl implements PasswordResetEmailSenderService {
  constructor(@Inject(PasswordResetGenerator) private readonly passwordResetGenerator: PasswordResetGenerator,
              private readonly configService: ConfigService,
              private mailerService: MailerService) {
  }

  sendResendLink(passwordRequest: PasswordResetRequest, host: string): Promise<any> {
    return this.passwordResetGenerator.generateJwt(passwordRequest).then(passwordReset => {
      let sendMailOptions: ISendMailOptions = {
        to: passwordRequest.portalUserIdentifier.identifier,
        subject: 'EMAIL VERIFICATION',
        template: 'email_verification',
        context: {
          displayName: passwordRequest.portalUser.displayName,
          resetToken: passwordReset,
        },
        from: this.configService.get<string>('EMAIL_SENDER', 'auth_Service@tssdevs.com'),
        replyTo: this.configService.get<string>('EMAIL_REPLY', 'noreply@tssdevs.com'),
      };
      return Promise.resolve(sendMailOptions);
    }).then(sendMailOptions => {
      return this.mailerService.sendMail(sendMailOptions);
    });


  }
}