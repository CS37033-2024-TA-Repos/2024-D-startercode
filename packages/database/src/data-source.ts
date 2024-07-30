import "reflect-metadata";
import { DataSource } from "typeorm";

 const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST!,
    port: parseInt(process.env.POSTGRES_PORT!),
    username:   process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DB!,
    synchronize: true,
    logging: false,
    entities: ["./entity/**/*.{ts,js}"],
    migrations: ["./migrations/**/*.{ts,js}"],
    subscribers: [],
});

export default AppDataSource;
