import pg from "pg";
import sequelize, { Sequelize } from "sequelize";
// import { userModel, setupModelAssociations } from "@src/models";
import { userModel } from "@src/models";

import { getLogger, Logger } from "@src/utils/logger";

class DbService {
  private logger: Logger = getLogger("DbService");
  public sequelize!: Sequelize;

  public async isConnected(): Promise<boolean> {
    try {
      await this.sequelize.authenticate();
      return true;
    } catch (error) {
      return false;
    }
  }

  public async connect(): Promise<void> {
    this.logger.info("connect() start");

    const { SVC_POSTGRES_DB, SVC_POSTGRES_HOST, SVC_POSTGRES_PASSWORD, SVC_POSTGRES_PORT, SVC_POSTGRES_USER } = process.env;

    const options: sequelize.Options = {
      database: SVC_POSTGRES_DB,
      dialect: "postgres",
      dialectModule: pg,
      host: SVC_POSTGRES_HOST,
      logging: false,
      password: SVC_POSTGRES_PASSWORD,
      port: parseInt(SVC_POSTGRES_PORT as string),
      username: SVC_POSTGRES_USER,
    };

    await this.createDbIfMissed(options);

    this.sequelize = new Sequelize(options);

    try {
      await this.sequelize.authenticate();
      this.logger.info("connect()", `Successfully connected to the Postgres DB "${options.database}"`);
    } catch ({ message }) {
      this.logger.error("connect()", `Failed connecting to the Postgres DB "${options.database}"`);
      this.logger.error(`Reason: ${message}`);
    }
    this.logger.info("connect() finish");
  }

  public async createDbIfMissed(options: sequelize.Options) {
    const logHeader = "createDbIfMissed()";
    const dbToHave = options.database;

    const rootOptions = {
      ...options,
      database: "postgres",
    };

    const sequelizeInstance = new Sequelize(rootOptions);
    try {
      await sequelizeInstance.authenticate();
      this.logger.info(logHeader, `Successfully connected to Postgres DB "${rootOptions.database}"`);
    } catch ({ message }) {
      this.logger.error(logHeader, `Failed connecting to the Postgres DB "${rootOptions.database}"`);
      this.logger.error(`Reason: ${message}`);
    }

    try {
      this.logger.info(logHeader, `Will create "${dbToHave}"`);
      await sequelizeInstance.query(`CREATE DATABASE ${dbToHave}`);
    } catch ({ message }) {
      // we should ignore it - because if db exists - error will be.
      if (message.indexOf("already exists") >= 0) {
        this.logger.info(logHeader, "DB already exist. Continue...");
      }
    }

    await sequelizeInstance.close();
  }

  public async dropAllTables() {
    this.logger.info("dropAllTables()");

    await this.sequelize.query(`
      DO $$ DECLARE
        r RECORD;
      BEGIN
          FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
              EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
          END LOOP;
      END $$;
    `);
  }

  public async initAllModels(): Promise<void> {
    userModel.initModel({ sequelize: this.sequelize });

    // setupModelAssociations({ sequelize: this.sequelize });

    await this.sequelize.sync({ alter: true });
  }
}

export const dbService = new DbService();
