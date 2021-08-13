import {MigrationInterface, QueryRunner} from "typeorm";

export class createMsbMlpFilesTable1628520785559 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`create table msb_mlp.files (
            id int primary key auto_increment, 
            s3_key varchar(255) unique not null,
            created_at datetime default current_timestamp
        );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`drop table msb_mlp.files;`);
    }

}
