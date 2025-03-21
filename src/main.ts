import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as firebaseAdmin from 'firebase-admin';
import * as fs from 'fs';
async function bootstrap() {

  //firebase ;
 
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const firebaseKeyFilePath =
  './paysmart-malawi-firebase-adminsdk-fbsvc-2fe77fc295.json';
const firebaseServiceAccount /*: ServiceAccount*/ = JSON.parse(
  fs.readFileSync(firebaseKeyFilePath).toString(),
);
if (firebaseAdmin.apps.length === 0) {
  console.log('Initialize Firebase Application.');
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
  });
}

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
