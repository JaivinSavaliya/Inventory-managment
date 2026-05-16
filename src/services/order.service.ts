import { AppDataSource } from "../config/database";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Product } from "../entities/Product";
import { CreateOrderDto, UpdateOrderDto, OrderItemDto } from "../dto/order.dto";
import { ApiError } from "../utils/ApiError";
import { Between, MoreThanOrEqual, LessThanOrEqual } from "typeorm";

const orderRepo = () => AppDataSource.getRepository(Order);
const orderItemRepo = () => AppDataSource.getRepository(OrderItem);
const productRepo = () => AppDataSource.getRepository(Product);

export class OrderService {
  /**
   * Generate the next order_key for today.
   * Resets to 1 at the start of each new day.
   */
  private static async getNextOrderKey(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const lastOrder = await orderRepo().findOne({
      where: {
        order_date: Between(today, tomorrow),
      },
      order: { order_key: "DESC" },
    });

    return lastOrder ? lastOrder.order_key + 1 : 1;
  }

  /**
   * Build OrderItem entities from DTOs.
   * Looks up product prices and computes totals.
   */
  private static async buildOrderItems(
    itemDtos: OrderItemDto[]
  ): Promise<{ items: OrderItem[]; orderTotal: number }> {
    let orderTotal = 0;
    const items: OrderItem[] = [];

    for (const itemDto of itemDtos) {
      const product = await productRepo().findOne({
        where: { id: itemDto.product_id },
      });
      if (!product) {
        throw ApiError.badRequest(
          `Product with id ${itemDto.product_id} not found`
        );
      }

      // Use manual_price if provided, otherwise use product's current price
      const unitPrice =
        itemDto.manual_price != null ? itemDto.manual_price : Number(product.price);
      const totalPrice = unitPrice * itemDto.quantity;

      const orderItem = orderItemRepo().create({
        product_id: itemDto.product_id,
        manual_price: unitPrice,
        quantity: itemDto.quantity,
        total_price: totalPrice,
      });

      orderTotal += totalPrice;
      items.push(orderItem);
    }

    return { items, orderTotal };
  }

  /**
   * Create a new order with items inside a transaction.
   */
  static async create(data: CreateOrderDto): Promise<Order> {
    return AppDataSource.transaction(async (manager) => {
      const orderKey = await OrderService.getNextOrderKey();
      const { items, orderTotal } = await OrderService.buildOrderItems(
        data.items
      );

      const order = manager.create(Order, {
        order_key: orderKey,
        order_date: new Date(),
        order_total: orderTotal,
        customer_id: data.customer_id || null,
        status: data.status || "pending",
      });

      const savedOrder = await manager.save(Order, order);

      // Assign the order_id to each item and save
      for (const item of items) {
        item.order_id = savedOrder.id;
      }
      await manager.save(OrderItem, items);

      // Return full order with relations
      return manager.findOneOrFail(Order, {
        where: { id: savedOrder.id },
        relations: ["items", "items.product", "customer"],
      });
    });
  }

  /**
   * Get all orders or a single order with full details.
   */
  static async getAll(params: {
    id?: number;
    startDate?: string;
    endDate?: string;
    customerId?: number;
  }): Promise<Order | Order[]> {
    const { id, startDate, endDate, customerId } = params;

    if (id) {
      const order = await orderRepo().findOne({
        where: { id },
        relations: ["items", "items.product", "customer"],
      });
      if (!order) throw ApiError.notFound(`Order with id ${id} not found`);
      return order;
    }

    const where: any = {};

    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : new Date(0);
      start.setHours(0, 0, 0, 0);
      
      const end = endDate ? new Date(endDate) : new Date();
      end.setHours(23, 59, 59, 999);
      
      where.order_date = Between(start, end);
    }

    if (customerId) {
      where.customer_id = customerId;
    }

    return orderRepo().find({
      where,
      relations: ["items", "items.product", "customer"],
      order: { created_at: "DESC" },
    });
  }

  /**
   * Get a single order by ID.
   */
  static async getById(id: number): Promise<Order> {
    const order = await orderRepo().findOne({
      where: { id },
      relations: ["items", "items.product", "customer"],
    });
    if (!order) throw ApiError.notFound(`Order with id ${id} not found`);
    return order;
  }

  /**
   * Update an order: can update customer_id and/or replace items.
   * When items are provided, it removes old items and creates new ones.
   */
  static async update(id: number, data: UpdateOrderDto): Promise<Order> {
    return AppDataSource.transaction(async (manager) => {
      const order = await manager.findOne(Order, {
        where: { id },
        relations: ["items"],
      });
      if (!order) throw ApiError.notFound(`Order with id ${id} not found`);

      // Update customer if provided
      if (data.customer_id !== undefined) {
        order.customer_id = data.customer_id;
      }

      // Update status if provided
      if (data.status !== undefined) {
        order.status = data.status;
      }

      // Replace items if provided
      if (data.items && data.items.length > 0) {
        // Soft-delete existing items
        if (order.items && order.items.length > 0) {
          await manager.softRemove(OrderItem, order.items);
        }

        // Build new items
        const { items: newItems, orderTotal } =
          await OrderService.buildOrderItems(data.items);

        order.order_total = orderTotal;
        await manager.save(Order, order);

        // Save new items
        for (const item of newItems) {
          item.order_id = order.id;
        }
        await manager.save(OrderItem, newItems);
      } else {
        await manager.save(Order, order);
      }

      // Return updated order with full relations
      return manager.findOneOrFail(Order, {
        where: { id },
        relations: ["items", "items.product", "customer"],
      });
    });
  }

  /**
   * Soft-delete an order and its items.
   */
  static async delete(id: number): Promise<void> {
    return AppDataSource.transaction(async (manager) => {
      const order = await manager.findOne(Order, {
        where: { id },
        relations: ["items"],
      });
      if (!order) throw ApiError.notFound(`Order with id ${id} not found`);

      // Soft-delete items first
      if (order.items && order.items.length > 0) {
        await manager.softRemove(OrderItem, order.items);
      }
      await manager.softRemove(Order, order);
    });
  }

  /**
   * Revenue analytics: total revenue in a date range.
   */
  static async getRevenue(
    from?: string,
    to?: string
  ): Promise<{ total_revenue: number; order_count: number }> {
    const qb = orderRepo()
      .createQueryBuilder("order")
      .select("COALESCE(SUM(order.order_total), 0)", "total_revenue")
      .addSelect("COUNT(order.id)", "order_count");

    if (from) {
      qb.andWhere("order.order_date >= :from", { from: new Date(from) });
    }
    if (to) {
      const toDate = new Date(to);
      toDate.setDate(toDate.getDate() + 1);
      qb.andWhere("order.order_date < :to", { to: toDate });
    }

    const result = await qb.getRawOne();
    return {
      total_revenue: parseFloat(result.total_revenue) || 0,
      order_count: parseInt(result.order_count, 10) || 0,
    };
  }

  /**
   * Top-selling products by quantity and revenue.
   */
  static async getTopProducts(
    limit = 10,
    from?: string,
    to?: string
  ): Promise<
    { product_id: number; product_name: string; total_qty: number; total_revenue: number }[]
  > {
    const qb = orderItemRepo()
      .createQueryBuilder("item")
      .innerJoin("item.product", "product")
      .innerJoin("item.order", "order")
      .select("product.id", "product_id")
      .addSelect("product.name", "product_name")
      .addSelect("SUM(item.quantity)", "total_qty")
      .addSelect("SUM(item.total_price)", "total_revenue")
      .groupBy("product.id")
      .addGroupBy("product.name")
      .orderBy("total_qty", "DESC")
      .limit(limit);

    if (from) {
      qb.andWhere("order.order_date >= :from", { from: new Date(from) });
    }
    if (to) {
      const toDate = new Date(to);
      toDate.setDate(toDate.getDate() + 1);
      qb.andWhere("order.order_date < :to", { to: toDate });
    }

    const results = await qb.getRawMany();

    return results.map((r) => ({
      product_id: r.product_id,
      product_name: r.product_name,
      total_qty: parseInt(r.total_qty, 10),
      total_revenue: parseFloat(r.total_revenue),
    }));
  }
}
