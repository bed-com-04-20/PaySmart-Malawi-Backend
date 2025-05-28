import { Body, Controller, Get, Post, Query, BadRequestException } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CustomRechargesService } from '../../services/custom_recharges/custom_recharges.service';
import { rechargeDTO } from 'src/DTO/Recharge.DTO';

@ApiTags('custom-recharges')
@Controller('custom-recharges')
export class CustomRechargesController {
    constructor(
        private readonly customRechargesService: CustomRechargesService
    ) {}

    @Post('escom/recharge')
    @ApiOperation({ summary: 'Process an ESCOM recharge and return a transaction summary with access token' })
    @ApiBody({ type: rechargeDTO })
    async processEscomRecharge(@Body() dto: rechargeDTO) {
        return this.customRechargesService.processRecharge(dto, 'escom');
    }

    @Get('escom/units')
    @ApiOperation({ summary: 'Get estimated units for ESCOM' })
    @ApiQuery({ name: 'amount', type: Number, required: true, description: 'Amount to recharge' })
    async getEscomUnits(@Query('amount') amount: string) {
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            throw new BadRequestException('Invalid amount. Must be a positive number.');
        }
        const units = this.customRechargesService.calculateUnits('escom', parsedAmount);
        return { serviceType: 'escom', amount: parsedAmount, units };
    }

    @Get('escom/history')
    @ApiOperation({ summary: 'Get full ESCOM recharge history' })
    async getEscomRechargeHistory() {
        return this.customRechargesService.getRechargeHistory('escom');
    }

    @Post('waterboard/recharge')
    @ApiOperation({ summary: 'Process a Waterboard recharge and return a transaction summary with access token' })
    @ApiBody({ type: rechargeDTO })
    async processWaterboardRecharge(@Body() dto: rechargeDTO) {
        return this.customRechargesService.processRecharge(dto, 'waterboard');
    }

    @Get('waterboard/units')
    @ApiOperation({ summary: 'Get estimated units for Waterboard' })
    @ApiQuery({ name: 'amount', type: Number, required: true, description: 'Amount to recharge' })
    async getWaterboardUnits(@Query('amount') amount: string) {
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            throw new BadRequestException('Invalid amount. Must be a positive number.');
        }
        const units = this.customRechargesService.calculateUnits('waterboard', parsedAmount);
        return { serviceType: 'waterboard', amount: parsedAmount, units };
    }

    @Get('waterboard/history')
    @ApiOperation({ summary: 'Get full Waterboard recharge history' })
    async getWaterboardRechargeHistory() {
        return this.customRechargesService.getRechargeHistory('waterboard');
    }

    /**
     * Retrieves recharge transaction summaries.
     * If a "serviceType" query parameter is provided (escom or waterboard), only summaries for that service will be returned.
     * Otherwise, summaries for all completed transactions are returned.
     */
    @Get('summary')
    @ApiOperation({ summary: 'Get recharge transaction summaries. Optional query parameter: serviceType (escom or waterboard)' })
    //@ApiQuery({ name: 'serviceType', type: String, required: false, description: 'Filter summaries by service type (escom|waterboard)' })
    async getTransactionSummaries() {
        return this.customRechargesService.getAllRechargeSummaries();
    }
}
