import { Module } from '@nestjs/common';
import { TvSubscriptionsController } from './controllers/tv_subscriptions/tv_subscriptions.controller';
import { TvSubscriptionsService } from './services/tv_subscriptions/tv_subscriptions.service';


@Module({
  controllers: [TvSubscriptionsController],
  providers: [TvSubscriptionsService]
})
export class TvSubscriptionsModule {}
