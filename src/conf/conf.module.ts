import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataBaseConf } from './data-base.conf';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfModule],
      useExisting: DataBaseConf,
    }),
  ],
  providers: [
    DataBaseConf,
  ],
  exports: [
    DataBaseConf,
  ],
})
export class ConfModule {
  static get environment(): string {
    return process.env.ENV ?? '';
  }
}
