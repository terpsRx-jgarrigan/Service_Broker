import { api, Initializer, log } from "actionhero";
import "reflect-metadata";
import { getConnectionManager } from "typeorm";

export class databaseInitializer extends Initializer {
  constructor() {
    super();
    this.name = "databaseInit";
    this.loadPriority = 1000;
    this.startPriority = 1000;
    this.stopPriority = 1000;
  }

  async initialize() {
    api.db_conn_mgr = getConnectionManager();
    api.db_conn_mgr.create({
      type: "mysql",
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    });
  }

  async start() {}

  async stop() {}
}
