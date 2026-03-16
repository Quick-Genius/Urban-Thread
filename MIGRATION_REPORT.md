# Urban Thread — MongoDB → Neon DB (PostgreSQL) + Prisma ORM Migration Report

**Generated**: 2026-03-15
**Current Stack**: Node.js + Express + MongoDB (Mongoose)
**Target Stack**: Node.js + Express + Neon DB (PostgreSQL) + Prisma ORM

---

## Table of Contents
1. [Current MongoDB Schema Overview](#1-current-mongodb-schema-overview)
2. [Entity Relationship Diagram](#2-entity-relationship-diagram)
3. [Table-by-Table Migration Mapping](#3-table-by-table-migration-mapping)
4. [Proposed Prisma Schema](#4-proposed-prisma-schema)
5. [API Endpoint Impact Analysis](#5-api-endpoint-impact-analysis)
6. [Key Migration Challenges & Solutions](#6-key-migration-challenges--solutions)
7. [Migration Steps](#7-migration-steps)
8. [Environment Changes](#8-environment-changes)

---

## 1. Current MongoDB Schema Overview

### Models Summary

| Model | Collection | Fields | Relationships | Unique Constraints |
|-------|-----------|--------|--------------|-------------------|
| User | users | 10 fields | → Product (seller), → Cart, → Wishlist, → Address, → Order, → Review | email, googleId (sparse) |
| Product | products | 16 fields | → User (seller) | sku, text-index on name+description |
| Order | orders | 13 fields (+ nested objects) | → User, → Product (via items[]) | — |
| Cart | carts | 3 fields (+ nested items[]) | → User (1:1), → Product | user (one per user) |
| Review | reviews | 5 fields | → User, → Product | (product, user) composite |
| Wishlist | wishlists | 2 fields (+ products[]) | → User (1:1), → Product[] | user (one per user) |
| Address | addresses | 11 fields | → User | — |

---

## 2. Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         URBAN THREAD ERD                            │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────────┐
│     USER     │         │    PRODUCT       │
│──────────────│         │──────────────────│
│ id (PK)      │◄────────│ sellerId (FK)    │
│ name         │  1:many │ id (PK)          │
│ email        │         │ name             │
│ password     │         │ description      │
│ phone        │         │ price            │
│ role         │         │ originalPrice    │
│ avatar       │         │ category         │
│ isActive     │         │ sku (UNIQUE)     │
│ googleId     │         │ stock            │
│ authProvider │         │ sold             │
│ isEmailVerif.│         │ rating           │
│ createdAt    │         │ numReviews       │
│ updatedAt    │         │ features (JSON)  │
└──────┬───────┘         │ isActive         │
       │                 │ createdAt        │
       │                 │ updatedAt        │
       │                 └────────┬─────────┘
       │                          │
       │ 1:1    ┌─────────────────┼──────────────────┐
       │        │                 │                  │
       ▼        ▼                 ▼                  ▼
┌──────────┐ ┌──────────┐  ┌──────────────┐  ┌──────────────┐
│  CART    │ │ WISHLIST │  │    ORDER     │  │   REVIEW     │
│──────────│ │──────────│  │──────────────│  │──────────────│
│ id (PK)  │ │ id (PK)  │  │ id (PK)      │  │ id (PK)      │
│ userId   │ │ userId   │  │ userId (FK)  │  │ productId FK │
│(FK,UNIQ) │ │(FK,UNIQ) │  │ paymentMthd  │  │ userId (FK)  │
│createdAt │ │createdAt │  │ paymentStatus│  │ rating       │
│updatedAt │ │updatedAt │  │ subtotal     │  │ comment      │
└────┬─────┘ └────┬─────┘  │ shippingCost │  │ createdAt    │
     │            │         │ discount     │  │ updatedAt    │
     ▼            ▼         │ total        │  │ UNIQUE:      │
┌──────────┐ ┌──────────┐  │ status       │  │(productId,   │
│CART_ITEM │ │WISHLIST_ │  │ deliveredAt  │  │ userId)      │
│──────────│ │PRODUCT   │  │ createdAt    │  └──────────────┘
│ id (PK)  │ │──────────│  │ updatedAt    │
│ cartId FK│ │wishlistId│  └──────┬───────┘
│productId │ │productId │         │
│ quantity │ └──────────┘         ▼
│ size     │               ┌──────────────┐    ┌──────────────┐
└──────────┘               │  ORDER_ITEM  │    │  SHIPPING_   │
                           │──────────────│    │  ADDRESS     │
                           │ id (PK)      │    │──────────────│
                           │ orderId (FK) │    │ id (PK)      │
                           │ productId FK │    │ orderId (FK) │
                           │ name         │    │ fullName     │
                           │ image        │    │ phone        │
                           │ price        │    │ addressLine1 │
                           │ size         │    │ addressLine2 │
                           │ quantity     │    │ city         │
                           └──────────────┘    │ state        │
                                               │ pinCode      │
                                               └──────────────┘
┌──────────────┐    ┌──────────────────┐
│   ADDRESS    │    │  PAYMENT_DETAIL  │
│──────────────│    │──────────────────│
│ id (PK)      │    │ id (PK)          │
│ userId (FK)  │    │ orderId (FK,UNIQ)│
│ name         │    │ transactionId    │
│ fullName     │    │ paidAt           │
│ phone        │    │ razorpayOrderId  │
│ addressLine1 │    │ razorpayPaymntId │
│ addressLine2 │    │ razorpaySignatur  │
│ city         │    └──────────────────┘
│ state        │
│ pinCode      │
│ isDefault    │
│ createdAt    │
│ updatedAt    │
└──────────────┘

┌────────────────────────────────────────┐
│  PRODUCT_IMAGE (junction table)        │
│────────────────────────────────────────│
│ id (PK)                                │
│ productId (FK)                         │
│ url                                    │
│ position                               │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│  PRODUCT_SIZE (junction table)         │
│────────────────────────────────────────│
│ id (PK)                                │
│ productId (FK)                         │
│ size (enum)                            │
└────────────────────────────────────────┘
```

---

## 3. Table-by-Table Migration Mapping

### 3.1 User Model

| MongoDB Field | Type | Mongoose Constraint | PostgreSQL Column | Prisma Type | Constraint |
|--------------|------|---------------------|-------------------|-------------|------------|
| _id | ObjectId | auto | id | String | @id @default(cuid()) |
| name | String | required, trim | name | String | |
| email | String | required, unique, lowercase | email | String | @unique |
| password | String | minlength:6, select:false | password | String? | nullable (Google users have no password) |
| phone | String | trim | phone | String? | |
| role | String | enum: customer/seller/admin | role | Role (enum) | @default(customer) |
| avatar | String | default: '' | avatar | String | @default("") |
| isActive | Boolean | default: true | isActive | Boolean | @default(true) |
| googleId | String | unique, sparse | googleId | String? | @unique |
| authProvider | String | enum: local/google | authProvider | AuthProvider (enum) | @default(local) |
| isEmailVerified | Boolean | default: false | isEmailVerified | Boolean | @default(false) |
| createdAt | Date | auto | createdAt | DateTime | @default(now()) |
| updatedAt | Date | auto | updatedAt | DateTime | @updatedAt |

**New Enums needed**:
```
Role: CUSTOMER, SELLER, ADMIN
AuthProvider: LOCAL, GOOGLE
```

---

### 3.2 Product Model

| MongoDB Field | Type | Mongoose Constraint | PostgreSQL Column | Prisma Type | Constraint |
|--------------|------|---------------------|-------------------|-------------|------------|
| _id | ObjectId | auto | id | String | @id @default(cuid()) |
| name | String | required, trim | name | String | |
| description | String | default: '' | description | String | @default("") |
| price | Number | required, min:0 | price | Decimal | |
| originalPrice | Number | min:0 | originalPrice | Decimal? | |
| category | String | enum: men/women/kids/accessories | category | Category (enum) | |
| sizes | [String] | enum: XS/S/.../4-6Y etc | sizes | → ProductSize table | |
| images | [String] | required | images | → ProductImage table | |
| sku | String | required, unique | sku | String | @unique |
| stock | Number | required, min:0 | stock | Int | @default(0) |
| sold | Number | default:0 | sold | Int | @default(0) |
| rating | Number | default:0, min:0, max:5 | rating | Decimal | @default(0) |
| numReviews | Number | default:0 | numReviews | Int | @default(0) |
| features | [String] | — | features | String[] | (Postgres array or JSON) |
| seller | ObjectId | ref: User, required | sellerId | String | FK → User.id |
| isActive | Boolean | default: true | isActive | Boolean | @default(true) |
| createdAt | Date | auto | createdAt | DateTime | @default(now()) |
| updatedAt | Date | auto | updatedAt | DateTime | @updatedAt |

**Split into new tables**:
- `ProductImage`: id, productId, url, position
- `ProductSize`: id, productId, size (SizeEnum)

**New Enums needed**:
```
Category: MEN, WOMEN, KIDS, ACCESSORIES
SizeEnum: XS, S, M, L, XL, XXL, SIZE_4_6Y, SIZE_6_8Y, SIZE_8_10Y
```

---

### 3.3 Order Model

| MongoDB Field | Type | Mongoose Constraint | PostgreSQL Column | Prisma Type | Note |
|--------------|------|---------------------|-------------------|-------------|------|
| _id | ObjectId | auto | id | String | @id @default(cuid()) |
| user | ObjectId | ref: User | userId | String | FK → User.id |
| items | [embedded] | — | → OrderItem table | — | Normalized |
| shippingAddress | embedded | — | → ShippingAddress table | — | Normalized |
| paymentMethod | String | enum: card/upi/cod/razorpay | paymentMethod | PaymentMethod (enum) | |
| paymentStatus | String | enum: pending/paid/failed | paymentStatus | PaymentStatus (enum) | @default(PENDING) |
| paymentDetails | embedded | — | → PaymentDetail table | — | Normalized |
| subtotal | Number | required, min:0 | subtotal | Decimal | |
| shippingCost | Number | required | shippingCost | Decimal | @default(0) |
| discount | Number | default:0 | discount | Decimal | @default(0) |
| total | Number | required, min:0 | total | Decimal | |
| status | String | enum: Processing/... | status | OrderStatus (enum) | @default(PROCESSING) |
| deliveredAt | Date | — | deliveredAt | DateTime? | |
| createdAt | Date | auto | createdAt | DateTime | @default(now()) |
| updatedAt | Date | auto | updatedAt | DateTime | @updatedAt |

**Embedded docs → New Tables**:

#### OrderItem table
| Column | Type | Note |
|--------|------|------|
| id | String | @id @default(cuid()) |
| orderId | String | FK → Order.id |
| productId | String | FK → Product.id |
| name | String | snapshot at order time |
| image | String | snapshot at order time |
| price | Decimal | snapshot at order time |
| size | String | |
| quantity | Int | |

#### ShippingAddress table
| Column | Type | Note |
|--------|------|------|
| id | String | @id @default(cuid()) |
| orderId | String | FK → Order.id, @unique |
| fullName | String | |
| phone | String | |
| addressLine1 | String | |
| addressLine2 | String? | |
| city | String | |
| state | String | |
| pinCode | String | |

#### PaymentDetail table
| Column | Type | Note |
|--------|------|------|
| id | String | @id @default(cuid()) |
| orderId | String | FK → Order.id, @unique |
| transactionId | String? | |
| paidAt | DateTime? | |
| razorpayOrderId | String? | |
| razorpayPaymentId | String? | |
| razorpaySignature | String? | |

**New Enums needed**:
```
PaymentMethod: CARD, UPI, COD, RAZORPAY
PaymentStatus: PENDING, PAID, FAILED
OrderStatus: PROCESSING, CONFIRMED, SHIPPED, IN_TRANSIT, DELIVERED, CANCELLED
```

---

### 3.4 Cart Model

| MongoDB Field | Type | Mongoose Constraint | PostgreSQL Column | Prisma Type | Note |
|--------------|------|---------------------|-------------------|-------------|------|
| _id | ObjectId | auto | id | String | @id @default(cuid()) |
| user | ObjectId | ref: User, unique | userId | String | FK → User.id, @unique |
| items | [embedded] | — | → CartItem table | — | Normalized |
| createdAt | Date | auto | createdAt | DateTime | @default(now()) |
| updatedAt | Date | auto | updatedAt | DateTime | @updatedAt |

#### CartItem table
| Column | Type | Note |
|--------|------|------|
| id | String | @id @default(cuid()) |
| cartId | String | FK → Cart.id |
| productId | String | FK → Product.id |
| quantity | Int | min: 1 |
| size | String | |

---

### 3.5 Review Model

| MongoDB Field | Type | Mongoose Constraint | PostgreSQL Column | Prisma Type | Constraint |
|--------------|------|---------------------|-------------------|-------------|------------|
| _id | ObjectId | auto | id | String | @id @default(cuid()) |
| product | ObjectId | ref: Product | productId | String | FK → Product.id |
| user | ObjectId | ref: User | userId | String | FK → User.id |
| rating | Number | required, min:1, max:5 | rating | Int | |
| comment | String | required, trim | comment | String | |
| createdAt | Date | auto | createdAt | DateTime | @default(now()) |
| updatedAt | Date | auto | updatedAt | DateTime | @updatedAt |

**Composite unique**: `@@unique([productId, userId])`

---

### 3.6 Wishlist Model

| MongoDB Field | Type | Mongoose Constraint | PostgreSQL Column | Prisma Type | Note |
|--------------|------|---------------------|-------------------|-------------|------|
| _id | ObjectId | auto | id | String | @id @default(cuid()) |
| user | ObjectId | ref: User, unique | userId | String | FK → User.id, @unique |
| products | [ObjectId] | ref: Product | → WishlistProduct table | — | Junction |
| createdAt | Date | auto | createdAt | DateTime | @default(now()) |
| updatedAt | Date | auto | updatedAt | DateTime | @updatedAt |

#### WishlistProduct table (junction)
| Column | Type | Note |
|--------|------|------|
| wishlistId | String | FK → Wishlist.id |
| productId | String | FK → Product.id |
| @@id([wishlistId, productId]) | | composite PK |

---

### 3.7 Address Model

| MongoDB Field | Type | Mongoose Constraint | PostgreSQL Column | Prisma Type | Constraint |
|--------------|------|---------------------|-------------------|-------------|------------|
| _id | ObjectId | auto | id | String | @id @default(cuid()) |
| user | ObjectId | ref: User | userId | String | FK → User.id |
| name | String | required, trim | name | String | |
| fullName | String | required, trim | fullName | String | |
| phone | String | required, trim | phone | String | |
| addressLine1 | String | required, trim | addressLine1 | String | |
| addressLine2 | String | trim | addressLine2 | String? | |
| city | String | required, trim | city | String | |
| state | String | required, trim | state | String | |
| pinCode | String | required, trim | pinCode | String | |
| isDefault | Boolean | default: false | isDefault | Boolean | @default(false) |
| createdAt | Date | auto | createdAt | DateTime | @default(now()) |
| updatedAt | Date | auto | updatedAt | DateTime | @updatedAt |

---

## 4. Proposed Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────── ENUMS ───────────────

enum Role {
  CUSTOMER
  SELLER
  ADMIN
}

enum AuthProvider {
  LOCAL
  GOOGLE
}

enum Category {
  MEN
  WOMEN
  KIDS
  ACCESSORIES
}

enum SizeEnum {
  XS
  S
  M
  L
  XL
  XXL
  SIZE_4_6Y
  SIZE_6_8Y
  SIZE_8_10Y
}

enum PaymentMethod {
  CARD
  UPI
  COD
  RAZORPAY
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
}

enum OrderStatus {
  PROCESSING
  CONFIRMED
  SHIPPED
  IN_TRANSIT
  DELIVERED
  CANCELLED
}

// ─────────────── MODELS ───────────────

model User {
  id              String       @id @default(cuid())
  name            String
  email           String       @unique
  password        String?
  phone           String?
  role            Role         @default(CUSTOMER)
  avatar          String       @default("")
  isActive        Boolean      @default(true)
  googleId        String?      @unique
  authProvider    AuthProvider @default(LOCAL)
  isEmailVerified Boolean      @default(false)
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  // Relations
  products  Product[]
  cart      Cart?
  wishlist  Wishlist?
  addresses Address[]
  orders    Order[]
  reviews   Review[]
}

model Product {
  id            String    @id @default(cuid())
  name          String
  description   String    @default("")
  price         Decimal   @db.Decimal(10, 2)
  originalPrice Decimal?  @db.Decimal(10, 2)
  category      Category
  sku           String    @unique
  stock         Int       @default(0)
  sold          Int       @default(0)
  rating        Decimal   @default(0) @db.Decimal(3, 2)
  numReviews    Int       @default(0)
  features      String[]
  isActive      Boolean   @default(true)
  sellerId      String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  seller        User           @relation(fields: [sellerId], references: [id])
  images        ProductImage[]
  sizes         ProductSize[]
  cartItems     CartItem[]
  orderItems    OrderItem[]
  reviews       Review[]
  wishlistItems WishlistProduct[]
}

model ProductImage {
  id        String  @id @default(cuid())
  productId String
  url       String
  position  Int     @default(0)

  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}

model ProductSize {
  id        String   @id @default(cuid())
  productId String
  size      SizeEnum

  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
}

model Order {
  id             String        @id @default(cuid())
  userId         String
  paymentMethod  PaymentMethod
  paymentStatus  PaymentStatus @default(PENDING)
  subtotal       Decimal       @db.Decimal(10, 2)
  shippingCost   Decimal       @default(0) @db.Decimal(10, 2)
  discount       Decimal       @default(0) @db.Decimal(10, 2)
  total          Decimal       @db.Decimal(10, 2)
  status         OrderStatus   @default(PROCESSING)
  deliveredAt    DateTime?
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  // Relations
  user            User             @relation(fields: [userId], references: [id])
  items           OrderItem[]
  shippingAddress ShippingAddress?
  paymentDetail   PaymentDetail?
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  productId String
  name      String
  image     String  @default("")
  price     Decimal @db.Decimal(10, 2)
  size      String
  quantity  Int

  order   Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id])
}

model ShippingAddress {
  id           String  @id @default(cuid())
  orderId      String  @unique
  fullName     String
  phone        String
  addressLine1 String
  addressLine2 String?
  city         String
  state        String
  pinCode      String

  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
}

model PaymentDetail {
  id                 String    @id @default(cuid())
  orderId            String    @unique
  transactionId      String?
  paidAt             DateTime?
  razorpayOrderId    String?
  razorpayPaymentId  String?
  razorpaySignature  String?

  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
}

model Cart {
  id        String     @id @default(cuid())
  userId    String     @unique
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  user  User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  items CartItem[]
}

model CartItem {
  id        String  @id @default(cuid())
  cartId    String
  productId String
  quantity  Int     @default(1)
  size      String

  cart    Cart    @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id])
}

model Review {
  id        String   @id @default(cuid())
  productId String
  userId    String
  rating    Int
  comment   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id])

  @@unique([productId, userId])
}

model Wishlist {
  id        String   @id @default(cuid())
  userId    String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user     User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  products WishlistProduct[]
}

model WishlistProduct {
  wishlistId String
  productId  String

  wishlist Wishlist @relation(fields: [wishlistId], references: [id], onDelete: Cascade)
  product  Product  @relation(fields: [productId], references: [id])

  @@id([wishlistId, productId])
}

model Address {
  id           String   @id @default(cuid())
  userId       String
  name         String
  fullName     String
  phone        String
  addressLine1 String
  addressLine2 String?
  city         String
  state        String
  pinCode      String
  isDefault    Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## 5. API Endpoint Impact Analysis

### 5.1 Authentication Routes (`/api/auth`)

| Endpoint | Method | MongoDB Query | Prisma Equivalent | Notes |
|----------|--------|--------------|-------------------|-------|
| `/register` | POST | `User.create()` | `prisma.user.create()` | Same structure |
| `/login` | POST | `User.findOne({ email }).select('+password')` | `prisma.user.findUnique({ where: { email }, select: { password: true, ... } })` | Must explicitly select password |
| `/google` | POST | `User.findOne({ googleId })` | `prisma.user.findUnique({ where: { googleId } })` | Same logic |
| `/me` | GET | `User.findById(req.user._id)` | `prisma.user.findUnique({ where: { id: req.user.id } })` | `_id` → `id` |

**Change needed**: Password hashing pre-save hook (Mongoose) must move to controller/service level since Prisma has no hooks.

---

### 5.2 Product Routes (`/api/products`)

| Endpoint | Method | MongoDB Query | Prisma Equivalent | Notes |
|----------|--------|--------------|-------------------|-------|
| `GET /` | GET | `Product.find(filter).sort().skip().limit()` | `prisma.product.findMany({ where, orderBy, skip, take, include: { images: true, sizes: true } })` | Full-text search changes |
| `GET /:id` | GET | `Product.findById(id).populate(...)` | `prisma.product.findUnique({ where: { id }, include: { images, sizes, seller, reviews } })` | |
| `POST /` | POST | `Product.create(data)` | Create with nested creates for images/sizes | Two-step or nested write |
| `PUT /:id` | PUT | `Product.findByIdAndUpdate()` | `prisma.product.update()` + nested upserts for images/sizes | More complex |
| `DELETE /:id` | DELETE | `Product.findByIdAndDelete()` | `prisma.product.delete()` | Cascade deletes handles images/sizes |

**Key difference**: Text search. MongoDB has native text index. In PostgreSQL use:
```sql
-- Add to migration
CREATE INDEX product_search_idx ON "Product" USING gin(to_tsvector('english', name || ' ' || description));
```
Or use Prisma's `contains` / `search` operators with PostgreSQL full-text search extension.

---

### 5.3 Order Routes (`/api/orders`)

| Endpoint | Method | MongoDB Operation | Prisma Equivalent | Notes |
|----------|--------|------------------|-------------------|-------|
| `POST /` | POST | `Order.create({ items: [...], shippingAddress: {...} })` | `prisma.order.create({ data: { items: { create: [...] }, shippingAddress: { create: {...} } } })` | Nested create |
| `GET /my-orders` | GET | `Order.find({ user: req.user._id }).populate(...)` | `prisma.order.findMany({ where: { userId }, include: { items: { include: { product } }, shippingAddress: true } })` | |
| `GET /:id` | GET | `Order.findById().populate(...)` | `prisma.order.findUnique({ include: { items, shippingAddress, paymentDetail } })` | |
| `PUT /:id/status` | PUT | `Order.findByIdAndUpdate()` | `prisma.order.update({ where: { id }, data: { status } })` | |

---

### 5.4 Cart Routes (`/api/cart`)

| Endpoint | Method | MongoDB Operation | Prisma Equivalent | Notes |
|----------|--------|------------------|-------------------|-------|
| `GET /` | GET | `Cart.findOne({ user }).populate(...)` | `prisma.cart.findUnique({ where: { userId }, include: { items: { include: { product: { include: { images } } } } } })` | |
| `POST /` | POST | `Cart.findOneAndUpdate({ user }, { $push items })` | `prisma.cartItem.create()` or update quantity | No `$push` — use upsert |
| `PUT /:itemId` | PUT | Direct doc update | `prisma.cartItem.update({ where: { id: itemId }, data: { quantity } })` | |
| `DELETE /:itemId` | DELETE | Pull from array | `prisma.cartItem.delete({ where: { id: itemId } })` | |
| `DELETE /` | DELETE | `Cart.findOneAndUpdate({ $set: { items: [] } })` | `prisma.cartItem.deleteMany({ where: { cartId } })` | |

---

### 5.5 Review Routes (`/api/reviews`)

| Endpoint | Method | MongoDB Operation | Prisma Equivalent | Notes |
|----------|--------|------------------|-------------------|-------|
| `GET /:productId` | GET | `Review.find({ product: productId }).populate(...)` | `prisma.review.findMany({ where: { productId }, include: { user: { select: { name, avatar } } } })` | |
| `POST /:productId` | POST | `Review.create()` + update Product.rating | Transaction: `prisma.$transaction([createReview, updateProduct])` | Use transaction |
| `PUT /:id` | PUT | `Review.findByIdAndUpdate()` + recalculate | Transaction to update review + recalculate product rating | |
| `DELETE /:id` | DELETE | `Review.findByIdAndDelete()` + recalculate | Transaction to delete + recalculate | |

**Rating recalculation** — currently done via Mongoose, must be done in controller:
```javascript
const avg = await prisma.review.aggregate({
  _avg: { rating: true },
  where: { productId }
});
await prisma.product.update({
  where: { id: productId },
  data: { rating: avg._avg.rating, numReviews: count }
});
```

---

### 5.6 Admin Routes (`/api/admin`)

| Endpoint | MongoDB Aggregation | Prisma Equivalent | Complexity |
|----------|--------------------|--------------------|-----------|
| `GET /stats` | `Order.aggregate([$group, $match...])` | `prisma.order.groupBy()` + `prisma.order.aggregate()` | Medium |
| `GET /users` | `User.aggregate([{ $lookup orders }])` | `prisma.user.findMany({ include: { _count: { select: { orders: true } } } })` | Easy |
| `GET /products` | `Product.find().populate('seller')` | `prisma.product.findMany({ include: { seller: true, images: true } })` | Easy |
| `GET /orders` | Complex populate | `prisma.order.findMany({ include: { user, items, shippingAddress } })` | Medium |

---

### 5.7 Payment Routes (`/api/payment`)

| Endpoint | Change Required |
|----------|----------------|
| `POST /create-order` | None (Razorpay logic unchanged) |
| `POST /verify-payment` | `Order.findByIdAndUpdate()` → `prisma.order.update()` + `prisma.paymentDetail.create()` |
| `GET /razorpay-key` | None |

---

## 6. Key Migration Challenges & Solutions

### Challenge 1: MongoDB Arrays → Relational Tables

| MongoDB Pattern | PostgreSQL Pattern |
|----------------|-------------------|
| `product.images = [url1, url2]` | `ProductImage` table with `productId` FK |
| `product.sizes = ['S', 'M', 'L']` | `ProductSize` table with `productId` FK |
| `order.items = [{product, qty, ...}]` | `OrderItem` table with `orderId` FK |
| `cart.items = [{product, qty, size}]` | `CartItem` table with `cartId` FK |
| `wishlist.products = [productId, ...]` | `WishlistProduct` junction table |

### Challenge 2: Embedded Documents → Separate Tables

| MongoDB Embedded | PostgreSQL Table |
|-----------------|-----------------|
| `order.shippingAddress` | `ShippingAddress` (1:1 with Order) |
| `order.paymentDetails` | `PaymentDetail` (1:1 with Order) |

### Challenge 3: Mongoose Hooks → Controller Logic

| Mongoose Hook | Migration |
|--------------|-----------|
| `User.pre('save') → hash password` | Move bcrypt hashing to `authController.register` and `authController.updatePassword` |
| No other hooks currently | N/A |

### Challenge 4: MongoDB ObjectId → CUID/UUID

- Replace all `_id` references with `id`
- All frontend/API responses use `_id` — update serialization or add `id` alias
- Recommend: use `cuid()` for compatibility (URL-safe, sortable)

### Challenge 5: Full-Text Search

MongoDB text index → PostgreSQL full-text search:
```sql
-- Add after migration
ALTER TABLE "Product" ADD COLUMN search_vector tsvector;
UPDATE "Product" SET search_vector = to_tsvector('english', name || ' ' || COALESCE(description, ''));
CREATE INDEX product_fts_idx ON "Product" USING gin(search_vector);
```
Or enable `prisma-client-js` preview feature `fullTextSearch` for PostgreSQL.

### Challenge 6: Transactions (Atomicity)

MongoDB lacks multi-document transactions in basic config. Prisma + PostgreSQL supports full ACID transactions — use `prisma.$transaction()` for:
- Creating order + clearing cart
- Creating review + updating product rating
- Payment verification + order status update

### Challenge 7: Decimal Precision

MongoDB stores numbers as double. PostgreSQL uses `DECIMAL(10, 2)` for prices — prevents floating point issues.

### Challenge 8: Enum Casing

MongoDB used lowercase strings (`'customer'`, `'men'`). Prisma enums are UPPER_CASE. API responses must transform, or use `@@map` in Prisma schema.

---

## 7. Migration Steps

### Phase 1: Setup
```bash
# 1. Create Neon DB project at neon.tech
# 2. Get connection string (pooled for production)

# 3. Install Prisma dependencies
npm install prisma @prisma/client
npm install -D prisma

# 4. Initialize Prisma
npx prisma init
```

### Phase 2: Schema
```bash
# 5. Paste the proposed Prisma schema into prisma/schema.prisma
# 6. Run migration
npx prisma migrate dev --name init
# 7. Generate client
npx prisma generate
```

### Phase 3: Code Migration
```
controllers/
  authController.js    → Move password hashing out of Mongoose hook
  productController.js → Handle images/sizes as nested Prisma writes
  orderController.js   → Use prisma.$transaction for order creation
  reviewController.js  → Use prisma.$transaction + aggregate for ratings
  cartController.js    → Replace MongoDB array ops with Prisma CRUD
  adminController.js   → Replace aggregations with Prisma groupBy/aggregate
```

### Phase 4: Data Migration Script
```javascript
// scripts/migrate-mongo-to-pg.js
const mongoose = require('mongoose');
const { PrismaClient } = require('@prisma/client');

// 1. Connect to both databases
// 2. Read all MongoDB documents
// 3. Transform ObjectIds to strings
// 4. Insert into PostgreSQL via Prisma
// 5. Handle nested arrays (images, sizes, items)
// 6. Verify counts match
```

### Phase 5: Cutover
1. Put app in maintenance mode
2. Run final data sync
3. Update `DATABASE_URL` in environment
4. Remove `MONGODB_URI` from environment
5. Deploy new code
6. Smoke test all endpoints
7. Monitor error logs

---

## 8. Environment Changes

### Variables to Add
```env
# Neon DB (PostgreSQL)
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# For connection pooling (Neon built-in)
DATABASE_URL_UNPOOLED="postgresql://user:password@host/dbname?sslmode=require"
```

### Variables to Remove
```env
MONGODB_URI=<remove this>
```

### Package Changes

**Remove**:
```bash
npm uninstall mongoose
```

**Add**:
```bash
npm install @prisma/client
npm install -D prisma
```

---

## 9. Table & Relationship Summary

### All Tables in Target PostgreSQL Schema

| Table | Rows Type | Primary Key | Foreign Keys |
|-------|-----------|-------------|-------------|
| User | Core entity | cuid | — |
| Product | Core entity | cuid | sellerId → User |
| ProductImage | Child of Product | cuid | productId → Product |
| ProductSize | Child of Product | cuid | productId → Product |
| Order | Core entity | cuid | userId → User |
| OrderItem | Child of Order | cuid | orderId → Order, productId → Product |
| ShippingAddress | Child of Order (1:1) | cuid | orderId → Order |
| PaymentDetail | Child of Order (1:1) | cuid | orderId → Order |
| Cart | Core entity (1:1 User) | cuid | userId → User |
| CartItem | Child of Cart | cuid | cartId → Cart, productId → Product |
| Review | Junction-like | cuid | productId → Product, userId → User |
| Wishlist | Core entity (1:1 User) | cuid | userId → User |
| WishlistProduct | Junction | [wishlistId, productId] | wishlistId → Wishlist, productId → Product |
| Address | Child of User | cuid | userId → User |

**Total tables**: 14
**Total enums**: 7 (Role, AuthProvider, Category, SizeEnum, PaymentMethod, PaymentStatus, OrderStatus)

---

*Report generated for Urban Thread E-commerce Platform — MongoDB to Neon DB + Prisma ORM migration planning.*
