import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { houseDTO } from 'src/DTO/house.DTO';
import { HouseManagementService } from 'src/house_management/services/house_management/house_management.service';

@ApiTags('house-management')
@Controller('house-management')
export class HouseManagementController {

    constructor(private readonly houseManagementService: HouseManagementService) { }
   
    @Post('create-house')
    @ApiOperation({ summary: 'Create a new house' })

    async createHouse(@Body() dto: houseDTO) {
        return this.houseManagementService.createHouse(dto);
    }
  
    @Get('get-houses')
    @ApiOperation({ summary: 'Get all houses' })

    async getHouses() {
        return this.houseManagementService.getHouses();
    }

    @Get(':houseId')
    @ApiOperation({ summary: 'Get a house by ID' })

    async getHouseById(houseId: number) {
        return this.houseManagementService.getHouseById(houseId);
    }



}
