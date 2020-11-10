import {
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class DataBaseConf implements TypeOrmOptionsFactory {
  constructor(private readonly   configService: ConfigService) {
  }

  private isProduction() {
    const mode = this.configService.get('ENV', 'DEV');
    return mode === 'PROD';
  }

  private refreshSchema() {

    const mode = this.configService.get('ENV', 'DEV');
    return mode === 'test';
  }

  createTypeOrmOptions(connectionName?: string): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 5432),
      password: this.configService.get<string>('DB_PASSWORD', 'postgres'),
      username: this.configService.get<string>('DB_USERNAME', 'postgres'),
      database: this.configService.get<string>('DB_DATABASE', 'postgres'),
      dropSchema: true,
      logging: true,
      entities: [
        __dirname + '/../domain/entity/*.entity{.js,.ts}',
      ],
      synchronize: true,
      ssl: this.isProduction(),
    };
  }

}