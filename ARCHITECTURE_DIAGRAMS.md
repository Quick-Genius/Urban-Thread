# UrbanThread - Architecture Diagrams

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                              USERS                                  │
│                    (Web Browsers, Mobile Apps)                      │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         DNS LAYER                                   │
│                  (Route 53 / Cloudflare DNS)                        │
│                  • Geo-routing                                      │
│                  • Health checks                                    │
│                  • DDoS protection                                  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         CDN LAYER                                   │
│                  (CloudFront / Cloudflare)                          │
│                  • Static assets (JS, CSS, images)                  │
│                  • Edge caching                                     │
│                  • HTTP/2, Brotli compression                       │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    WEB APPLICATION FIREWALL                         │
│                      (AWS WAF / Cloudflare)                         │
│                  • SQL injection protection                         │
│                  • XSS prevention                                   │
│                  • Rate limiting                                    │
│                  • Bot detection                                    │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       LOAD BALANCER                                 │
│                  (AWS Application Load Balancer)                    │
│                  • SSL/TLS termination                              │
│                  • Health checks                                    │
│                  • Sticky sessions                                  │
│                  • Auto-scaling triggers                            │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        API GATEWAY                                  │
│                    (Kong / AWS API Gateway)                         │
│                  • Rate limiting (100 req/min)                      │
│                  • API versioning (/v1, /v2)                        │
│                  • Request validation                               │
│                  • Authentication check                             │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   APPLICATION SERVERS                               │
│                    (Docker on ECS/EKS)                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Server 1 │  │ Server 2 │  │ Server 3 │  │ Server N │             │
│  │ Node.js  │  │ Node.js  │  │ Node.js  │  │ Node.js  │             │
│  │ Express  │  │ Express  │  │ Express  │  │ Express  │             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
│       │             │             │             │                   │
│       └─────────────┴─────────────┴─────────────┘                   │
│                             │                                       │
└─────────────────────────────┼───────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
    ┌───────────────┐ ┌──────────────┐ ┌──────────────┐
    │  REDIS CACHE  │ │ MESSAGE QUEUE│ │   DATABASE   │
    │   (Cluster)   │ │  (RabbitMQ)  │ │   (MongoDB)  │
    │               │ │              │ │              │
    │ ┌───────────┐ │ │ ┌──────────┐ │ │ ┌──────────┐ │
    │ │ Primary   │ │ │ │  Order   │ │ │ │ Primary  │ │
    │ │ Replica 1 │ │ │ │  Email   │ │ │ │Secondary1│ │
    │ │ Replica 2 │ │ │ │Inventory │ │ │ │Secondary2│ │
    │ └───────────┘ │ │ │Analytics │ │ │ └──────────┘ │
    └───────────────┘ │ └──────────┘ │ └──────────────┘
                      │      │       │
                      └──────┼───────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │  BACKGROUND WORKERS  │
                  │                      │
                  │  ┌────────────────┐  │
                  │  │ Order Worker   │  │
                  │  │ Email Worker   │  │
                  │  │Analytics Worker│  │
                  │  │ Notify Worker  │  │
                  │  └────────────────┘  │
                  └──────────────────────┘
```

---

## Request Flow Diagram

### Product Listing Request (Cached)

```
User Request
    │
    ▼
┌─────────────────┐
│   CDN Check     │ ──── Cache Hit ───► Return Response
└────────┬────────┘
         │ Cache Miss
         ▼
┌─────────────────┐
│  Load Balancer  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Gateway    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  App Server     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Redis Cache    │ ──── Cache Hit ───► Return Response
└────────┬────────┘                      (Store in CDN)
         │ Cache Miss
         ▼
┌─────────────────┐
│  MongoDB Query  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Transform Data  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Store in Redis  │ (TTL: 5 min)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Return Response │
└─────────────────┘
```

### Order Creation Flow (Async)

```
User Checkout
    │
    ▼
┌─────────────────────┐
│  Validate Cart      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Check Inventory    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Create Order (DB)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Publish to Queue    │
│ (order-processing)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Return Order ID     │
│ to User             │
└─────────────────────┘

Background Processing:
    │
    ▼
┌─────────────────────┐
│  Order Worker       │
│  Consumes Queue     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Create Razorpay     │
│ Payment Order       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Update Inventory    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Publish Email Queue │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Email Worker        │
│ Sends Confirmation  │
└─────────────────────┘
```

---

## Database Schema Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                         USER                                 │
├──────────────────────────────────────────────────────────────┤
│ _id: ObjectId                                                │
│ name: String                                                 │
│ email: String (unique)                                       │
│ password: String (hashed)                                    │
│ role: String (customer/seller/admin)                         │
│ googleId: String (unique, sparse)                            │
│ authProvider: String (local/google)                          │
│ isActive: Boolean                                            │
│ createdAt: Date                                              │
└────────────┬─────────────────────────────────────────────────┘
             │
             │ Referenced by
             │
    ┌────────┼────────┬────────┬────────┬────────┐
    │        │        │        │        │        │
    ▼        ▼        ▼        ▼        ▼        ▼
┌────────┐ ┌────┐ ┌──────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ Order  │ │Cart│ │Wish  │ │Address │ │Review  │ │Product │
│        │ │    │ │list  │ │        │ │        │ │(seller)│
└────────┘ └────┘ └──────┘ └────────┘ └────────┘ └────────┘

┌──────────────────────────────────────────────────────────────┐
│                        PRODUCT                               │
├──────────────────────────────────────────────────────────────┤
│ _id: ObjectId                                                │
│ name: String                                                 │
│ description: String                                          │
│ price: Number                                                │
│ originalPrice: Number                                        │
│ category: String (men/women/kids/accessories)                │
│ sizes: [String]                                              │
│ images: [String]                                             │
│ sku: String (unique)                                         │
│ stock: Number                                                │
│ sold: Number                                                 │
│ rating: Number                                               │
│ numReviews: Number                                           │
│ seller: ObjectId → User                                      │
│ isActive: Boolean                                            │
│ createdAt: Date                                              │
└────────────┬─────────────────────────────────────────────────┘
             │
             │ Referenced by
             │
    ┌────────┼────────┬────────┐
    │        │        │        │
    ▼        ▼        ▼        ▼
┌────────┐ ┌────┐ ┌──────┐ ┌────────┐
│ Order  │ │Cart│ │Wish  │ │Review  │
│ Items  │ │    │ │list  │ │        │
└────────┘ └────┘ └──────┘ └────────┘

┌──────────────────────────────────────────────────────────────┐
│                         ORDER                                │
├──────────────────────────────────────────────────────────────┤
│ _id: ObjectId                                                │
│ user: ObjectId → User                                        │
│ items: [                                                     │
│   {                                                          │
│     product: ObjectId → Product                              │
│     name: String                                             │
│     price: Number                                            │
│     quantity: Number                                         │
│     size: String                                             │
│   }                                                          │
│ ]                                                            │
│ shippingAddress: {                                           │
│   fullName, phone, addressLine1, city, state, pinCode        │
│ }                                                            │
│ paymentMethod: String                                        │
│ paymentStatus: String (pending/paid/failed)                  │
│ paymentDetails: {                                            │
│   razorpay_order_id, razorpay_payment_id, paidAt             │
│ }                                                            │
│ subtotal: Number                                             │
│ shippingCost: Number                                         │
│ discount: Number                                             │
│ total: Number                                                │
│ status: String (Processing/Confirmed/Shipped/Delivered)      │
│ createdAt: Date                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Caching Strategy Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      CACHE LAYERS                           │
└─────────────────────────────────────────────────────────────┘

Level 1: CDN Cache (Edge)
┌─────────────────────────────────────────────────────────────┐
│  • Static assets (JS, CSS, images)                          │
│  • TTL: 24 hours                                            │
│  • Invalidation: On deployment                              │
└─────────────────────────────────────────────────────────────┘

Level 2: Redis Cache (Application)
┌─────────────────────────────────────────────────────────────┐
│  Product Listings                    TTL: 5 minutes         │
│  Product Details                     TTL: 10 minutes        │
│  User Sessions                       TTL: 7 days            │
│  User Cart                           TTL: 24 hours          │
│  API Responses                       TTL: varies            │
└─────────────────────────────────────────────────────────────┘

Level 3: Database (MongoDB)
┌─────────────────────────────────────────────────────────────┐
│  • Persistent storage                                       │
│  • Indexed queries                                          │
│  • Replica set for read scaling                             │
└─────────────────────────────────────────────────────────────┘

Cache Invalidation Strategy:
┌─────────────────────────────────────────────────────────────┐
│  Product Update → Clear:                                    │
│    • product:{id}                                           │
│    • products:list:*                                        │
│                                                             │
│  Order Create → Clear:                                      │
│    • cart:{userId}                                          │
│    • orders:user:{userId}:*                                 │
│                                                             │
│  User Update → Clear:                                       │
│    • user:{userId}                                          │
│    • session:{token}                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Monitoring Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│                   SYSTEM HEALTH DASHBOARD                   │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐
│   Request Rate       │  │   Response Time      │
│   ████████ 8.5k/s   │  │   ████ 245ms (p95)  │
│   ↑ 12% from 1h ago │  │   ↓ 5% from 1h ago  │
└──────────────────────┘  └──────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐
│   Error Rate         │  │   Cache Hit Ratio    │
│   ██ 0.08%          │  │   ████████ 85%      │
│   ↓ 0.02% from 1h   │  │   ↑ 3% from 1h ago  │
└──────────────────────┘  └──────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│   Active Instances                                           │
│   ████████ 6 / 10 max                                        │
│   CPU: 65%  Memory: 72%  Network: 450 Mbps                   │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│   Database Performance                                       │
│   Connections: 45 / 100                                      │
│   Query Time: 85ms avg                                       │
│   Replication Lag: 2ms                                       │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│   Queue Depth                                                │
│   order-processing: 12 messages                              │
│   email-notifications: 5 messages                            │
│   inventory-updates: 0 messages                              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│   Recent Alerts                                              │
│   ⚠️  High memory usage on server-3 (85%)                    │
│   ✅  Database failover test successful                      │
│   ✅  All health checks passing                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Security Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                          │
└─────────────────────────────────────────────────────────────┘

Layer 1: Network Security
┌─────────────────────────────────────────────────────────────┐
│  • VPC with private subnets                                 │
│  • Security groups (least privilege)                        │
│  • Network ACLs                                             │
│  • VPN/Bastion for admin access                             │
└─────────────────────────────────────────────────────────────┘

Layer 2: Application Security
┌─────────────────────────────────────────────────────────────┐
│  • HTTPS only (TLS 1.3)                                     │
│  • JWT authentication                                       │
│  • Input validation                                         │
│  • XSS protection (CSP)                                     │
│  • CSRF tokens                                              │
│  • Rate limiting                                            │
└─────────────────────────────────────────────────────────────┘

Layer 3: Data Security
┌─────────────────────────────────────────────────────────────┐
│  • Encryption at rest (AES-256)                             │
│  • Encryption in transit (TLS)                              │
│  • PII masking in logs                                      │
│  • Secrets management (AWS Secrets Manager)                 │
│  • Regular backups                                          │
└─────────────────────────────────────────────────────────────┘

Layer 4: Access Control
┌─────────────────────────────────────────────────────────────┐
│  • Role-based access control (RBAC)                         │
│  • Multi-factor authentication                              │
│  • API key management                                       │
│  • Audit logging                                            │
└─────────────────────────────────────────────────────────────┘
```

---

These diagrams provide a visual representation of the production-ready architecture for UrbanThread. Use them as reference when implementing the system.
