import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import { msbAuth1628308669299 } from "../migrations/1628509253487-create_msb_auth_db";

@Entity({ database: "msb", name: "apps" })
export class App {

    @PrimaryGeneratedColumn()
    id: Number;

    @Column()
    name: String;

    @Column()
    href: String;
}
