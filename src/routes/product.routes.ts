import { Router } from "express";
import { ProductService } from "../services/product.service";
import { validateBody } from "../middleware/validate";
import { CreateProductDto, UpdateProductDto } from "../dto/product.dto";
import { ApiError } from "../utils/ApiError";

const router = Router();

/**
 * GET /api/products
 * Query: ?id=number (optional - get single product)
 */
router.get("/", async (req, res, next) => {
  try {
    const id = req.query.id ? parseInt(req.query.id as string, 10) : undefined;
    const result = await ProductService.getAll(id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/products/:id
 */
router.get("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) throw ApiError.badRequest("Invalid product ID");
    const product = await ProductService.getById(id);
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/products
 */
router.post("/", validateBody(CreateProductDto), async (req, res, next) => {
  try {
    const product = await ProductService.create(req.body);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/products/:id
 */
router.patch("/:id", validateBody(UpdateProductDto), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) throw ApiError.badRequest("Invalid product ID");
    const product = await ProductService.update(id, req.body);
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/products/:id
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) throw ApiError.badRequest("Invalid product ID");
    await ProductService.delete(id);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
