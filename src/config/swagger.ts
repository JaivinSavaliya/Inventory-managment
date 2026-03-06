import { env } from "./env";

export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Inventory Management System API",
    description:
      "RESTful API for managing products, customers, and orders with analytics support.",
    version: "1.0.0",
  },
  servers: [
    {
      url: `http://localhost:${env.port}`,
      description: "Local dev server",
    },
  ],
  tags: [
    { name: "Health", description: "Server health check" },
    { name: "Products", description: "Product management" },
    { name: "Customers", description: "Customer management" },
    { name: "Orders", description: "Order management" },
    { name: "Analytics", description: "Revenue & sales analytics" },
  ],

  // ─── Paths ──────────────────────────────────────────────────────────────────
  paths: {
    // ─── Health ───────────────────────────────────────────────────────────────
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          "200": {
            description: "Server is running",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    status: { type: "string", example: "ok" },
                    timestamp: {
                      type: "string",
                      format: "date-time",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ─── Products ─────────────────────────────────────────────────────────────
    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "Get all products (or a single product by query ID)",
        parameters: [
          {
            name: "id",
            in: "query",
            required: false,
            schema: { type: "integer" },
            description: "Optional product ID to fetch a single product",
          },
        ],
        responses: {
          "200": {
            description: "Product(s) retrieved",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Products"],
        summary: "Create a new product",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateProduct" },
            },
          },
        },
        responses: {
          "201": {
            description: "Product created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get a product by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Product retrieved",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "404": {
            description: "Product not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Products"],
        summary: "Update a product",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateProduct" },
            },
          },
        },
        responses: {
          "200": {
            description: "Product updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Product not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Products"],
        summary: "Soft-delete a product",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Product deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Product deleted successfully",
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "Product not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    // ─── Customers ────────────────────────────────────────────────────────────
    "/api/customers": {
      get: {
        tags: ["Customers"],
        summary: "Get all customers (optionally by order ID)",
        parameters: [
          {
            name: "orderId",
            in: "query",
            required: false,
            schema: { type: "integer" },
            description: "Find the customer associated with this order",
          },
        ],
        responses: {
          "200": {
            description: "Customer(s) retrieved",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Customers"],
        summary: "Create a new customer",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateCustomer" },
            },
          },
        },
        responses: {
          "201": {
            description: "Customer created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/customers/{id}": {
      get: {
        tags: ["Customers"],
        summary: "Get a customer by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Customer retrieved",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "404": {
            description: "Customer not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Customers"],
        summary: "Update a customer",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateCustomer" },
            },
          },
        },
        responses: {
          "200": {
            description: "Customer updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Customer not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Customers"],
        summary: "Soft-delete a customer",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Customer deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Customer deleted successfully",
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "Customer not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    // ─── Orders ───────────────────────────────────────────────────────────────
    "/api/orders": {
      get: {
        tags: ["Orders"],
        summary: "Get all orders (with optional filters)",
        parameters: [
          {
            name: "id",
            in: "query",
            required: false,
            schema: { type: "integer" },
            description: "Filter by order ID",
          },
          {
            name: "date",
            in: "query",
            required: false,
            schema: { type: "string", format: "date" },
            description: "Filter by date (YYYY-MM-DD)",
          },
          {
            name: "customerId",
            in: "query",
            required: false,
            schema: { type: "integer" },
            description: "Filter by customer ID",
          },
        ],
        responses: {
          "200": {
            description: "Order(s) retrieved",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Orders"],
        summary: "Create a new order",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateOrder" },
            },
          },
        },
        responses: {
          "201": {
            description: "Order created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/orders/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Get an order by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Order retrieved",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "404": {
            description: "Order not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Orders"],
        summary: "Update an order",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateOrder" },
            },
          },
        },
        responses: {
          "200": {
            description: "Order updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Order not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Orders"],
        summary: "Soft-delete an order",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Order deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Order deleted successfully",
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "Order not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    // ─── Analytics ────────────────────────────────────────────────────────────
    "/api/orders/analytics/revenue": {
      get: {
        tags: ["Analytics"],
        summary: "Get revenue analytics",
        parameters: [
          {
            name: "from",
            in: "query",
            required: false,
            schema: { type: "string", format: "date" },
            description: "Start date (YYYY-MM-DD)",
          },
          {
            name: "to",
            in: "query",
            required: false,
            schema: { type: "string", format: "date" },
            description: "End date (YYYY-MM-DD)",
          },
        ],
        responses: {
          "200": {
            description: "Revenue data",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
        },
      },
    },
    "/api/orders/analytics/top-products": {
      get: {
        tags: ["Analytics"],
        summary: "Get top-selling products",
        parameters: [
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer", default: 10 },
            description: "Number of top products to return (default 10)",
          },
          {
            name: "from",
            in: "query",
            required: false,
            schema: { type: "string", format: "date" },
            description: "Start date (YYYY-MM-DD)",
          },
          {
            name: "to",
            in: "query",
            required: false,
            schema: { type: "string", format: "date" },
            description: "End date (YYYY-MM-DD)",
          },
        ],
        responses: {
          "200": {
            description: "Top products list",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
        },
      },
    },
  },

  // ─── Components ─────────────────────────────────────────────────────────────
  components: {
    schemas: {
      // ── Request Bodies ────────────────────────────────────────────────────
      CreateProduct: {
        type: "object",
        required: ["product_name", "price"],
        properties: {
          product_name: {
            type: "string",
            maxLength: 255,
            example: "Wireless Mouse",
          },
          description: {
            type: "string",
            maxLength: 500,
            example: "Ergonomic wireless mouse with USB receiver",
          },
          price: { type: "number", minimum: 0, example: 29.99 },
        },
      },
      UpdateProduct: {
        type: "object",
        properties: {
          product_name: { type: "string", maxLength: 255 },
          description: { type: "string", maxLength: 500 },
          price: { type: "number", minimum: 0 },
        },
      },
      CreateCustomer: {
        type: "object",
        required: ["name", "phone"],
        properties: {
          name: {
            type: "string",
            maxLength: 255,
            example: "John Doe",
          },
          phone: {
            type: "string",
            maxLength: 20,
            example: "+91 9876543210",
          },
        },
      },
      UpdateCustomer: {
        type: "object",
        properties: {
          name: { type: "string", maxLength: 255 },
          phone: { type: "string", maxLength: 20 },
        },
      },
      OrderItemInput: {
        type: "object",
        required: ["product_id", "quantity"],
        properties: {
          product_id: { type: "integer", example: 1 },
          quantity: { type: "integer", minimum: 1, example: 2 },
          manual_price: {
            type: "number",
            minimum: 0,
            description:
              "Override price (uses product price if omitted)",
          },
        },
      },
      CreateOrder: {
        type: "object",
        required: ["items"],
        properties: {
          customer_id: {
            type: "integer",
            nullable: true,
            example: 1,
            description: "Optional customer ID",
          },
          items: {
            type: "array",
            minItems: 1,
            items: { $ref: "#/components/schemas/OrderItemInput" },
          },
        },
      },
      UpdateOrder: {
        type: "object",
        properties: {
          customer_id: { type: "integer", nullable: true },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/OrderItemInput" },
          },
        },
      },

      // ── Response Wrappers ─────────────────────────────────────────────────
      SuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {},
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Resource not found" },
        },
      },

      // ── Entity Schemas (for reference) ────────────────────────────────────
      Product: {
        type: "object",
        properties: {
          id: { type: "integer" },
          product_name: { type: "string" },
          description: { type: "string", nullable: true },
          price: { type: "number" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
          deleted_at: {
            type: "string",
            format: "date-time",
            nullable: true,
          },
        },
      },
      Customer: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          phone: { type: "string" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
          deleted_at: {
            type: "string",
            format: "date-time",
            nullable: true,
          },
        },
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "integer" },
          order_key: { type: "integer" },
          order_date: { type: "string", format: "date-time" },
          order_total: { type: "number" },
          customer_id: { type: "integer", nullable: true },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
          deleted_at: {
            type: "string",
            format: "date-time",
            nullable: true,
          },
        },
      },
      OrderItem: {
        type: "object",
        properties: {
          id: { type: "integer" },
          product_id: { type: "integer" },
          order_id: { type: "integer" },
          manual_price: { type: "number" },
          quantity: { type: "integer" },
          total_price: { type: "number" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
          deleted_at: {
            type: "string",
            format: "date-time",
            nullable: true,
          },
        },
      },
    },
  },
};
