import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CustomRechargesService } from '../../services/custom_recharges/custom_recharges.service';
import { rechargeDTO } from 'src/DTO/Recharge.DTO';


@ApiTags('custom-recharges')
@Controller('custom-recharges')
export class CustomRechargesController {
    constructor(
        private readonly CustomRechargesService: CustomRechargesService
    ){}

    @Post()
    @ApiOperation({summary: 'Process a custom recharge'})
    @ApiBody({type: rechargeDTO})
    async processRecharge(@Body() dto: rechargeDTO) {
        return this.CustomRechargesService.processRecharge(dto);
       
    }
    @Get('units')
    @ApiOperation({ summary: 'Get estimated units before recharge' })
    @ApiQuery({ name: 'serviceType', enum: ['escom', 'waterboard'], required: true, description: 'Service Type' })
    @ApiQuery({ name: 'amount', type: Number, required: true, description: 'Amount to recharge' }) 

    getUnits(
        @Query('serviceType') serviceType: 'escom' | 'waterboard',
        @Query('amount') amount: number
    ){
        const units = this.CustomRechargesService.calculateUnits(serviceType, Number(amount));
        return {serviceType,amount,units}

    }
    @Get('history')
    @ApiOperation({ summary: 'Get recharge history' })
    @ApiQuery({ name:'meterNo', type: Number, required: true, description: 'Meter Number' })
    getRechargeHistory(
        @Query('meterNo') meterNo: number){
            return this.CustomRechargesService.getRechargeHistory(Number(meterNo));
        }
}


   




