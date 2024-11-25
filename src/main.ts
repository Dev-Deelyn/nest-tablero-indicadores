import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './response/response.interceptor';
import { GlobalExceptionFilter } from './response/response.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()

  // Aplica el interceptor globalmente para respuestas exitosas
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Aplica el filtro globalmente para manejar excepciones
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
