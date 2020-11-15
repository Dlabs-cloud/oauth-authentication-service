import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`api/v${process.env.VERSION}`);
  const options = new DocumentBuilder()
    .setTitle('Tss Authentication Service')
    .setDescription('Api ofr Tss authentication service')
    .setVersion('1.0')
    .addTag('Authentication Service , tss dev')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`api/v${process.env.VERSION}/docs`, app, document);

  let port = process.env.HOST_PORT || process.env.PORT || 3000;
  app.listen(port).then(() => {
    console.log(`Starting application on port ${port}`);
    console.log(`Url:: ${process.env.DOMAIN}:${port}/api/v${process.env.VERSION}`);
  });
}

bootstrap();
