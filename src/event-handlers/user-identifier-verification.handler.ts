import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserIdentifierVerificationEvent } from '../events/user-identifier-verification.event';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import * as config from 'config'

@EventsHandler(UserIdentifierVerificationEvent)
export class UserIdentifierVerificationHandler implements IEventHandler<UserIdentifierVerificationEvent> {

  constructor(private readonly mailerService: MailerService) {
  }

  handle(event: UserIdentifierVerificationEvent): any {
    const sendMailOptions: ISendMailOptions = {
      to: event.portalUserIdentificationVerification.identifier,
      subject: 'EMAIL VERIFICATION',
      template: 'email_verification',
      context: {
        verification_code: event.portalUserIdentificationVerification.verificationCode,
      },
      from: config.get<string>('email.sender'),
      replyTo: config.get<string>('email.reply'),
    };

    return this.mailerService.sendMail(sendMailOptions).catch(error => {
      console.log(error);
    });
  }

}
