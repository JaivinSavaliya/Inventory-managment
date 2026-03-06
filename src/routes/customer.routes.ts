import { Router } from "express";
import { CustomerService } from "../services/customer.service";
import { validateBody } from "../middleware/validate";
import { CreateCustomerDto, UpdateCustomerDto } from "../dto/customer.dto";
import { ApiError } from "../utils/ApiError";

const router = Router();

/**
 * GET /api/customers
 * Query: ?orderId=number (optional - find customer by order)
 */
router.get("/", async (req, res, next) => {
  try {
    const orderId = req.query.orderId
      ? parseInt(req.query.orderId as string, 10)
      : undefined;
    const result = await CustomerService.getAll(orderId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/customers/:id
 */
router.get("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) throw ApiError.badRequest("Invalid customer ID");
    const customer = await CustomerService.getById(id);
    res.json({ success: true, data: customer });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/customers
 */
router.post("/", validateBody(CreateCustomerDto), async (req, res, next) => {
  try {
    const customer = await CustomerService.create(req.body);
    res.status(201).json({ success: true, data: customer });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/customers/:id
 */
router.patch(
  "/:id",
  validateBody(UpdateCustomerDto),
  async (req, res, next) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id)) throw ApiError.badRequest("Invalid customer ID");
      const customer = await CustomerService.update(id, req.body);
      res.json({ success: true, data: customer });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /api/customers/:id
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) throw ApiError.badRequest("Invalid customer ID");
    await CustomerService.delete(id);
    res.json({ success: true, message: "Customer deleted successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
