import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({ database: "msb_mlp", name: "batch_file_linking" })
export class Batch_File_Link {

    @PrimaryGeneratedColumn()
    id: Number;

    @Column()
    batch_id: Number;

    @Column()
    file_id: Number;

    @Column({ type: "datetime" })
    created_at: String;
}
