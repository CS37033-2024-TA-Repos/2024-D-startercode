import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1717985020459 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`CREATE TABLE HIGHSCORE (id integer default, score integer not null )` );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`DROP TABLE HIGHSCORE)` );
    }

}
