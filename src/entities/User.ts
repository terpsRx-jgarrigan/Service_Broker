import {Binary, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({ database: "msb_auth", name: "users" })
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column({type:"binary"})
    hash: Binary;

    @Column({type:"tinyint"})
    is_active: boolean;

    @Column({type:"datetime"})
    created_at: String;

    @Column({type:"datetime"})
    updated_at: String;
}