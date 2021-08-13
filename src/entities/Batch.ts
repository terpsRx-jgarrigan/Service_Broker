import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({ database: "msb_mlp", name: "batches" })
export class Batch {

    @PrimaryGeneratedColumn()
    id: Number;

    @Column()
    batch_number: String;

    @Column({ type: "json" })
    bag_numbers: String;

    @Column({ type: "tinyint" })
    ever_been_loaded: Boolean;

    @Column({ type: "tinyint" })
    has_remainders: Boolean;

    @Column()
    remainder_count: Number;

    @Column({ type: "datetime" })
    created_at: String;

    @Column({ type: "datetime" })
    updated_at: String;
}
