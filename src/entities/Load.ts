import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({ database: "msb_mlp", name: "loads" })
export class Load {

    @PrimaryGeneratedColumn()
    id: Number;

    @Column()
    patient_id: Number;

    @Column()
    batch_file_linking_id: Number;

    @Column({ type: "tinyint" })
    load_complete: Boolean;

    @Column({ type: "datetime" })
    created_at: String;

    @Column({ type: "datetime" })
    updated_at: String;
}
