import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomRechargesModule } from './custom_recharges/custom_recharges.module';

@Module({
  imports: [CustomRechargesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
