import {MigrationInterface, QueryRunner} from "typeorm";

export class createMsbAppsTable1628604521891 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`create table msb.apps (
            id int primary key auto_increment,
            name varchar(255) not null,
            href varchar(255) not null
        );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`drop table msb.apps;`);
    }

}
