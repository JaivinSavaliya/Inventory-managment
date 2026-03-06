import { DataSource } from "typeorm";
import { env } from "./env";
import { Product } from "../entities/Product";
import { Customer } from "../entities/Customer";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  synchronize: env.nodeEnv === "development", // auto-sync in dev only
  logging: env.nodeEnv === "development",
  entities: [Product, Customer, Order, OrderItem],
  subscribers: [],
  migrations: [],
});
