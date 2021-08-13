import {MigrationInterface, QueryRunner} from "typeorm";

export class msbAuth1628308669299 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`create database msb_auth;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`drop database msb_auth;`);
    }

}
