import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({ database: "msb_mlp", name: "files" })
export class File {

    @PrimaryGeneratedColumn()
    id: Number;

    @Column()
    s3_key: String;

    @Column({ type: "datetime" })
    created_at: String;
}
