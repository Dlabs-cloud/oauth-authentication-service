import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as config from 'config'

@Injectable()
export class EmailConf implements MailerOptionsFactory {

  constructor() {
  }

  createMailerOptions(): Promise<MailerOptions> | MailerOptions {
    config.get<string>('email.host')
    return {
      transport: {
        host: config.get<string>('email.host'),
        port: config.get<string>('email.port'),
        secure: false,
        auth: {
          user: config.get<string>('email.user'),
          pass: config.get<string>('email.password'),
        },
      },
      defaults: {
        from: config.get<string>('email.sender'),
      },
      template: {
        dir: process.cwd() + '/views/email/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  }


}