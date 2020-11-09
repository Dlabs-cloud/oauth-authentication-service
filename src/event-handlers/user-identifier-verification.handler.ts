import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserIdentifierVerificationEvent } from '../events/user-identifier-verification.event';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@EventsHandler(UserIdentifierVerificationEvent)
export class UserIdentifierVerificationHandler implements IEventHandler<UserIdentifierVerificationEvent> {

  constructor(private readonly mailerService: MailerService, private readonly configService: ConfigService) {
  }

  handle(event: UserIdentifierVerificationEvent): any {
    let sendMailOptions: ISendMailOptions = {
      to: event.portalUserIdentificationVerification.identifier,
      subject: 'EMAIL VERIFICATION',
      template: 'email_verification',
      context: {
        verification_code: event.portalUserIdentificationVerification.verificationCode,
      },
      from: this.configService.get<string>('EMAIL_SENDER', 'auth_Service@tssdevs.com'),
      replyTo: this.configService.get<string>('EMAIL_REPLY', 'noreply@tssdevs.com'),
    };

    return this.mailerService.sendMail(sendMailOptions).catch(error => {
      console.log(error);
    });
  }

}