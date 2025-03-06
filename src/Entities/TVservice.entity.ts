import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class TVServiceEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @ApiProperty()
    name: string;
    
}