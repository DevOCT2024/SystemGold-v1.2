import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
// import { BigIntInterceptor } from './common/interceptors/bigint.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(cookieParser());

  // CORS
  const ORIGIN = process.env.APP_ORIGIN ?? 'http://localhost:3000';
  const origins = ORIGIN.split(',').map(s => s.trim());
  app.enableCors({
    origin: origins,
    credentials: true,
    exposedHeaders: ['Content-Disposition'],
  });

  app.use('/files', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', origins[0]);
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  });

  // app.useGlobalInterceptors(new BigIntInterceptor());

  // Porta/host com fallback
  const PORT = Number(process.env.PORT ?? 5532);
  const HOST = process.env.HOST ?? '0.0.0.0';

  await app.listen(PORT, HOST);
  const url = await app.getUrl();
  console.log(`🚀 Server on ${url}`);
}
bootstrap();
