// eslint-disable-next-line @typescript-eslint/no-var-requires
const typeorm = require("typeorm"); // we are doing it this way so that migrations can be run

 const AppDataSource = new typeorm.DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    username:   process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: true,
    logging: false,
    entities: ["./entity/**/*.{ts,js}"],
    migrations: ["./migrations/**/*.{ts,js}"],
    subscribers: [],
});

module.exports = AppDataSource;
