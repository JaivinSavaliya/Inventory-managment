import { Router } from "express";
import { OrderService } from "../services/order.service";
import { validateBody } from "../middleware/validate";
import { CreateOrderDto, UpdateOrderDto } from "../dto/order.dto";
import { ApiError } from "../utils/ApiError";

const router = Router();

// ─── Analytics routes MUST be defined BEFORE /:id to avoid route conflict ───

/**
 * GET /api/orders/analytics/revenue
 * Query: ?from=YYYY-MM-DD, ?to=YYYY-MM-DD
 */
router.get("/analytics/revenue", async (req, res, next) => {
  try {
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;
    const result = await OrderService.getRevenue(from, to);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/orders/analytics/top-products
 * Query: ?limit=number, ?from=YYYY-MM-DD, ?to=YYYY-MM-DD
 */
router.get("/analytics/top-products", async (req, res, next) => {
  try {
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;
    const result = await OrderService.getTopProducts(limit, from, to);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// ─── Standard CRUD routes ───────────────────────────────────────────────────

/**
 * GET /api/orders
 * Query: ?id, ?date (YYYY-MM-DD), ?customerId
 */
router.get("/", async (req, res, next) => {
  try {
    const id = req.query.id
      ? parseInt(req.query.id as string, 10)
      : undefined;
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    const customerId = req.query.customerId
      ? parseInt(req.query.customerId as string, 10)
      : undefined;

    const result = await OrderService.getAll({ id, startDate, endDate, customerId });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/orders/:id
 */
router.get("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) throw ApiError.badRequest("Invalid order ID");
    const order = await OrderService.getById(id);
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/orders
 */
router.post("/", validateBody(CreateOrderDto), async (req, res, next) => {
  try {
    const order = await OrderService.create(req.body);
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/orders/:id
 */
router.patch("/:id", validateBody(UpdateOrderDto), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) throw ApiError.badRequest("Invalid order ID");
    const order = await OrderService.update(id, req.body);
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/orders/:id
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) throw ApiError.badRequest("Invalid order ID");
    await OrderService.delete(id);
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
