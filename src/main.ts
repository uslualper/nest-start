import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CorsConfig, NestConfig } from './config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');

  if (corsConfig?.enabled) {
    app.enableCors({ allowedHeaders: '*', origin: '*', credentials: true });
  }

  const config = new DocumentBuilder()
    .setTitle('Nest Start')
    .setDescription('Nest Start API')
    .setVersion('1.0')
    .addTag('nest-start')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(nestConfig?.port || 3000);
}
bootstrap();
