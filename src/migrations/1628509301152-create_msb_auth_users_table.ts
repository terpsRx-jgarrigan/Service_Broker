import {MigrationInterface, QueryRunner} from "typeorm";

export class users1628182757227 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`create table msb_auth.users (
            id int primary key auto_increment,
            email varchar(255) unique not null,
            hash binary(60) not null,
            is_active tinyint not null default 1,
            created_at datetime not null default current_timestamp,
            updated_at datetime default null
        );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`drop table msb_auth.users;`);
    }

}

