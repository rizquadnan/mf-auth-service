import { DataSource } from "typeorm";
import { User } from "./entities/user.entity";

console.log('process.env.DS_HOST', process.env.DS_HOST)
export const dataSource = new DataSource({
  type: 'mariadb',
  host: process.env.DS_HOST,
  port: 3306,
  username: process.env.DS_USER,
  password: process.env.DS_PASS,
  database: process.env.DS_DB,
  entities: ['src/entities/*.ts'],
  logging: false,
  synchronize: true
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