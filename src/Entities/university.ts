import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StudentEntity } from "./Student";

@Entity()
export class UniversityEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;

    @Column()
    fees:string

    @Column({nullable:true})
    registrationNumber: string;

    @OneToMany(() => StudentEntity, (student) => student.university)
    students: StudentEntity[];

}
