import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { rechargeEntity } from 'src/Entities/recharge.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomRechargesService {
    constructor(
        @InjectRepository(rechargeEntity)
        private rechargeRepository: Repository<rechargeEntity>,
    ){}
}
