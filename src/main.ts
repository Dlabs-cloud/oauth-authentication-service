import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ValidatorTransformerPipe } from '@tss/common/pipes/validator-transformer.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`api/v${process.env.VERSION}`);
  globalPipes(app);

  const options = new DocumentBuilder()
    .setTitle('Tss Authentication Service')
    .setDescription('Api ofr Tss authentication service')
    .setVersion('1.0')
    .addTag('Authentication Service , tss dev')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  app.getHttpAdapter().get(`/api/v${process.env.VERSION}/docs/json`, (req, res) => {
    return res.json(JSON.parse(JSON.stringify(document)));
  });

  SwaggerModule.setup(`api/v${process.env.VERSION}/docs`, app, document);

  let port = process.env.HOST_PORT || process.env.PORT || 3000;
  app.listen(port).then(() => {
    console.log(`Starting application on port ${port}`);
    console.log(`Url:: ${process.env.DOMAIN}:${port}/api/v${process.env.VERSION}`);
  });
}

export function globalPipes(app: INestApplication) {
  app.useGlobalPipes(new ValidatorTransformerPipe());
}

bootstrap();
