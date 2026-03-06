import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Customer } from "./Customer";
import { OrderItem } from "./OrderItem";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  order_key: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  order_date: Date;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  order_total: number;

  @Column({ type: "int", nullable: true })
  customer_id: number | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date | null;

  // Relations
  @ManyToOne(() => Customer, (customer) => customer.orders, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "customer_id" })
  customer: Customer | null;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
  })
  items: OrderItem[];
}
