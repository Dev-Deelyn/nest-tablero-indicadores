import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './response/response.interceptor';
import { ResponseFilter } from './response/response.filter';
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  
  app.use(cookieParser())
  // Aplica el interceptor globalmente para respuestas exitosas
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Aplica el filtro globalmente para manejar excepciones
  app.useGlobalFilters(new ResponseFilter());

  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173',
  ];

  const allowedSubnet = process.env.CORS_ALLOWED_SUBNET;

  app.enableCors({
    origin: (origin, callback) => {
      const isAllowed =
        !origin ||
        allowedOrigins.includes(origin) ||
        (
          allowedSubnet &&
          origin.startsWith(`http://${allowedSubnet}.`)
        );

      callback(
        isAllowed ? null : new Error('Not allowed by CORS'),
        isAllowed,
      );
    },
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
