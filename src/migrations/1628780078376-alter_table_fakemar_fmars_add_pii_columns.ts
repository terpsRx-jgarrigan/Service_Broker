import {MigrationInterface, QueryRunner} from "typeorm";

export class alterTableFakemarFmarsAddPiiColumns1628780078376 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`alter table fakemar.fmars 
        drop column name, 
        add column firstName varchar(255) not null after patient_code,
        add column lastName varchar(255) not null after firstName,
        add column dob varchar(255) not null after lastName,
        add column last_4_ssn varchar(255) not null after dob;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`alter table fakemar.fmars
        drop column firstName,
        drop column lastName,
        drop column dob,
        drop column last_4_ssn,
        add column name varchar(255) not null after patient_code;`);
    }

}
