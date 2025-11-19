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

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
