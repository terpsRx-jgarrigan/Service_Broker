import {MigrationInterface, QueryRunner} from "typeorm";

export class createMsbJobsTable1628607104480 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`create table msb.jobs (
            id int primary key auto_increment,
            user_id int not null,
            app_id int not null,
            is_closed tinyint default 0,
            created_at datetime default current_timestamp,
            updated_at datetime default null
        );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`drop table msb.jobs;`);
    }

}
