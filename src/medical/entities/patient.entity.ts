import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { InstallmentsHospitalPayment } from "./hospita_fees.entity";

@Entity()

export class PatientEntity {
    @PrimaryGeneratedColumn()
    id:number

    @Column({unique:true})
    medicalId:string

    @Column()
    PatientName:string

    @Column()

    hospital:string

        @Column('numeric')
        totalFees: number;
      
        @Column('numeric', { default: 0 })
        paidAmount: number;
      
        @Column('numeric', { default: 0 })
        remainingBalance: number;
      
        @Column({ default: false })
        isFullyPaid: boolean;
      
        @OneToMany(() => InstallmentsHospitalPayment, (installment) => installment.hospitalFee)
        installments: InstallmentsHospitalPayment[];
      
        @CreateDateColumn()
        createdAt: Date;
      
        @UpdateDateColumn()
        updatedAt: Date;



}