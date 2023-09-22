import { DataSource } from "typeorm";
import { User } from "./entities/user.entity";

console.log("process.env.NODE_ENV", process.env.NODE_ENV);
const IS_PROD = process.env.NODE_ENV === 'production';

export const dataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT as string),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  entities: IS_PROD ? ["build/entities/*.js"] : ["src/entities/*.ts"],
  logging: false,
  synchronize: true,
});

export const Manager = dataSource.manager
export const UserRepository = dataSource.getRepository(User)

const initDb = () => {
  dataSource
    .initialize()
    .then(() => {
      console.log('INFO :: Data Source has been initialized');
    })
    .catch((err) => {
      console.error('ERROR :: Data Source initialization error', err);
    })
}

export default initDb;