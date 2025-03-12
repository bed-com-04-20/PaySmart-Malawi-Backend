import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateSubscriptionDTO } from 'src/DTO/createSubcription.dto';
import { TvSubscriptionsService } from 'src/tv_subscriptions/services/tv_subscriptions/tv_subscriptions.service';

@Controller('tv-subscriptions')
export class TvSubscriptionsController {
    constructor(private readonly subscriptionService: TvSubscriptionsService) {}

    @Get('packages/:serviceId')
    listPackages(@Param('serviceId') serviceId: number) {
      return this.subscriptionService.listPackages(serviceId);
    }
  
    @Post('subscribe')
    subscribe(@Body() dto: CreateSubscriptionDTO) {
      return this.subscriptionService.processSubscription(dto);
    }
}
