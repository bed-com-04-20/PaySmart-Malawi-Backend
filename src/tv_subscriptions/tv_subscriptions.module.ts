import { Module } from '@nestjs/common';
import { TvSubscriptionsController } from './controllers/tv_subscriptions/tv_subscriptions.controller';
import { TvSubscriptionsService } from './services/tv_subscriptions/tv_subscriptions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TvPackageEntity } from 'src/Entities/TVpackages.entity';
import { TVServiceEntity } from 'src/Entities/TVservice.entity';
import { TVsubscription } from 'src/Entities/TVsubscription.entity';


@Module({

imports: [TypeOrmModule.forFeature([TvPackageEntity,TVServiceEntity,TVsubscription])],
  controllers: [TvSubscriptionsController],
  providers: [TvSubscriptionsService]
})
export class TvSubscriptionsModule {}
