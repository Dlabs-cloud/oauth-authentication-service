import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataBaseConf } from './data-base.conf';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useExisting: DataBaseConf,
    }),
  ],
  providers: [
    DataBaseConf,
  ],
})
export class ConfModule {
}
