import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { houseDTO } from 'src/DTO/house.DTO';
import { houseEntity } from 'src/Entities/House.Entity';
import { Repository } from 'typeorm';

@Injectable()
export class HouseManagementService {
    constructor( @InjectRepository(houseEntity) private readonly houseRepository:Repository<houseEntity>){}

    async createHouse(dto:houseDTO) : Promise<houseEntity>{

        const house = this.houseRepository.create({
            location: dto.location,
            rentAmount:dto.rentAmount,
            balance:dto.balance
        });

        return this.houseRepository.save(house);

    }  
    
    async getHouses() :Promise<houseEntity[]>{
        return this.houseRepository.find();
    }

    async getHouseById(houseId:number) :Promise<houseEntity>{
        const house = await this.houseRepository.findOne(
            {where: {houseId}}
        );
        if(!house){
            throw new Error('House not found');
        }
     return house;
        
    }

    async updateBalance(houseId: number, amountPaid: number): Promise<houseEntity> {
        const house = await this.getHouseById(houseId);
        house.balance -= amountPaid;
    
        return this.houseRepository.save(house);
      }
}
