# UrbanThread E-Commerce Platform - High-Level Design (HLD)

## Executive Summary

This document outlines the production-ready architecture for UrbanThread, an e-commerce platform designed to handle thousands of concurrent users with high availability, scalability, and security.

## Current State vs Target State

### Current Architecture
```
User → Vercel (Frontend) → Render (Backend) → MongoDB Atlas
                                ↓
                         ImageKit, Razorpay
```

### Target Production Architecture
```
Users
  ↓
DNS (Route53/Cloudflare)
  ↓
CDN (CloudFront/Cloudflare)
  ↓
WAF (Web Application Firewall)
  ↓
Load Balancer (ALB/NLB)
  ↓
API Gateway (Rate Limiting, Auth)
  ↓
Application Servers (Auto-scaling)
  ↓
Cache Layer (Redis Cluster)
  ↓
Message Queue (RabbitMQ/SQS)
  ↓
Database Cluster (MongoDB Replica Set)
  ↓
Background Workers (Order Processing, Emails)
```

## System Architecture Components

### 1. DNS Layer
**Purpose**: Route users to nearest edge location
**Technology**: AWS Route 53 / Cloudflare DNS
**Features**:
- Geo-routing for global users
- Health checks and failover
- DDoS protection at DNS level


### 2. CDN Layer
**Purpose**: Serve static assets with low latency
**Technology**: AWS CloudFront / Cloudflare CDN
**Cached Content**:
- React build files (JS, CSS)
- Product images (via ImageKit)
- Static assets (fonts, icons)
**Configuration**:
- Cache-Control headers
- Edge caching (TTL: 1 hour for images, 1 day for static assets)
- Gzip/Brotli compression
- HTTP/2 support

### 3. Web Application Firewall (WAF)
**Purpose**: Protect against common web attacks
**Technology**: AWS WAF / Cloudflare WAF
**Rules**:
- SQL injection protection
- XSS attack prevention
- Rate limiting per IP
- Geo-blocking (if needed)
- Bot detection and mitigation

### 4. Load Balancer
**Purpose**: Distribute traffic across multiple backend instances
**Technology**: AWS Application Load Balancer (ALB)
**Features**:
- Health checks (every 30s)
- SSL/TLS termination
- Sticky sessions (for cart consistency)
- WebSocket support (for real-time features)
- Auto-scaling triggers


### 5. API Gateway
**Purpose**: Centralized API management and security
**Technology**: AWS API Gateway / Kong / Express Gateway
**Features**:
- Rate limiting (100 req/min per user, 1000 req/min per IP)
- Request/response transformation
- API versioning (/api/v1, /api/v2)
- Authentication validation
- Request logging and monitoring
- CORS management

### 6. Application Servers
**Purpose**: Run Node.js/Express backend
**Technology**: Docker containers on ECS/EKS or EC2 Auto Scaling
**Configuration**:
- Minimum 2 instances (high availability)
- Auto-scaling: 2-10 instances based on CPU (70%) and memory (80%)
- Health check endpoint: /api/health
- Graceful shutdown handling
- Environment-based configuration
**Deployment Strategy**:
- Blue-green deployment
- Rolling updates with health checks
- Rollback capability

### 7. Cache Layer
**Purpose**: Reduce database load and improve response times
**Technology**: Redis Cluster (AWS ElastiCache)
**Cached Data**:
- Product listings (TTL: 5 minutes)
- Product details (TTL: 10 minutes)
- User sessions (TTL: 7 days)
- Cart data (TTL: 24 hours)
- API responses (TTL: varies)
**Configuration**:
- 3-node cluster (1 primary, 2 replicas)
- Automatic failover
- Persistence enabled (AOF + RDB)


### 8. Message Queue
**Purpose**: Asynchronous task processing
**Technology**: RabbitMQ / AWS SQS + SNS
**Queues**:
- **order-processing**: Order creation, payment verification
- **email-notifications**: Order confirmations, shipping updates
- **inventory-updates**: Stock adjustments, low stock alerts
- **analytics-events**: User behavior tracking
**Benefits**:
- Decouples services
- Handles traffic spikes
- Retry failed tasks
- Dead letter queue for failed messages

### 9. Database Layer
**Purpose**: Persistent data storage
**Technology**: MongoDB Atlas (Replica Set)
**Configuration**:
- 3-node replica set (1 primary, 2 secondaries)
- Read preference: primaryPreferred
- Write concern: majority
- Automatic failover
- Point-in-time recovery
**Sharding Strategy** (for >1M products):
- Shard key: category + _id
- 3 shards minimum
**Indexes**:
- Products: category, price, rating, createdAt, text search
- Orders: user, status, createdAt
- Users: email (unique), googleId (unique, sparse)
- Reviews: product + user (compound unique)


### 10. Background Workers
**Purpose**: Process async tasks from message queue
**Technology**: Node.js workers (separate processes)
**Workers**:
- **Email Worker**: Send transactional emails (SendGrid/SES)
- **Order Worker**: Process orders, update inventory
- **Analytics Worker**: Aggregate user behavior data
- **Notification Worker**: Push notifications, SMS
**Configuration**:
- 2-5 worker instances per queue
- Auto-scaling based on queue depth
- Error handling and retry logic
- Dead letter queue monitoring

### 11. Monitoring & Logging
**Purpose**: Observability and debugging
**Technology**: 
- **Logs**: CloudWatch Logs / ELK Stack
- **Metrics**: CloudWatch / Prometheus + Grafana
- **APM**: New Relic / Datadog
- **Error Tracking**: Sentry
**Monitored Metrics**:
- Request rate, latency (p50, p95, p99)
- Error rate (4xx, 5xx)
- Database query performance
- Cache hit ratio
- Queue depth and processing time
- CPU, memory, disk usage
**Alerts**:
- Error rate > 1%
- Latency p95 > 500ms
- Database connections > 80%
- Queue depth > 1000 messages


## Data Flow Diagrams

### User Registration Flow
```
User → CDN → Load Balancer → API Gateway → App Server
                                              ↓
                                         Validate Input
                                              ↓
                                         Hash Password
                                              ↓
                                         MongoDB (User)
                                              ↓
                                         Generate JWT
                                              ↓
                                         Cache Session (Redis)
                                              ↓
                                         Return Token
```

### Product Listing Flow (Optimized)
```
User → CDN → Load Balancer → API Gateway → App Server
                                              ↓
                                         Check Redis Cache
                                              ↓
                                         [Cache Hit] → Return Cached Data
                                              ↓
                                         [Cache Miss] → Query MongoDB
                                              ↓
                                         Transform Data
                                              ↓
                                         Store in Redis (TTL: 5min)
                                              ↓
                                         Return Response
```

### Order Creation Flow (Async)
```
User → API Gateway → App Server
                        ↓
                   Validate Cart
                        ↓
                   Create Order (MongoDB)
                        ↓
                   Publish to Queue (order-processing)
                        ↓
                   Return Order ID
                        
Background Worker:
    ↓
Process Payment (Razorpay)
    ↓
Update Inventory (MongoDB)
    ↓
Send Email (Queue: email-notifications)
    ↓
Update Order Status
```


## Scalability Strategy

### Horizontal Scaling
- **Application Servers**: Auto-scale 2-10 instances
- **Database**: Replica set (read scaling), sharding (write scaling)
- **Cache**: Redis cluster with multiple nodes
- **Workers**: Scale based on queue depth

### Vertical Scaling
- **Database**: Upgrade instance size for primary node
- **Cache**: Increase memory allocation
- **Application**: Increase container resources

### Performance Targets
- **Response Time**: p95 < 500ms, p99 < 1s
- **Throughput**: 10,000 requests/second
- **Concurrent Users**: 50,000+
- **Database Queries**: < 100ms average
- **Cache Hit Ratio**: > 80%

## High Availability Strategy

### Redundancy
- Multi-AZ deployment (3 availability zones)
- Database replica set (automatic failover)
- Load balancer health checks
- Auto-scaling groups

### Disaster Recovery
- **RTO** (Recovery Time Objective): 15 minutes
- **RPO** (Recovery Point Objective): 5 minutes
- Automated backups (daily full, hourly incremental)
- Cross-region replication for critical data
- Backup retention: 30 days

### Failover Scenarios
1. **App Server Failure**: Load balancer routes to healthy instances
2. **Database Primary Failure**: Automatic promotion of secondary
3. **Cache Failure**: Fallback to database queries
4. **Region Failure**: DNS failover to backup region


## Security Architecture

### Network Security
- VPC with private subnets for backend
- Security groups (least privilege)
- Network ACLs
- VPN/Bastion host for admin access

### Application Security
- HTTPS only (TLS 1.3)
- JWT with short expiration (15 min access, 7 day refresh)
- Password hashing (bcrypt, cost factor 12)
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS protection (Content Security Policy)
- CSRF tokens for state-changing operations
- Rate limiting per user and IP

### Data Security
- Encryption at rest (MongoDB, S3)
- Encryption in transit (TLS)
- PII data masking in logs
- Secrets management (AWS Secrets Manager)
- Regular security audits
- Compliance: PCI-DSS (for payments), GDPR

### Authentication & Authorization
- Multi-factor authentication (optional)
- OAuth 2.0 (Google, Facebook)
- Role-based access control (RBAC)
- API key management for integrations
- Session management (Redis)

## Cost Optimization

### Infrastructure Costs (Estimated Monthly)
- **Compute**: $500-1000 (EC2/ECS instances)
- **Database**: $300-600 (MongoDB Atlas M30)
- **Cache**: $100-200 (ElastiCache Redis)
- **CDN**: $50-150 (CloudFront)
- **Load Balancer**: $50-100 (ALB)
- **Monitoring**: $100-200 (CloudWatch, Datadog)
- **Total**: $1,100-2,250/month

### Optimization Strategies
- Reserved instances (30-50% savings)
- Spot instances for workers (70% savings)
- Auto-scaling to match demand
- Cache to reduce database queries
- CDN to reduce bandwidth costs
- Compress responses (gzip/brotli)


## Technology Stack Summary

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Context API + React Query
- **Hosting**: Vercel / CloudFront + S3

### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js
- **Language**: JavaScript (migrate to TypeScript recommended)
- **API Style**: RESTful
- **Hosting**: Docker on ECS/EKS

### Database
- **Primary**: MongoDB Atlas (Replica Set)
- **Cache**: Redis Cluster
- **Search**: MongoDB Atlas Search / Elasticsearch

### External Services
- **Payment**: Razorpay
- **Storage**: ImageKit CDN
- **Email**: SendGrid / AWS SES
- **SMS**: Twilio / AWS SNS
- **Analytics**: Google Analytics, Mixpanel

### DevOps
- **CI/CD**: GitHub Actions / GitLab CI
- **Containerization**: Docker
- **Orchestration**: Kubernetes / ECS
- **IaC**: Terraform / CloudFormation
- **Monitoring**: Datadog / New Relic
- **Logging**: ELK Stack / CloudWatch

## Migration Roadmap

### Phase 1: Foundation (Week 1-2)
- Set up VPC and networking
- Deploy MongoDB replica set
- Set up Redis cluster
- Configure load balancer
- Implement health checks

### Phase 2: Application (Week 3-4)
- Containerize backend
- Deploy to ECS/EKS
- Implement auto-scaling
- Set up CI/CD pipeline
- Configure monitoring

### Phase 3: Optimization (Week 5-6)
- Implement caching strategy
- Add message queue
- Deploy background workers
- Optimize database queries
- Add CDN for frontend

### Phase 4: Security (Week 7-8)
- Implement WAF rules
- Add rate limiting
- Security audit and fixes
- Secrets management
- Compliance review

### Phase 5: Testing (Week 9-10)
- Load testing (10k concurrent users)
- Stress testing
- Failover testing
- Performance tuning
- Documentation

### Phase 6: Go-Live (Week 11-12)
- Blue-green deployment
- DNS cutover
- Monitor and optimize
- Post-launch support
