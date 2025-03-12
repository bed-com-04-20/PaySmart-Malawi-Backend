import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubscriptionDTO } from 'src/DTO/createSubcription.dto';
import { TvPackageEntity } from 'src/Entities/TVpackages.entity';
import { TVsubscription } from 'src/Entities/TVsubscription.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TvSubscriptionsService {

    constructor(
        @InjectRepository(TVsubscription)
        private readonly tvSubscriptionRepository: Repository<TVsubscription>,

        @InjectRepository(TvPackageEntity)
        private readonly tvPackageRepository: Repository<TvPackageEntity>
    ){}
    async listPackages(serviceId:number){
        return this.tvPackageRepository.find({ where:{id:serviceId}});
    }

    async processSubscription(dto:CreateSubscriptionDTO)
    {
       const {packageId, accountNumber} = dto;

       const packageData = await this.tvPackageRepository.findOne({where:{id:packageId}});

       if (!packageData) {
           throw new HttpException('package not found', HttpStatus.NOT_FOUND)
        
       }

       const transactionRef = `TX-${Date.now()}`;
    }
}
