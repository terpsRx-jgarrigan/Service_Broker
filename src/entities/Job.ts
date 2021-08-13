import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({ database: "msb", name: "jobs" })
export class Job {

    @PrimaryGeneratedColumn()
    id: Number;

    @Column()
    user_id: Number;

    @Column()
    app_id: Number;

    @Column({type: "tinyint"})
    is_closed: Boolean;

    @Column({type: "datetime"})
    created_at: String;

    @Column({type: "datetime"})
    updated_at: String;
}
