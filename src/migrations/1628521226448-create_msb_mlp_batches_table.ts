import {MigrationInterface, QueryRunner} from "typeorm";

export class createMsbMlpBatchesTable1628521226448 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`create table msb_mlp.batches (
            id int primary key not null,
            batch_number varchar(255) unique not null,
            bag_numbers json not null,
            ever_been_loaded tinyint default '0',
            has_remainders tinyint default '0',
            created_at datetime default current_timestamp,
            updated_at datetime default null
        );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`drop table msb_mlp.batches;`);
    }

}
