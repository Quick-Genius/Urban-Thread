# Urban Thread — Frontend Redesign Prompt

## Brand Identity

**Urban Thread** is a premium stitched clothing e-commerce store for Men, Women, Kids, and Accessories. The brand communicates: modern, confident, minimal, and trustworthy. Think Zara meets Apple — clean product photography takes center stage, UI disappears into the background, and every interaction feels intentional.

---

## Tech Stack

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS 4
- **Routing:** React Router DOM v6
- **Auth:** Clerk (email/password + Google OAuth)
- **State:** React Context API (Auth, Cart, Wishlist)
- **HTTP:** Axios with Clerk token interceptor
- **Icons:** Lucide React
- **Animations:** Motion (Framer Motion)
- **UI Primitives:** Radix UI (already installed — Dialog, Dropdown, Tabs, Select, etc.)
- **Charts:** Recharts (admin)
- **Toasts:** Sonner
- **Forms:** React Hook Form + Zod validation

---

## 7 Principles of UI/UX Design — Applied Throughout

### 1. Visual Hierarchy
- Every page has ONE clear focal point (hero image, product photo, CTA button)
- Typography scale: Display (48-64px) → H1 (36px) → H2 (28px) → H3 (22px) → Body (16px) → Caption (13px)
- Primary actions are bold and colored (#FF3B30), secondary actions are outlined, tertiary are text-only
- Whitespace is generous — let content breathe (minimum 64px between page sections)
- Product images are always the largest element on any product-related page

### 2. Consistency
- ONE button style system used everywhere: Primary (filled red), Secondary (outlined dark), Ghost (text-only)
- ONE card style: white bg, rounded-2xl, subtle shadow-sm, hover:shadow-md transition
- ONE input style: rounded-lg, border-gray-200, focus:ring-2 focus:ring-red-500/20 focus:border-red-500
- Spacing follows an 8px grid (p-2=8px, p-4=16px, p-6=24px, p-8=32px)
- Every page uses the same max-w-7xl centered container with px-4 sm:px-6 lg:px-8
- Color palette is STRICT — no random colors. Only the defined design tokens below

### 3. Simplicity
- No clutter. One primary action per section. Filters collapse on mobile into a drawer
- Navigation: max 6 top-level items. Mega-menu for categories, not dropdowns
- Product cards show ONLY: image, name, price, rating stars. No description on cards
- Checkout is a single-page stepped flow, not multi-page
- Empty states are helpful, not just decorative — always include a relevant CTA

### 4. Feedback
- Every button click shows a loading spinner or state change
- Add to cart triggers a slide-in toast with product thumbnail + "View Cart" link
- Wishlist heart animates (scale + fill) on toggle
- Form submissions show inline validation errors in real-time (not on submit)
- Skeleton loaders for ALL async content (products, orders, cart) — never a blank screen
- Page transitions use subtle fade-in (opacity 0→1, 200ms ease-out)

### 5. Accessibility
- All interactive elements have visible focus rings (ring-2 ring-offset-2)
- Color contrast ratio minimum 4.5:1 for text, 3:1 for large text
- All images have descriptive alt text
- Form inputs have proper labels (not just placeholders)
- Keyboard navigation works on all modals, dropdowns, and tabs
- ARIA labels on icon-only buttons (wishlist heart, delete, close)
- Skip-to-content link at the top of every page
- Touch targets minimum 44x44px on mobile

### 6. Flexibility
- Fully responsive: mobile-first with breakpoints at sm(640px), md(768px), lg(1024px), xl(1280px)
- Product grid: 1 col mobile → 2 col sm → 3 col md → 4 col lg
- Filter sidebar: visible on desktop, bottom sheet/drawer on mobile
- Navigation: full horizontal nav on desktop, hamburger slide-out on mobile
- Images: use srcset/sizes or next-gen formats. Lazy-load below-the-fold images
- Tables (admin): horizontal scroll on mobile, not squished columns

### 7. Error Prevention & Tolerance
- Disable "Add to Cart" when no size is selected (with tooltip explaining why)
- Disable "Place Order" until address + payment method selected
- Confirm dialogs for destructive actions (delete address, remove from cart, cancel order)
- Out-of-stock products show "Notify Me" instead of add to cart
- Quantity selector respects stock limits (max = product.stock)
- Form inputs: phone field accepts only digits, pincode validates 6 digits, email validates format
- Payment failures show clear recovery path ("Try Again" + alternative payment options)
- 404 page with search bar and popular category links

---

## Design Tokens

```
Colors:
  --primary:         #FF3B30    (Red — CTAs, highlights, active states)
  --primary-hover:   #E63529    (Darker red — button hover)
  --secondary:       #1E1E1E    (Near-black — text, dark UI elements)
  --accent:          #007AFF    (Blue — links, info badges, secondary accent)
  --background:      #FAFAFA    (Light gray — page background)
  --surface:         #FFFFFF    (White — cards, modals, inputs)
  --border:          #E5E7EB    (Gray-200 — borders, dividers)
  --border-hover:    #D1D5DB    (Gray-300 — border hover)
  --text-primary:    #1E1E1E    (Headings, important text)
  --text-secondary:  #6B7280    (Gray-500 — body text, descriptions)
  --text-tertiary:   #9CA3AF    (Gray-400 — captions, placeholders)
  --success:         #22C55E    (Green — delivered, success)
  --warning:         #F59E0B    (Amber — processing, warnings)
  --error:           #EF4444    (Red-500 — errors, validation)
  --info:            #3B82F6    (Blue-500 — info, in-transit)

Typography:
  Font Family:       "Inter", system-ui, -apple-system, sans-serif
  Font Weights:      400 (body), 500 (medium), 600 (semibold), 700 (bold)

Radius:
  --radius-sm:       8px   (buttons, inputs, badges)
  --radius-md:       12px  (cards, dropdowns)
  --radius-lg:       16px  (modals, large cards)
  --radius-full:     9999px (pills, avatars)

Shadows:
  --shadow-sm:       0 1px 2px rgba(0,0,0,0.05)
  --shadow-md:       0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)
  --shadow-lg:       0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)

Transitions:
  Default:           150ms ease-out
  Slow:              300ms ease-out
```

---

## Page-by-Page Specification

---

### 1. NAVBAR (Global — sticky top, white, shadow-sm on scroll)

**Desktop (lg+):**
```
[Logo]  [Men]  [Women]  [Kids]  [Accessories]  [Sale]     [SearchIcon]  [HeartIcon(count)]  [CartIcon(count)]  [UserAvatar/SignIn]
```
- Logo: "URBAN THREAD" wordmark, uppercase, tracking-widest, font-bold, text-lg, links to /
- Category links: uppercase, text-sm, tracking-wide, font-medium, hover:text-primary transition
- On hover of Men/Women/Kids: show mega-menu dropdown with subcategory images (optional, can be a simple dropdown with product count)
- Search: Click opens a full-width search overlay with input auto-focused, recent searches, and trending terms
- Heart icon: shows filled red heart if wishlist has items, badge count (rounded-full, bg-primary, text-white, text-xs, absolute -top-1 -right-1)
- Cart icon: same badge pattern with item count
- User: If authenticated → avatar circle (32px) with dropdown (Dashboard, Orders, Wishlist, Addresses, Logout). If not → "Sign In" text link

**Mobile (<lg):**
```
[Hamburger]  [Logo centered]  [SearchIcon]  [CartIcon(count)]
```
- Hamburger: opens slide-from-left drawer with: categories, wishlist, account links, sign in/out
- Search icon: opens full-screen search overlay
- Cart badge visible

**API Required:** None (static + context data for counts)

---

### 2. FOOTER (Global)

Four-column layout on desktop, stacked on mobile:
- **Column 1:** Brand logo + short tagline ("Premium stitched clothing for the modern wardrobe") + social icons (Instagram, Twitter/X, Facebook)
- **Column 2:** Shop — Men, Women, Kids, Accessories, New Arrivals, Sale
- **Column 3:** Help — Contact Us, Track Order, Shipping & Returns, Size Guide, FAQ
- **Column 4:** Company — About Us, Privacy Policy, Terms of Service

Bottom bar: "© 2026 Urban Thread. All rights reserved." + payment icons (Visa, Mastercard, UPI, Razorpay)

Background: #1E1E1E (dark), text: white/gray-400. Generous padding (py-16).

---

### 3. HOME PAGE (`/`)

**Section 1: Hero Banner**
- Full-width, min-h-[85vh] on desktop, min-h-[60vh] on mobile
- Large lifestyle photograph (clothing model) as background with subtle dark overlay
- Text overlay (left-aligned on desktop, centered on mobile):
  - Eyebrow: "NEW COLLECTION 2026" — uppercase, text-sm, tracking-widest, text-white/80
  - Headline: "Redefine Your Style" — text-5xl lg:text-7xl, font-bold, text-white
  - Subheadline: "Premium stitched clothing crafted for comfort and confidence" — text-lg, text-white/70, max-w-lg
  - CTA: "Shop Now →" — Primary button (large), mt-8
- Animate in: headline slides up + fades in (300ms), subheadline follows (400ms delay), CTA follows (500ms delay)

**Section 2: Category Cards**
- Heading: "SHOP BY CATEGORY" — centered, uppercase, tracking-widest, text-2xl, font-semibold, mb-12
- 4 cards in a row (2x2 on mobile): Men, Women, Kids, Accessories
- Each card: aspect-[3/4] image, dark gradient overlay at bottom, category name + "Explore →" link overlaid
- On hover: image scales 1.05, overlay lightens slightly
- Links to `/products/men`, `/products/women`, `/products/kids`, `/products/accessories`

**Section 3: Trending / Featured Products**
- Heading: "TRENDING NOW" — same heading style
- Horizontal scrollable carousel (Embla Carousel) showing 8-12 products
- Each item is a ProductCard component (see component spec below)
- Left/Right arrow buttons on desktop, swipe on mobile
- "View All →" link at the top-right, links to `/products/all`

**API:** `GET /api/products?sort=newest&limit=12`

**Section 4: Promotional Banner (Split)**
- Two-column layout (stacked on mobile)
- Left: Image of clothing with gradient
- Right: "UP TO 40% OFF" headline, "On selected items this season" body, "Shop Sale →" CTA linking to `/sale`

**Section 5: Why Choose Us (Trust Signals)**
- 4-column grid (2x2 on mobile):
  - Free Shipping on orders above ₹999
  - Easy Returns within 7 days
  - Secure Payments (Razorpay encrypted)
  - Premium Quality stitched garments
- Each: icon (40px, text-primary) + title (font-semibold) + one-line description (text-secondary)

**Section 6: Customer Testimonials**
- Heading: "WHAT OUR CUSTOMERS SAY"
- 3 testimonial cards, each: quote text, star rating (5 stars), customer name + "Verified Buyer" badge
- Subtle gray background section (bg-gray-50)

**Section 7: Newsletter Signup**
- Centered section: "Stay in the loop" heading, "Get early access to new collections and exclusive offers" subtext
- Email input + "Subscribe" button inline (responsive: stacked on mobile)
- Note: This is UI only — no backend endpoint for newsletter exists

---

### 4. PRODUCT LISTING PAGE (`/products/:category`)

**Handles:** `/products/all`, `/products/men`, `/products/women`, `/products/kids`, `/products/accessories`, `/sale`, `/search?q=...`, `/collections`

**Layout:** Sidebar (left, 280px) + Product Grid (right)

**Breadcrumb:** Home → Men (or relevant category) — text-sm, text-secondary

**Page Header:**
- Category name: "MEN'S COLLECTION" — text-3xl, font-bold, uppercase
- Product count: "(124 products)" — text-secondary, inline
- Sort dropdown (right-aligned): "Sort by" — Newest, Price: Low to High, Price: High to Low, Highest Rated

**Filter Sidebar (Desktop — sticky, scrollable):**
Inside a white card (bg-surface, rounded-lg, p-6):
- **Category** (if on /products/all): checkboxes for Men, Women, Kids, Accessories
- **Price Range:** Dual-thumb range slider (min ₹0, max ₹10,000) with input fields showing current values
- **Size:** Pill-shaped toggles: XS, S, M, L, XL, XXL (multi-select, filled primary when active)
- **Rating:** Star filter — "4★ & above", "3★ & above" etc.
- "Clear All Filters" link at bottom
- Each filter section: collapsible with chevron icon

**Filter Sidebar (Mobile):**
- Hidden by default. "Filters" button (with filter icon + active filter count badge) at top
- Opens a full-height bottom sheet / slide-up drawer with all filters + "Apply" button at bottom
- "X active filters" shown when filters are applied

**Product Grid:**
- Grid: 2 col mobile, 3 col md, 4 col lg
- Gap: 24px (gap-6)
- Each item is a `ProductCard` component

**Pagination:**
- Bottom of grid
- "← Previous | Page 1 of 12 | Next →"
- Or infinite scroll with "Load More" button

**Empty State:**
- Illustration/icon + "No products found" + "Try adjusting your filters or browse all products" + CTA to /products/all

**API:** `GET /api/products?category={}&minPrice={}&maxPrice={}&sizes={}&rating={}&search={}&sort={}&page={}&limit=16`

---

### 5. PRODUCT CARD (Reusable Component)

```
┌─────────────────────────┐
│                         │
│   [Product Image]       │  ← aspect-[3/4], object-cover, rounded-t-lg
│                    [♡]  │  ← Wishlist heart, absolute top-3 right-3
│                         │
├─────────────────────────┤
│ Product Name            │  ← text-sm, font-medium, line-clamp-1, text-primary
│ ★★★★☆ (4.2)            │  ← text-xs, stars in primary color
│ ₹1,299  ₹1,999         │  ← current: font-semibold, text-primary | original: line-through, text-tertiary
└─────────────────────────┘
```

**Interactions:**
- Hover: image zooms 1.05 (overflow-hidden on container), shadow increases
- Click anywhere (except heart): navigates to `/product/:id`
- Heart icon: toggle wishlist (optimistic UI — fills red immediately, rolls back on error)
- If `originalPrice` exists and > `price`, show both (with discount badge: "-35% OFF" pill, absolute top-3 left-3, bg-primary, text-white, text-xs)

---

### 6. PRODUCT DETAIL PAGE (`/product/:id`)

**Layout:** Two-column (stacked on mobile)

**Left Column — Image Gallery (50% width on desktop):**
- Main image: large, aspect-square, rounded-lg, object-cover
- Thumbnail strip below (horizontal scroll): 4-6 small thumbnails, click to swap main image
- Active thumbnail has a border-2 border-primary ring
- On mobile: horizontal swipeable carousel with dot indicators

**Right Column — Product Info:**
- Breadcrumb: Home → Men → Product Name
- Product name: text-3xl, font-bold, text-primary
- Rating: ★★★★☆ 4.2 (128 reviews) — stars + clickable "reviews" link that scrolls to reviews section
- Price block:
  - Current price: text-3xl, font-bold, text-primary — ₹1,299
  - Original price (if discounted): text-xl, line-through, text-tertiary — ₹1,999
  - Discount badge: "35% OFF" pill — bg-green-100 text-green-700
- Divider line (border-t, my-6)
- Description: text-secondary, text-base, leading-relaxed
- **Size Selector:**
  - Label: "Select Size" with "Size Guide" link (opens modal with size chart table)
  - Pill buttons for each size in `product.sizes[]`
  - Active: bg-primary text-white. Available: border-gray-200 hover:border-primary. Out of stock: opacity-40 line-through cursor-not-allowed
  - Validation: if no size selected and user clicks "Add to Cart" → show red error text "Please select a size"
- **Quantity Selector:**
  - [-] [number] [+] inline row
  - Min: 1, Max: product.stock
  - Disable [-] at 1, disable [+] at max stock
- **Action Buttons (flex row, gap-4):**
  - "Add to Cart" — Primary button, full width on mobile, w-64 on desktop. Shows spinner during API call. After success: changes to "✓ Added" for 2 seconds, then reverts
  - "♡ Wishlist" — Secondary (outlined) button, icon + text. Toggles fill
- Stock indicator: "Only 3 left in stock" (if stock <= 5, text-warning) or "In Stock" (text-success) or "Out of Stock" (text-error, disable Add to Cart)
- **Features list** (if product.features[] is not empty):
  - Bullet list with check icons, text-secondary
- **Product Details accordion** (Radix Accordion):
  - "Shipping & Returns" — Free shipping above ₹999, 7-day returns
  - "Care Instructions" — Placeholder/static text

**API:** `GET /api/products/:id`

**Below Product Info — Reviews Section:**
- Heading: "Customer Reviews" + overall rating summary (large star + "4.2 out of 5" + "Based on 128 reviews")
- Rating breakdown bar chart (5★: 60%, 4★: 25%, etc. — horizontal bars)
- "Write a Review" button (opens modal with star rating selector + textarea)
- Review list: each review shows user avatar + name + date + star rating + comment text
- Paginated or "Show More" if many reviews

**API:**
- `GET /api/reviews/:productId`
- `POST /api/reviews/:productId` — { rating: 1-5, comment: string }
- `PUT /api/reviews/:id` — update own review
- `DELETE /api/reviews/:id` — delete own review

---

### 7. CART PAGE (`/cart`)

**Layout:** Two-column on desktop (65% items / 35% summary), single column stacked on mobile

**Left — Cart Items:**
- Heading: "Shopping Cart" + "(3 items)"
- Each item row (white card, rounded-lg, p-4, mb-3):
  ```
  [Image 80x80 rounded-lg]  |  Name (font-medium, link to product)        |  ₹1,299
                             |  Size: M  |  Color: Navy                     |
                             |  [-] 2 [+]  |  Remove (text-error, text-sm) |
  ```
- Quantity buttons: same as PDP. Optimistic update with debounce (300ms) to avoid API spam
- Remove: red text link, on click → confirm toast or instant remove with "Undo" toast (3s)
- If item.product.stock < item.quantity: show warning "Only X available" in orange
- If item.product.isActive === false: show "This product is no longer available" + auto-remove option

**Right — Order Summary (sticky on desktop):**
- White card, rounded-lg, p-6
  ```
  Order Summary
  ─────────────────
  Subtotal (3 items)          ₹3,897
  Shipping                    ₹99  (or "FREE" in green if subtotal ≥ 999)
  ─────────────────
  Total                       ₹3,996

  [Promo Code Input] [Apply]

  [Proceed to Checkout →]    ← Primary button, full-width
  ```
- Promo codes accepted: FREESHIP, FIRST2024 (as per current codebase)
- If promo applied: show "FREESHIP applied ✓" with remove "×" icon, shipping shows "FREE" with strikethrough on ₹99
- Below button: "Free shipping on orders above ₹999" info text with truck icon
- Trust badges: Secure Payment, Easy Returns icons

**Empty Cart:**
- Centered in a white card: Cart icon (gray-300, 64px) + "Your cart is empty" heading + "Looks like you haven't added anything yet" body + "Continue Shopping →" CTA

**API:**
- `GET /api/cart`
- `POST /api/cart` — { productId, quantity, size }
- `PUT /api/cart/:itemId` — { quantity }
- `DELETE /api/cart/:itemId`
- `DELETE /api/cart` — clear all

---

### 8. CHECKOUT PAGE (`/checkout`) — Protected

**Single-page stepped flow with progress indicator at top:**
```
Step 1: Shipping ──── Step 2: Payment ──── Step 3: Review
   ●━━━━━━━━━━━━━━━━━━━○━━━━━━━━━━━━━━━━━━━○
```

**Step 1 — Shipping Address:**
- If user has saved addresses: show them as selectable cards (radio-style, border highlights on select)
  - Each card: label (Home/Office pill), full name, address text, phone, "Default" badge if applicable
  - "Edit" and "Delete" actions on each card
- "+ Add New Address" button opens inline form or modal:
  - Fields: Label (text), Full Name (text, required), Phone (tel, required, 10 digits), Address Line 1 (text, required), Address Line 2 (text, optional), City (text, required), State (dropdown, required), Pin Code (text, required, 6 digits)
  - "Save as default address" checkbox
  - All fields validate in real-time with React Hook Form + Zod
- "Continue to Payment →" button (disabled until address selected)

**API:** `GET /api/addresses`, `POST /api/addresses`

**Step 2 — Payment Method:**
- Radio card selection:
  - **Razorpay (Card/UPI/Netbanking):** "Pay securely with Razorpay" — card icon + UPI icon. Recommended badge
  - **Cash on Delivery:** "Pay when you receive your order" — cash icon. "+₹49 COD charges" note (or free)
- "Continue to Review →" button

**Step 3 — Order Review:**
- Summary of:
  - Shipping address (with "Change" link back to step 1)
  - Payment method (with "Change" link back to step 2)
  - Order items list (image, name, size, qty, price per item)
  - Price breakdown: Subtotal, Shipping (free if ≥999, else ₹99), Discount (if promo), Total
- "Place Order" button — PRIMARY, large, full-width on mobile
  - On click with Razorpay: opens Razorpay checkout popup, then verifies payment, then shows success
  - On click with COD: creates order directly, shows success
  - Loading state: button shows spinner, disabled
  - On success: redirect to order confirmation page (`/order/:id`) with confetti animation or success illustration

**API:**
- `POST /api/orders` — create order
- `POST /api/payment/create-order` — create Razorpay order
- `POST /api/payment/verify-payment` — verify Razorpay signature
- `GET /api/payment/razorpay-key` — get public key for Razorpay SDK

**Payment Failure Handling:**
- Toast: "Payment failed. Please try again or choose a different payment method."
- Keep user on step 2 with options to retry or switch to COD

---

### 9. USER DASHBOARD (`/dashboard`) — Protected

**Layout:** Left sidebar (280px, white card) + right content area. On mobile: sidebar becomes horizontal scrollable tab bar at top.

**Sidebar:**
- User avatar (64px circle, initials fallback with primary bg) + name + email
- Divider
- Nav items (vertical, icon + label, one active at a time with bg-primary text-white rounded-lg):
  - My Orders (Package icon)
  - Wishlist (Heart icon)
  - Profile Settings (User icon)
  - Addresses (MapPin icon)
  - [Admin only] Manage Products (ShieldCheck icon)
  - Divider
  - Logout (LogOut icon, text-error hover:bg-red-50)

---

**Tab: My Orders**
- Heading: "My Orders"
- **Empty state:** white card, py-16, centered — Package icon (gray-300) + "No Orders Yet" + "Start shopping to see your orders here!" + "Start Shopping →" CTA
- **With orders:** each order is a white card (rounded-lg, p-6, mb-4):
  ```
  Order #A1B2C3D4          Placed on March 12, 2026          [Processing] ← status pill
  ─────────────────────────────────────────────────────────────────────────
  [img] Product Name        Size: M  |  Qty: 2                      ₹1,299
  [img] Product Name        Size: L  |  Qty: 1                        ₹899
  +2 more items (if > 2)
  ─────────────────────────────────────────────────────────────────────────
  Total: ₹3,497             [View Details]  [Track Order]
  ```
- Status pills with colors: Processing (amber), Confirmed (blue), Shipped (blue), In Transit (blue), Delivered (green), Cancelled (red)
- "View Details" → navigates to `/order/:id`
- "Track Order" → navigates to `/track-order?orderId=...`

**API:** `GET /api/orders/my-orders?page={}&limit=10`

---

**Tab: Wishlist**
- Heading: "My Wishlist"
- **Empty state:** Heart icon (gray-300) + "Your Wishlist is Empty" + "Save your favorite items here!" + "Browse Products →"
- **With items:** each product is a horizontal white card (rounded-lg, p-6, mb-4):
  ```
  [Image 100x100 rounded-lg]  |  Product Name (link)         [♥ Remove]
                               |  ★★★★☆ (4.2)
                               |  ₹1,299
                               |  [Add to Cart]  [View Product]
  ```
- "Add to Cart": opens a small size-selector popover (since size is required), then adds to cart
- Remove: heart icon click removes from wishlist (optimistic)

**API:** `GET /api/wishlist`, `DELETE /api/wishlist/:productId`

---

**Tab: Profile Settings**
- Two white cards stacked:

  **Card 1 — Profile Information:**
  - Fields: Full Name (text), Email (disabled, grayed), Phone (tel)
  - "Update Profile" primary button

  **Card 2 — Change Password:**
  - Fields: Current Password, New Password, Confirm New Password
  - Password strength indicator bar (red → orange → green)
  - "Change Password" primary button

**API:** `PUT /api/users/profile`

---

**Tab: Addresses**
- Header row: "Saved Addresses" + "+ Add New Address" button
- **Empty state:** MapPin icon + "No Saved Addresses" + "Add an address for faster checkout!" + "Add Address" CTA
- **With addresses:** each is a white card (rounded-lg, p-6, mb-4):
  ```
  [Home] ← label pill          [Default] ← if isDefault, green pill
  John Doe
  123 Main Street, Apartment 4B
  Mumbai, Maharashtra - 400001
  Phone: +91 9876543210
                                                    [Edit]  [Delete]
  ```
- Edit: opens the same form pre-filled in a modal or inline
- Delete: confirm dialog first
- Add/Edit form: label, fullName, phone, addressLine1, addressLine2, city, state, pinCode, isDefault checkbox

**API:** `GET /api/addresses`, `POST /api/addresses`, `PUT /api/addresses/:id`, `DELETE /api/addresses/:id`

---

### 10. ORDER DETAIL PAGE (`/order/:id`) — Protected

**Layout:** White card, max-w-4xl centered

**Top:** "Order #A1B2C3D4" heading + "Placed on March 12, 2026" + status pill

**Order Tracking Timeline (horizontal on desktop, vertical on mobile):**
```
Processing → Confirmed → Shipped → In Transit → Delivered
    ●━━━━━━━━━━●━━━━━━━━━━●━━━━━━━━━━○━━━━━━━━━━○
```
- Completed steps: filled primary circle + primary connecting line
- Current step: pulsing primary circle
- Future steps: gray circle + gray line

**Shipping Address Card:**
- Full name, address lines, city/state/pin, phone

**Payment Info:**
- Method: Razorpay / COD
- Status: Paid ✓ (green) / Pending (amber) / Failed (red)
- Transaction ID (if Razorpay)

**Order Items Table:**
| Image | Product | Size | Qty | Price |
Each row links to product

**Price Breakdown:**
- Subtotal, Shipping, Discount, **Total** (bold, larger text)

**API:** `GET /api/orders/:id`

---

### 11. TRACK ORDER PAGE (`/track-order`)

- If no orderId in query: show an input field "Enter your Order ID" + "Track" button
- If orderId present: show order tracking timeline (same as order detail) + current status + estimated delivery (static/placeholder)

**API:** `GET /api/orders/:id`

---

### 12. SEARCH OVERLAY

- Triggered by search icon in navbar
- Full-width overlay (or slide-down panel) with:
  - Large input, auto-focused, placeholder "Search for products..."
  - As user types (debounced 300ms): show product suggestions below (max 6)
  - Each suggestion: thumbnail + name + price, clickable → goes to product
  - "See all results for '{query}' →" link at bottom → navigates to `/search?q={query}`
  - "×" close button or Escape key to dismiss

**API:** `GET /api/products?search={query}&limit=6`

---

### 13. AUTHENTICATION PAGES

**Sign In (`/signin`):**
- Centered card (max-w-md) on hero/gradient background
- "Welcome Back" heading + "Sign in to your account" subtext
- Google OAuth button: "Continue with Google" (outlined, full-width, Google icon)
- Divider: "or continue with email"
- Email input + Password input + "Forgot password?" link
- "Sign In" primary button (full-width)
- Bottom: "Don't have an account? Sign Up" link
- Uses Clerk components styled to match design

**Sign Up (`/signup`):**
- Same layout as sign in
- "Create Account" heading
- Google OAuth button
- Divider
- Full Name + Email + Password + Confirm Password
- "Create Account" primary button
- Bottom: "Already have an account? Sign In" link
- After signup: email verification step (OTP input)

**OAuth Callback (`/sso-callback`):**
- Centered spinner + "Signing you in..." text

---

### 14. WISHLIST PAGE (`/wishlist`) — Protected

- Full-page version of the dashboard wishlist tab
- Product grid (2 col mobile, 3 col md, 4 col lg) using ProductCard component with a remove button overlay
- OR horizontal card list matching dashboard style
- Empty state with illustration + CTA

**API:** `GET /api/wishlist`

---

### 15. STATIC PAGES

**Contact Us (`/contact`):**
- Two-column: contact form (name, email, subject, message) + contact info (email, phone, address, social links)
- Map placeholder (static image or embedded map)

**Privacy Policy (`/privacy-policy`):**
- Long-form text content with proper heading hierarchy (H2 sections)
- Table of contents sidebar (sticky) with anchor links

**Help Center (`/help`):**
- FAQ accordion (Radix Accordion) grouped by category: Orders, Shipping, Returns, Payments, Account
- Search bar at top to filter FAQs

**404 Page:**
- Centered: large "404" display text + "Page not found" + "The page you're looking for doesn't exist or has been moved" + "Go Home" CTA + search bar

---

### 16. ADMIN PANEL (`/admin`) — Protected (role: admin)

**Layout:** Dark sidebar (#1E1E1E) on left (260px, fixed) + white content area. Mobile: sidebar collapses, toggle via hamburger.

**Sidebar Nav (white text on dark bg):**
- Urban Thread logo (white)
- Dashboard
- Products
- Users
- Orders
- [Back to Store] link

---

**Dashboard Tab:**
- 4 stat cards in a row (2x2 on mobile):
  - Total Products (Package icon, blue bg)
  - Total Users (Users icon, green bg)
  - Total Orders (ShoppingBag icon, amber bg)
  - Total Revenue (IndianRupee icon, primary bg)
  - Each: icon + number (text-3xl font-bold) + label + % change vs last month
- Sales Chart: Bar chart (Recharts) — revenue by month for last 6 months
- Top Categories: Horizontal bar chart or pie chart — order count by category

**API:** `GET /api/admin/stats`

---

**Products Tab:**
- Header: "Products" + "+ Add Product" button
- Table (white card, rounded-lg, overflow-hidden):
  | Image | Name | Category | Price | Stock | Status | Actions |
  - Image: 48x48 rounded thumbnail
  - Status: "Active" green pill / "Inactive" gray pill
  - Actions: Edit (opens modal/drawer with ProductForm), Delete (confirm dialog)
- Pagination below table
- Search/filter bar above table: text search + category dropdown

**API:** `GET /api/admin/products?page={}&limit=20`, `POST /api/admin/products`, `PUT /api/admin/products/:id`, `DELETE /api/admin/products/:id`

**Product Form (Modal or Drawer):**
- Fields: Name, Description (textarea), Price, Original Price, Category (select: men/women/kids/accessories), SKU, Stock, Sizes (multi-select pills), Features (dynamic list — add/remove items)
- Image Upload: drag-and-drop zone + click to browse. Shows thumbnails of uploaded images. Max 10 images. Reorderable (drag to reorder). Delete button on each
- "Save Product" / "Update Product" primary button

**API:** `POST /api/upload/multiple`, `DELETE /api/upload/:fileId`

---

**Users Tab:**
- Table:
  | Avatar | Name | Email | Role | Status | Orders | Actions |
  - Role: dropdown to change (customer/seller/admin)
  - Status: toggle switch (active/inactive)
  - Actions: Delete (with confirm)
- Pagination + search

**API:** `GET /api/admin/users`, `PUT /api/admin/users/:id/role`, `PUT /api/admin/users/:id/status`, `DELETE /api/admin/users/:id`

---

**Orders Tab:**
- Table:
  | Order ID | Customer | Items | Total | Payment | Status | Date | Actions |
  - Payment: "Paid" green / "Pending" amber / "Failed" red
  - Status: dropdown to update (Processing → Confirmed → Shipped → In Transit → Delivered → Cancelled)
  - Actions: View (opens order detail modal), Delete
- Pagination + status filter dropdown

**API:** `GET /api/admin/orders`, `PUT /api/admin/orders/:id/status`, `DELETE /api/admin/orders/:id`

---

### 17. SELLER CENTER (`/seller`) — Protected (role: seller)

**Layout:** Same dark sidebar pattern as admin

**Sidebar Nav:**
- Dashboard
- Add Product
- My Listings
- Sales
- [Back to Store]

**Dashboard Tab:**
- 4 stat cards: My Products, Total Sales, Revenue, Average Rating
- Top performing products list (top 5)
- Recent orders table

**Add Product Tab:**
- Same ProductForm as admin

**My Listings Tab:**
- Table of seller's own products only (filtered by sellerId)
- Edit/Delete actions

**Sales Tab:**
- Revenue summary card
- Recent orders table (seller's products only)

**API:** Uses same product/order endpoints — backend filters by seller ownership

---

## Global Patterns & Reusable Components

### Loading States
- **Skeleton loaders** for all content areas:
  - Product card skeleton: gray animated pulse rectangles mimicking image + text
  - Table row skeleton: horizontal pulse bars
  - Dashboard stat skeleton: pulse rectangles
- **Button spinners:** 16px white spinner inside button, text stays but fades to 50%
- **Page transitions:** Wrapper component that fades children in on mount (opacity 0→1, 200ms)

### Toast Notifications (Sonner)
- **Success:** green left-border, checkmark icon — "Added to cart!", "Order placed!", "Profile updated!"
- **Error:** red left-border, X icon — "Failed to add item", "Payment failed"
- **Info:** blue left-border, info icon — "Item already in wishlist"
- Position: bottom-right on desktop, bottom-center on mobile
- Auto-dismiss: 4 seconds, pausable on hover

### Empty States Pattern
Every empty list/state follows:
```
┌─────────────────────────────────────┐
│                                     │
│        [Relevant Icon 64px]         │
│        gray-300 color               │
│                                     │
│        Heading (font-semibold)      │
│        Body text (text-secondary)   │
│                                     │
│        [Primary CTA Button]         │
│                                     │
└─────────────────────────────────────┘
```
White card, rounded-lg, py-16 px-8, text-center. Box grows with content — no fixed heights.

### Confirm Dialog (Radix AlertDialog)
- Used for all destructive actions
- Centered modal with backdrop blur
- Title + description + "Cancel" (secondary) + "Confirm" (destructive red) buttons

### Image Handling
- All product images use lazy loading (loading="lazy")
- Fallback placeholder image on error (/placeholder.png — a gray box with image icon)
- ImageWithFallback component wraps all <img> tags

---

## Database ↔ Frontend Field Mapping Reference

### Product
| DB Field       | Display                           |
|----------------|-----------------------------------|
| name           | Product title                     |
| description    | Product detail body text          |
| price          | Current price (₹ formatted)       |
| originalPrice  | Strikethrough price (if > price)  |
| category       | Category badge/filter             |
| sizes[]        | Size selector pills               |
| images[]       | Image gallery (first = thumbnail) |
| features[]     | Bullet list on PDP                |
| sku            | Admin table only                  |
| stock          | Stock indicator on PDP            |
| sold           | Admin dashboard                   |
| rating         | Star display (★★★★☆)             |
| numReviews     | "(128 reviews)" text              |
| isActive       | Active/Inactive badge (admin)     |
| seller.name    | "Sold by {name}" on PDP           |

### Order Status → Visual
| Status      | Color           | Icon        |
|-------------|-----------------|-------------|
| Processing  | amber/yellow    | Clock       |
| Confirmed   | blue            | CheckCircle |
| Shipped     | blue            | Truck       |
| InTransit   | blue            | Navigation  |
| Delivered   | green           | PackageCheck|
| Cancelled   | red             | XCircle     |

### Payment Status → Visual
| Status  | Color  | Text          |
|---------|--------|---------------|
| pending | amber  | Pending       |
| paid    | green  | Paid ✓        |
| failed  | red    | Payment Failed|

---

## Responsive Breakpoint Behavior Summary

| Element             | Mobile (<640)      | Tablet (640-1024)  | Desktop (1024+)     |
|---------------------|--------------------|--------------------|---------------------|
| Navbar              | Hamburger + logo   | Full nav           | Full nav + mega     |
| Product grid        | 2 columns          | 3 columns          | 4 columns           |
| Filters             | Bottom sheet       | Sidebar            | Sidebar             |
| Cart layout         | Stacked            | Stacked            | Side-by-side        |
| Checkout steps      | Stacked            | Stacked            | Side-by-side        |
| Dashboard sidebar   | Horizontal tabs    | Sidebar            | Sidebar             |
| Admin sidebar       | Hamburger drawer   | Mini sidebar       | Full sidebar        |
| Footer              | Stacked columns    | 2x2 grid           | 4 columns           |

---

## Performance Targets

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Bundle size: < 200KB gzipped (code-split routes)
- Images: WebP format, responsive sizes, lazy-loaded
- Route-based code splitting: React.lazy() for admin, seller, checkout pages
