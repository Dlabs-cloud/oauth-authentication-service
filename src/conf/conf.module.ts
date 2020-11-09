import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataBaseConf } from './data-base.conf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailConf } from './email.conf';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfModule],
      useExisting: DataBaseConf,
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
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
    return process.env.ENV ?? '';
  }
}
