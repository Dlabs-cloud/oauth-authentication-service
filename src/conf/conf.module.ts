import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataBaseConf } from './data-base.conf';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailConf } from './email.conf';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfModule],
      useExisting: DataBaseConf,
    }),

    MailerModule.forRootAsync({
      imports: [ConfModule],
      useExisting: EmailConf,
    }),
  ],

  providers: [
    DataBaseConf,
    EmailConf,
  ],
  exports: [
    DataBaseConf,
    EmailConf,
  ],
})
export class ConfModule {
  static get environment(): string {
    return process.env.NODE_ENV ?? '';
  }
}
