import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
}
