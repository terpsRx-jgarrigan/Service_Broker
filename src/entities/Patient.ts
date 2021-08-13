import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({ database: "msb_mlp", name: "patients" })
export class Patient {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    patient_id: String;

    @Column()
    medherent_id: String;

    @Column()
    device_id: String;

    @Column({ type: "datetime" })
    created_at: String;

    @Column({ type: "datetime" })
    updated_at: String;
}
