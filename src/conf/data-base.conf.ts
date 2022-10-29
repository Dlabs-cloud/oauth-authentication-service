import {
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { Injectable } from '@nestjs/common';
import * as config from 'config'


@Injectable()
export class DataBaseConf implements TypeOrmOptionsFactory {

  createTypeOrmOptions(connectionName?: string): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: config.get<string>('db.host'),
      port: config.get<number>('db.port'),
      password: config.get<string>('db.password'),
      username: config.get<string>('db.username'),
      database: config.get<string>('db.name'),
      logging: config.get<boolean>('db.show_log'),
      entities: [
        __dirname + '/../domain/entity/*.entity{.js,.ts}',
      ],
      synchronize: true,
      ssl: config.get<boolean>('db.ssl') ,
    };
  }

}