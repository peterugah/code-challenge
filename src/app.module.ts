import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidator } from './config/validator/env.validator';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    TransactionModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: envValidator,
    }),
  ],
})
export class AppModule {}
