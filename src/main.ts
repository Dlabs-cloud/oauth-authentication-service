import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { ValidatorTransformerPipe } from '@dlabs/common/pipes/validator-transformer.pipe';
import * as config from 'config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`api/v1`);
  globalPipes(app);

  const port = process.env.HOST_PORT || process.env.PORT || 3000;
  app.listen(port).then(() => {
    console.log(`Starting application on port ${port}`);
    console.log(`Url:: ${config.get('domain')}:${port}/api/v${config.get<string>('version')}`);
  });
}

export function globalPipes(app: INestApplication) {
  app.useGlobalPipes(new ValidatorTransformerPipe());
}

bootstrap();
