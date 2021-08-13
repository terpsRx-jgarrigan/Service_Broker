import {MigrationInterface, QueryRunner} from "typeorm";

export class alterMsbMlpBatchesTableAddRemainderCountColumn1628532385168 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`alter table msb_mlp.batches add column remainder_count int default '0' after has_remainders;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`alter table msb_mlp.batches drop column remainder_count;`);
    }

}
