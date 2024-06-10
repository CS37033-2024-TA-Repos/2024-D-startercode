import  "reflect-metadata";
import { DataSource } from "typeorm";
import Highscore from "./entity/Highscore";
import * as process from "node:process";



export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST!,
    port: parseInt(process.env.POSTGRES_PORT!),
    username:   process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DB!,
    synchronize: true,
    logging: false,
    entities: [Highscore], // put your entitys here
    migrations: [],
    subscribers: [],
});

