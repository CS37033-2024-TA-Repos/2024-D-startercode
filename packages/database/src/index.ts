import {DataSource} from "typeorm";
import AppDataSource from "./data-source";
import * as console from "node:console";

class Database {
    #db:DataSource;
    constructor() {
        this.#db = AppDataSource;
        this.#db.initialize().then(() => {
            console.log("created db connection");
        }).catch((err) => {
            console.log(err);
        });
    }
    useDb() {
        if(this.#db.isInitialized) {
            return this.#db;
        } else {
           this.#db.initialize().then(() => {console.log("re initialized the database")})
           return this.#db;
        }
    }
}



export default Database;
