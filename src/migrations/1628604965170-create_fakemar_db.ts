import {MigrationInterface, QueryRunner} from "typeorm";

export class createFakemarDb1628604965170 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`create database fakemar;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`drop database fakemar;`);
    }

}
