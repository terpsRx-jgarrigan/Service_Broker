import {MigrationInterface, QueryRunner} from "typeorm";

export class createMsbMlpDb1628520051718 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`create database msb_mlp;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`drop database msb_mlp;`);
    }
}
