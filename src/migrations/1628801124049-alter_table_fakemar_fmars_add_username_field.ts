import {MigrationInterface, QueryRunner} from "typeorm";

export class alterTableFakemarFmarsAddUsernameField1628801124049 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`alter table fakemar.fmars add column username varchar(255) not null after patient_code;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`alter table fakemar.fmars drop column username;`);
    }

}
