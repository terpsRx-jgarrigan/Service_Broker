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

  /**
   * We want to detail the database connection to be used. 
   */
  async initialize() {
    api.db_conn_mgr = getConnectionManager();
    api.db_conn_mgr.create({
      type: "mysql",
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [__dirname +"/../entities/*{.ts,.js}"],
      autoLoadEntities: true,
      driver_extra: {"allowPublicKeyRetrieval": true}
    });
  }

  async start() {
    const default_db_conn = api.db_conn_mgr.get("default");
    if (default_db_conn.isConnected === false) {
      await default_db_conn.connect();
    }
  }

  async stop() {}
}
