import {MigrationInterface, QueryRunner} from "typeorm";

export class createMsbMlpLoadsTable1628521005351 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`create table msb_mlp.loads (
            id int primary key auto_increment,
            patient_id int not null,
            batch_file_linking_id int not null,
            load_complete tinyint default '0',
            created_at datetime default current_timestamp,
            updated_at datetime default null
        );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`drop table msb_mlp.loads;`);
    }

}
