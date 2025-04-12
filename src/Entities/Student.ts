import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UniversityEntity } from "./university";

@Entity()
export class StudentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    registrationNumber: string;

    // Each student is associated with one university.
    @ManyToOne(() => UniversityEntity, university => university.students, { nullable: false })
    university: UniversityEntity;
}
