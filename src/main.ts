import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as firebaseAdmin from 'firebase-admin';
import * as fs from 'fs';

async function bootstrap() {
  // Create the NestJS application
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all origins (you can customize this if you prefer)
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  // Optionally retrieve config variables if needed
  // (e.g., for your DB connection, API keys, etc.)
  const configService = app.get(ConfigService);

  // Initialize Firebase if needed
  const firebaseKeyFilePath = './paysmart-malawi-firebase-adminsdk-fbsvc-2fe77fc295.json';
  const firebaseServiceAccount = JSON.parse(
    fs.readFileSync(firebaseKeyFilePath).toString(),
  );
  if (firebaseAdmin.apps.length === 0) {
    console.log('Initializing Firebase Application...');
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
    });
  }

  // Use process.env.PORT, fallback to 3000 if not set
  const port = process.env.PORT || 3000;

  // Configure Swagger (API documentation)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('PaySmart Malawi Backend API')
    .setDescription('API for managing PaySmart Malawi transactions')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // Start listening
  await app.listen(port);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
