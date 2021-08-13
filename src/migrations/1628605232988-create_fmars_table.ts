import {MigrationInterface, QueryRunner} from "typeorm";

export class createFmarsTable1628605232988 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`create table fakemar.fmars (
            id int primary key auto_increment,
            patient_code varchar(255) default null, 
            name varchar(255) not null,
            schedule json not null, 
            info json not null,
            created_at datetime default current_timestamp,
            updated_at datetime default null
        );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`drop table fakemar.fmars;`);
    }

}
