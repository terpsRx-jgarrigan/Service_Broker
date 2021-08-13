import {MigrationInterface, QueryRunner} from "typeorm";

export class createMsbMlpPatientsTable1628520396630 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`create table msb_mlp.patients (
            id int primary key auto_increment,
            patient_id varchar(255) unique not null,
            medherent_id varchar(255) not null,
            device_id varchar(255) default null,
            created_at datetime default current_timestamp,
            updated_at datetime default null 
        );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`drop table msb_mlp.patients;`);
    }

}
