// src/data-source.ts

import { DataSource } from 'typeorm';
import { TVServiceEntity } from './Entities/TVservice.entity';
import { TvPackageEntity } from './Entities/TVpackages.entity';
import { TVsubscription } from './Entities/TVsubscription.entity';
import { RechargeEntity } from './Entities/recharge.entity';
import { HousePayment } from './house-payments/entities/house-payment.entity';
import { InstallmentPayment } from './house-payments/entities/installmentPayment';
import { User } from './user/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST, 
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, 
  entities: [
    TVServiceEntity,
    TvPackageEntity,
    TVsubscription,
    RechargeEntity,
    HousePayment,
    InstallmentPayment,
    User,
  ],
  migrations: ['dist/migrations/*.js'], 
});
