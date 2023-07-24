// File main.ts adalah file yang akan diakses untuk pertama kali
// biasanya file main.ts ini akan menjadi tempat kita menulis script untuk me-running server
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
