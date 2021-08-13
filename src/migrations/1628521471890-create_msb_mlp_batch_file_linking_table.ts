import {MigrationInterface, QueryRunner} from "typeorm";

export class createMsbMlpBatchFileLinkingTable1628521471890 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`create table msb_mlp.batch_file_linking (
            id int primary key auto_increment,
            batch_id int not null,
            file_id int not null,
            created_at datetime default current_timestamp
        );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`drop table msb_mlp.batch_file_linking;`);
    }

}
