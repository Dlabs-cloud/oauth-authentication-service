import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Injectable()
export class EmailConf implements MailerOptionsFactory {

  constructor(private readonly configService: ConfigService) {
  }

  createMailerOptions(): Promise<MailerOptions> | MailerOptions {
    return {
      transport: {
        host: this.configService.get<string>('MAILER_HOST', 'smtp.example.com'),
        port: this.configService.get<number>('EMAIL_PORT', 587),
        secure: false,
        auth: {
          user: this.configService.get<string>('EMAIL_USER', 'tss_mailer'),
          pass: this.configService.get<string>('EMAIL_PASS', 'tss_password'),
        },
      },
      defaults: {
        from: this.configService.get<string>('EMAIL_SENDER', '"TSS DEVS" <no-reply@tssdevs.com>'),
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