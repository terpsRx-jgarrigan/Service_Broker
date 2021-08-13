import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({ database: "fakemar", name: "fmars" })
export class Fmar {

    @PrimaryGeneratedColumn()
    id: Number;

    @Column()
    patient_code: String;

    @Column()
    username: String;

    @Column()
    firstName: String;

    @Column()
    lastName: String;

    @Column()
    dob: String;

    @Column()
    last_4_ssn: String;

    @Column({type: "json"})
    schedule: String;

    @Column({type: "json"})
    info: String;

    @Column({ type: "datetime" })
    created_at: String;
    
    @Column({ type: "datetime" })
    updated_at: String;
}
