import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
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
}


   




