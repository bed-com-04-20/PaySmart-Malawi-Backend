import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateSubscriptionDTO } from 'src/DTO/createSubcription.dto';
import { TvSubscriptionsService } from 'src/tv_subscriptions/services/tv_subscriptions/tv_subscriptions.service';

@Controller('tv-subscriptions')
export class TvSubscriptionsController {
    constructor(private readonly subscriptionService: TvSubscriptionsService) {}

    @Get()
    listPackages() {
        return this.subscriptionService.listPackages();
    }
  
    @Post('subscribe')
    subscribe(@Body() dto: CreateSubscriptionDTO) {
        return this.subscriptionService.processSubscription(dto);
    }

    /**
     * Retrieves transaction summaries for all subscriptions.
     * Example request: GET /tv-subscriptions/summary
     *
     * @returns An array of summary objects with transaction details.
     */
    @Get('summary')
    getAllTransactionSummaries() {
        return this.subscriptionService.getAllTransactionSummaries();
    }
}
