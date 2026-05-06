# PetShop (宠物商城)

A full-stack pet supplies e-commerce system.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.2.5, MyBatis-Plus 3.5.7, Spring Security, JWT |
| Database | PostgreSQL |
| Frontend | React 18, TypeScript, Vite 5, Zustand 4.5, React Router 6, Axios |
| Styling | CSS Modules |
| Build | Maven (backend), Vite (frontend) |

## Features

- User registration/login with JWT authentication
- Product browsing by category, search, price filtering, and sorting
- Product detail with image gallery
- Shopping cart (guest cart saved in localStorage, merged to account on login)
- Checkout with address selection
- Order management (pay, cancel, status tracking)
- User profile and address management
- Admin panel: product/category CRUD, order management, user list

## Project Structure

```
7788-shop/
├── 7788-shop-server/      # Spring Boot backend
│   ├── pom.xml
│   └── src/main/java/com/petshop/
│       ├── config/         # Security, MyBatis-Plus, CORS, WebMvc
│       ├── common/         # Result, PageResult, ResultCode, BusinessException
│       ├── security/       # JWT provider, auth filter, UserDetailsService
│       ├── entity/         # 8 JPA entities with soft-delete
│       ├── mapper/         # MyBatis-Plus mappers
│       ├── service/        # Business logic (7 services)
│       ├── controller/     # REST API (8 public + 4 admin controllers)
│       └── dto/            # Request/response DTOs
├── 7788-shop-client/       # React + TypeScript frontend
│   └── src/
│       ├── api/            # Axios instance + 8 API modules
│       ├── stores/         # Zustand stores (auth, cart)
│       ├── router/         # React Router with auth guards
│       ├── components/     # Shared components (Header, Footer, ProductCard, etc.)
│       ├── pages/          # 18 page components
│       │   ├── Home/           ProductList/    ProductDetail/
│       │   ├── Auth/           Cart/           Checkout/
│       │   ├── Orders/         User/           Admin/
│       └── types/          # TypeScript interfaces
└── README.md
```

## Database

### Create Database

```bash
createdb petshop
```

### Run Schema & Seed

```bash
psql -d petshop -f 7788-shop-server/src/main/resources/db/schema.sql
psql -d petshop -f 7788-shop-server/src/main/resources/db/seed.sql
```

### Tables

| Table | Description |
|-------|-------------|
| `users` | User accounts (BCrypt passwords, USER/ADMIN roles) |
| `categories` | Product categories (Dogs, Cats, Fish, Birds, Small Pets) |
| `products` | Products with price, stock, sales count |
| `product_images` | Product image gallery (1:N) |
| `addresses` | User shipping addresses |
| `cart_items` | Shopping cart (unique per user+product) |
| `orders` | Orders with snapshot address, status tracking |
| `order_items` | Order line items (snapshot of product info at purchase) |

### Seed Data

- **Admin user**: `admin` / `admin123`
- **Test user**: `testuser` / `admin123`
- **5 categories**: Dogs, Cats, Fish, Birds, Small Pets
- **14 products** with prices, stock, and images

## How to Run

### Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+
- PostgreSQL

### 1. Configure Database

Edit `7788-shop-server/src/main/resources/application.yml` with your PostgreSQL credentials:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/petshop
    username: petshop
    password: petshop123
```

### 2. Start Backend

```bash
cd 7788-shop-server
mvn spring-boot:run
```

Server starts at `http://localhost:8080`.

### 3. Start Frontend

```bash
cd 7788-shop-client
npm install
npm run dev
```

Dev server starts at `http://localhost:5173`.

## API Endpoints

### Public

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/categories` | All categories |
| GET | `/api/products` | Product list (paginated, filterable) |
| GET | `/api/products/{id}` | Product detail |
| GET | `/api/files/**` | Static images |

### Authenticated (JWT required)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/user/profile` | Get profile |
| PUT | `/api/user/profile` | Update profile |
| GET | `/api/user/addresses` | List addresses |
| POST | `/api/user/addresses` | Create address |
| PUT | `/api/user/addresses/{id}` | Update address |
| DELETE | `/api/user/addresses/{id}` | Delete address |
| PUT | `/api/user/addresses/{id}/default` | Set default address |
| GET | `/api/cart` | List cart items |
| POST | `/api/cart` | Add to cart |
| PUT | `/api/cart/{id}` | Update quantity |
| DELETE | `/api/cart/{id}` | Remove item |
| DELETE | `/api/cart` | Clear cart |
| POST | `/api/cart/merge` | Merge guest cart |
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | My orders |
| GET | `/api/orders/{id}` | Order detail |
| PUT | `/api/orders/{id}/pay` | Pay order |
| PUT | `/api/orders/{id}/cancel` | Cancel order |
| POST | `/api/files/upload` | Upload image |

### Admin (JWT + ADMIN role required)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/admin/products` | Create product |
| PUT | `/api/admin/products/{id}` | Update product |
| DELETE | `/api/admin/products/{id}` | Delete product |
| POST | `/api/admin/categories` | Create category |
| PUT | `/api/admin/categories/{id}` | Update category |
| DELETE | `/api/admin/categories/{id}` | Delete category |
| GET | `/api/admin/orders` | All orders |
| PUT | `/api/admin/orders/{id}/status` | Update order status |
| GET | `/api/admin/users` | User list |

### Response Format

All responses use a unified envelope:

```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

Paginated responses:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "records": [ ... ],
    "total": 100,
    "page": 1,
    "pageSize": 12
  }
}
```

## Order Statuses

| Status | Description |
|--------|-------------|
| `PENDING_PAYMENT` | Awaiting payment |
| `PENDING_SHIPPING` | Paid, ready to ship |
| `SHIPPED` | In transit |
| `DELIVERED` | Completed |
| `CANCELLED` | Cancelled by user |

## SQL Scripts

Schema and seed data are located at:

- `7788-shop-server/src/main/resources/db/schema.sql` — Full DDL with indexes
- `7788-shop-server/src/main/resources/db/seed.sql` — Seed categories, products, admin user
