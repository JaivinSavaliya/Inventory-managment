# Inventory Management System

REST API for inventory, orders, and customer management built with **Node.js + Express (TypeScript)**, **PostgreSQL**, and **TypeORM**.

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**  
   Edit `.env` with your PostgreSQL credentials:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=inventory_db
   ```

3. **Create the database**  
   Make sure the database `inventory_db` exists in PostgreSQL. Tables will be auto-created by TypeORM on first run.

4. **Start the dev server**
   ```bash
   npm run dev
   ```

5. **Verify**  
   Visit `http://localhost:3000/api/health`

## API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products (?id= for single) |
| GET | `/api/products/:id` | Get one product |
| POST | `/api/products` | Create product |
| PATCH | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Soft-delete product |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers` | List customers (?orderId= filter) |
| GET | `/api/customers/:id` | Get one customer |
| POST | `/api/customers` | Create customer |
| PATCH | `/api/customers/:id` | Update customer |
| DELETE | `/api/customers/:id` | Soft-delete customer |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | List orders (?date=, ?customerId=) |
| GET | `/api/orders/:id` | Get order with items |
| POST | `/api/orders` | Create order with items |
| PATCH | `/api/orders/:id` | Update order/items |
| DELETE | `/api/orders/:id` | Soft-delete order + items |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders/analytics/revenue` | Revenue summary (?from=, ?to=) |
| GET | `/api/orders/analytics/top-products` | Top products (?limit=) |

## Example: Create Order

```json
POST /api/orders
{
  "customer_id": 1,
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 3, "quantity": 1, "manual_price": 50.00 }
  ]
}
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot-reload (nodemon + ts-node) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled JS from `dist/` |
| `npm run typecheck` | Type-check without emitting files |
