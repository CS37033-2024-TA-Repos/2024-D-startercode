import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1723678372298 implements MigrationInterface {
    name = 'Migration1723678372298'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "highscore" ("id" SERIAL NOT NULL, "score" integer NOT NULL, "test" text NOT NULL, CONSTRAINT "PK_24e43ddcb1eba284f111646e67c" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "highscore"`);
    }

}
