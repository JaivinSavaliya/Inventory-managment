import { AppDataSource } from "../config/database";
import { Customer } from "../entities/Customer";
import { CreateCustomerDto, UpdateCustomerDto } from "../dto/customer.dto";
import { ApiError } from "../utils/ApiError";

const customerRepo = () => AppDataSource.getRepository(Customer);

export class CustomerService {
  /**
   * Get all customers, optionally filtered by order ID.
   */
  static async getAll(orderId?: number): Promise<Customer[]> {
    if (orderId) {
      // Find the customer associated with a specific order
      const customers = await customerRepo()
        .createQueryBuilder("customer")
        .innerJoin("customer.orders", "order", "order.id = :orderId", {
          orderId,
        })
        .getMany();
      return customers;
    }
    return customerRepo().find({ order: { created_at: "DESC" } });
  }

  /**
   * Get a single customer by ID with their orders.
   */
  static async getById(id: number): Promise<Customer> {
    const customer = await customerRepo().findOne({
      where: { id },
      relations: ["orders"],
    });
    if (!customer)
      throw ApiError.notFound(`Customer with id ${id} not found`);
    return customer;
  }

  /**
   * Create a new customer.
   */
  static async create(data: CreateCustomerDto): Promise<Customer> {
    const existing = await customerRepo().findOne({
      where: { phone: data.phone },
    });

    if (existing) {
      throw ApiError.conflict(
        `Customer with phone "${data.phone}" already exists (id: ${existing.id})`
      );
    }

    const customer = customerRepo().create(data);
    return customerRepo().save(customer);
  }

  /**
   * Update an existing customer.
   */
  static async update(
    id: number,
    data: UpdateCustomerDto
  ): Promise<Customer> {
    const customer = await CustomerService.getById(id);
    Object.assign(customer, data);
    return customerRepo().save(customer);
  }

  /**
   * Soft-delete a customer.
   */
  static async delete(id: number): Promise<void> {
    const customer = await CustomerService.getById(id);
    await customerRepo().softRemove(customer);
  }
}
