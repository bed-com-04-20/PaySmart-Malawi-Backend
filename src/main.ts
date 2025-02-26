import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Load environment variables using ConfigService
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  
  const config = new DocumentBuilder()
  .setTitle('PaySmart Malawi Backend API')
  .setDescription('API for managing PaySmart Malawi transactions')
  .setVersion('1.0')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
