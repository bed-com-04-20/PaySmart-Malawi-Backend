import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as firebaseAdmin from 'firebase-admin';
import * as fs from 'fs';


async function bootstrap() {
  // 1) Initialize the data source so we can run migrations
  
  // 2) Create the NestJS application
  const app = await NestFactory.create(AppModule);

  // 3) Enable CORS if needed
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  // 4) Optionally retrieve config variables
  const configService = app.get(ConfigService);

  // 5) Initialize Firebase if needed
  const firebaseKeyFilePath = './paysmart-malawi-firebase-adminsdk-fbsvc-2fe77fc295.json';
  const firebaseServiceAccount = JSON.parse(fs.readFileSync(firebaseKeyFilePath, 'utf-8'));
  if (firebaseAdmin.apps.length === 0) {
    console.log('Initializing Firebase Application...');
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
    });
  }

  // 6) Swagger setup (API docs)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('PaySmart Malawi Backend API')
    .setDescription('API for managing PaySmart Malawi transactions')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // 7) Start listening on Render's port or 3000
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
