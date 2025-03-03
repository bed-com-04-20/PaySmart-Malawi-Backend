
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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
    @ApiOperation({ summary: 'Process an ESCOM recharge' })
    @ApiBody({ type: rechargeDTO })
    async processEscomRecharge(@Body() dto: rechargeDTO) {
        return this.customRechargesService.processRecharge(dto, 'escom');
    }

    @Get('escom/units')
    @ApiOperation({ summary: 'Get estimated units for ESCOM' })
    @ApiQuery({ name: 'amount', type: Number, required: true, description: 'Amount to recharge' })
    getEscomUnits(@Query('amount') amount: string) {
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount)) {
            throw new Error('Invalid amount. Must be a valid number.');
        }
        const units = this.customRechargesService.calculateUnits('escom', parsedAmount);
        return { serviceType: 'escom', amount: parsedAmount, units };
    }

    @Get('escom/history')
    @ApiOperation({ summary: 'Get ESCOM recharge history' })
    getEscomRechargeHistory() {
        return this.customRechargesService.getRechargeHistory('escom');
    }


    @Post('waterboard/recharge')
    @ApiOperation({ summary: 'Process a Waterboard recharge' })
    @ApiBody({ type: rechargeDTO })
    async processWaterboardRecharge(@Body() dto: rechargeDTO) {
        return this.customRechargesService.processRecharge(dto, 'waterboard');
    }

    @Get('waterboard/units')
    @ApiOperation({ summary: 'Get estimated units for Waterboard' })
    @ApiQuery({ name: 'amount', type: Number, required: true, description: 'Amount to recharge' })
    getWaterboardUnits(@Query('amount') amount: string) {
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount)) {
            throw new Error('Invalid amount. Must be a valid number.');
        }
        const units = this.customRechargesService.calculateUnits('waterboard', parsedAmount);
        return { serviceType: 'waterboard', amount: parsedAmount, units };
    }

    @Get('waterboard/history')
    @ApiOperation({ summary: 'Get Waterboard recharge history' })
    getWaterboardRechargeHistory() {
        return this.customRechargesService.getRechargeHistory('waterboard');
    }
}

export class CustomRechargesController {}

