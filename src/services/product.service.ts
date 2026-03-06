import { AppDataSource } from "../config/database";
import { Product } from "../entities/Product";
import { CreateProductDto, UpdateProductDto } from "../dto/product.dto";
import { ApiError } from "../utils/ApiError";

const productRepo = () => AppDataSource.getRepository(Product);

export class ProductService {
  /**
   * Get all products or a single product by ID.
   */
  static async getAll(id?: number): Promise<Product | Product[]> {
    if (id) {
      const product = await productRepo().findOne({ where: { id } });
      if (!product) throw ApiError.notFound(`Product with id ${id} not found`);
      return product;
    }
    return productRepo().find({ order: { created_at: "DESC" } });
  }

  /**
   * Get a single product by ID.
   */
  static async getById(id: number): Promise<Product> {
    const product = await productRepo().findOne({ where: { id } });
    if (!product) throw ApiError.notFound(`Product with id ${id} not found`);
    return product;
  }

  /**
   * Create a new product (rejects duplicates by name).
   */
  static async create(data: CreateProductDto): Promise<Product> {
    const existing = await productRepo().findOne({
      where: { product_name: data.product_name },
    });

    if (existing) {
      throw ApiError.conflict(`Product "${data.product_name}" already exists (id: ${existing.id})`);
    }

    const product = productRepo().create(data);
    return productRepo().save(product);
  }

  /**
   * Update an existing product.
   */
  static async update(id: number, data: UpdateProductDto): Promise<Product> {
    const product = await ProductService.getById(id);
    Object.assign(product, data);
    return productRepo().save(product);
  }

  /**
   * Soft-delete a product.
   */
  static async delete(id: number): Promise<void> {
    const product = await ProductService.getById(id);
    await productRepo().softRemove(product);
  }
}
