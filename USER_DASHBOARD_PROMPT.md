# Urban Thread — User Dashboard, Profile & Settings — Detailed Frontend Prompt

> This prompt covers the entire `/dashboard` protected route: sidebar, orders, wishlist, profile settings, addresses, and admin shortcut. It is designed to be handed to an AI or developer to build pixel-perfect, production-ready React + Tailwind components that connect to the existing backend APIs.

---

## Global Design Tokens (reference)

```
Colors:
  primary:        #FF3B30     CTAs, active nav, badges
  primary-hover:  #E63529     Button hover
  secondary:      #1E1E1E     Text, dark elements
  accent:         #007AFF     Links, info states
  bg-page:        #FAFAFA     Page background
  bg-card:        #FFFFFF     Cards, modals
  border:         #E5E7EB     Default borders (gray-200)
  border-hover:   #D1D5DB     Hover borders (gray-300)
  text-primary:   #1E1E1E     Headings
  text-secondary: #6B7280     Body text (gray-500)
  text-tertiary:  #9CA3AF     Captions (gray-400)
  text-disabled:  #D1D5DB     Disabled text (gray-300)
  success:        #22C55E     Delivered, success
  warning:        #F59E0B     Processing, amber
  error:          #EF4444     Failed, destructive
  info:           #3B82F6     In-transit, info

Typography:
  font-family:    "Inter", system-ui, -apple-system, sans-serif
  weights:        400 (body), 500 (medium), 600 (semibold), 700 (bold)

Radius:
  sm:   8px    (buttons, inputs, badges)
  md:   12px   (cards, dropdowns)
  lg:   16px   (modals, large containers)
  full: 9999px (pills, avatars)

Shadows:
  sm:   0 1px 2px rgba(0,0,0,0.05)
  md:   0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)
  lg:   0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)

Spacing:  8px grid (p-1=4px, p-2=8px, p-3=12px, p-4=16px, p-6=24px, p-8=32px)
Transitions: 150ms ease-out (default), 300ms ease-out (slow)
```

---

## Page: User Dashboard (`/dashboard`)

**Route:** `/dashboard` — Protected (must be authenticated)
**Component:** `UserDashboard.tsx`
**Page background:** `bg-[#FAFAFA] min-h-screen`

---

## 1. OVERALL LAYOUT

```
┌─────────────────────────────────────────────────────────────────┐
│  bg-[#FAFAFA] min-h-screen py-10                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8                  │  │
│  │                                                           │  │
│  │  ┌──────────┐  ┌──────────────────────────────────────┐   │  │
│  │  │ SIDEBAR  │  │          CONTENT AREA                │   │  │
│  │  │ (280px)  │  │          (flex-1)                    │   │  │
│  │  │          │  │                                      │   │  │
│  │  │ lg:col-1 │  │          lg:col-span-3               │   │  │
│  │  │          │  │                                      │   │  │
│  │  └──────────┘  └──────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Desktop (lg+):** `grid grid-cols-1 lg:grid-cols-4 gap-8`
- Sidebar: `lg:col-span-1`
- Content: `lg:col-span-3`

**Mobile (<lg):** Sidebar becomes a horizontal scrollable pill-tab bar at the top, content stacks below.

```
Mobile layout:
┌──────────────────────────────────────────┐
│  [Orders] [Wishlist] [Profile] [Address] │  ← horizontal scroll, overflow-x-auto
├──────────────────────────────────────────┤
│                                          │
│            CONTENT AREA                  │
│                                          │
└──────────────────────────────────────────┘
```

- Tab pills: `flex gap-2 overflow-x-auto pb-4 scrollbar-hide`
- Each pill: `whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all`
- Active: `bg-primary text-white`
- Inactive: `bg-white text-secondary border border-border`

---

## 2. SIDEBAR (Desktop)

**Container:** `bg-white rounded-2xl shadow-sm p-6 sticky top-24` (sticks below navbar)

### 2A. User Profile Header
```
┌────────────────────────────────┐
│  [Avatar 56px]  Name           │
│                 email@...      │
│                 "customer"     │  ← role badge, only if seller/admin
├────────────────────────────────┤
│         ← border-b →          │
```

- **Avatar:** 56x56px circle. If `user.avatar` exists → `<img>` with `object-cover rounded-full`. If not → initials fallback: `bg-primary rounded-full flex items-center justify-center`, first letter of name in white, `text-xl font-semibold`
- **Name:** `text-sm font-semibold text-primary truncate`
- **Email:** `text-xs text-tertiary truncate`
- **Role badge** (only for seller/admin): `text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700` for seller, `bg-red-100 text-red-700` for admin
- Bottom: `border-b border-border pb-5 mb-4`

### 2B. Navigation Items
Vertical list, `space-y-1`:

| Icon | Label | Tab Key |
|------|-------|---------|
| Package | My Orders | `orders` |
| Heart | Wishlist | `wishlist` |
| User | Profile | `profile` |
| MapPin | Addresses | `addresses` |
| --- divider (admin only) --- | | |
| ShieldCheck | Manage Products | `admin-products` |
| --- divider --- | | |
| LogOut | Sign Out | (action) |

**Each nav button:**
```tsx
<button className={`
  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
  transition-all duration-150
  ${isActive
    ? 'bg-primary text-white shadow-sm'
    : 'text-secondary hover:bg-gray-50 hover:text-primary'
  }
`}>
  <Icon className="w-[18px] h-[18px]" />
  <span>{label}</span>
  {/* Optional: count badge for orders/wishlist */}
  {count > 0 && (
    <span className="ml-auto text-xs bg-gray-100 text-tertiary px-2 py-0.5 rounded-full">
      {count}
    </span>
  )}
</button>
```

- Active state: `bg-primary text-white shadow-sm`
- Hover state: `hover:bg-gray-50 hover:text-primary`
- Icon size: 18px (w-[18px] h-[18px])
- Divider before admin section: `<div className="border-t border-border my-3" />`
- Divider before logout: same
- **Logout button:** `text-error hover:bg-red-50` — no active state, always red text

### 2C. Sidebar Bottom — Quick Stats (optional enhancement)
Below the nav, a subtle stats row:
```
┌────────────────────────────────┐
│  Member since March 2026       │  ← text-xs text-tertiary
└────────────────────────────────┘
```

---

## 3. CONTENT AREA — Tab: My Orders (`orders`)

### 3A. Header Row
```
My Orders                                    Sort: [Newest ▼]
```
- Heading: `text-xl font-semibold text-primary`
- NO "uppercase" — use sentence case for readability (Simplicity principle)
- Optional sort dropdown: Newest, Oldest — `text-sm text-secondary`

### 3B. Loading State (Skeleton)
Show 3 skeleton order cards:
```
┌──────────────────────────────────────────────────────────────┐
│  ░░░░░░░░░░░░░░░  (order ID)              ░░░░░░ (status)   │
│  ░░░░░░░░░░ (date)                                           │
│  ┌──────┐  ░░░░░░░░░░░░░░░░░░░░                             │
│  │ ░░░░ │  ░░░░░░░░░░░                                      │
│  └──────┘                                                    │
│  ─────────────────────────────────────────────────           │
│  ░░░░░░░░                          ░░░░░░  ░░░░░░           │
└──────────────────────────────────────────────────────────────┘
```
- Use `animate-pulse` on gray `bg-gray-200 rounded` rectangles
- 3 cards with `space-y-4`

### 3C. Empty State
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                   [Package icon, 56px, gray-300]             │
│                                                              │
│                      No orders yet                           │  ← text-lg font-semibold text-primary
│              Start shopping to see your orders here           │  ← text-sm text-secondary, max-w-xs mx-auto
│                                                              │
│                     [Start Shopping →]                        │  ← Primary button
│                                                              │
└──────────────────────────────────────────────────────────────┘
```
- Container: `bg-white rounded-2xl py-16 px-8 shadow-sm text-center`
- Grows with content — NO fixed min-height
- CTA: `Link to="/products/all"`, Primary button style

### 3D. Order Cards (with data)
Each order is a white card: `bg-white rounded-2xl p-6 shadow-sm mb-4 hover:shadow-md transition-shadow`

```
┌──────────────────────────────────────────────────────────────────┐
│  Order #A1B2C3D4                              [Processing]       │
│  Placed on 12 March 2026 · 3 items                               │
│                                                                  │
│  ┌──────┐  Product Name                                  ₹1,299 │
│  │ img  │  Size: M · Qty: 2                                     │
│  └──────┘                                                        │
│  ┌──────┐  Product Name                                    ₹899 │
│  │ img  │  Size: L · Qty: 1                                     │
│  └──────┘                                                        │
│  +2 more items                                                   │
│  ────────────────────────────────────────────────────────────── │
│  Total ₹3,497                      [View Details] [Track Order] │
└──────────────────────────────────────────────────────────────────┘
```

**Order ID:** `text-sm font-semibold text-primary` — show last 8 chars uppercase
**Date:** `text-xs text-secondary` — format: `12 March 2026`
**Item count:** `text-xs text-tertiary` — inline with date after `·` separator

**Status Badge:**
| Status | Classes |
|--------|---------|
| Processing | `bg-amber-50 text-amber-600 border border-amber-200` |
| Confirmed | `bg-blue-50 text-blue-600 border border-blue-200` |
| Shipped | `bg-blue-50 text-blue-600 border border-blue-200` |
| InTransit | `bg-indigo-50 text-indigo-600 border border-indigo-200` — display as "In Transit" |
| Delivered | `bg-emerald-50 text-emerald-600 border border-emerald-200` |
| Cancelled | `bg-red-50 text-red-600 border border-red-200` |

Badge: `px-3 py-1 rounded-full text-xs font-medium`

**Order Items (show first 2):**
- Product image: `w-14 h-14 rounded-lg object-cover bg-gray-100`
- Product name: `text-sm font-medium text-primary line-clamp-1`
- Size/Qty: `text-xs text-secondary`
- Price: `text-sm font-semibold text-primary`
- If > 2 items: `+{n} more items` in `text-xs text-tertiary`

**Footer (below border-t):**
- Left: `Total` label (`text-xs text-secondary`) + amount (`text-lg font-bold text-primary`)
- Right: two buttons:
  - "View Details" → Secondary button (outlined): `px-4 py-2 text-sm font-medium border border-border rounded-lg text-secondary hover:border-primary hover:text-primary transition-all`
  - "Track Order" → Ghost primary: `px-4 py-2 text-sm font-medium text-primary hover:bg-red-50 rounded-lg transition-all`

**API:** `GET /api/orders/my-orders?page={page}&limit=10`
**Pagination:** "Load More" button at bottom (if more pages), or numbered pagination

---

## 4. CONTENT AREA — Tab: Wishlist (`wishlist`)

### 4A. Header Row
```
My Wishlist                                  {count} items
```

### 4B. Loading State
3 skeleton cards using the same horizontal card shape with `animate-pulse`

### 4C. Empty State
Same pattern as orders but with:
- Icon: `Heart` (56px, gray-300)
- Title: "Your wishlist is empty"
- Body: "Save items you love and come back to them anytime"
- CTA: "Browse Products →" linking to `/products/all`

### 4D. Wishlist Items (with data)
Each item is a horizontal card: `bg-white rounded-2xl p-6 shadow-sm mb-4 hover:shadow-md transition-shadow`

```
┌──────────────────────────────────────────────────────────────────┐
│  ┌──────────┐   Product Name                          [♥ remove]│
│  │          │   ★★★★☆ (4.2)                                     │
│  │  image   │   ₹1,299  ₹1,999                                  │
│  │  96x96   │                                                    │
│  │          │   [Add to Cart]  [View Product]                    │
│  └──────────┘                                                    │
└──────────────────────────────────────────────────────────────────┘
```

- **Image:** `w-24 h-24 rounded-xl object-cover bg-gray-100 shrink-0`
- **Product name:** `text-sm font-semibold text-primary hover:text-primary/80 transition-colors` — links to `/product/:id`
- **Rating:** 5 star icons (`w-3.5 h-3.5`), filled stars in `fill-amber-400 text-amber-400`, empty in `text-gray-200`. Count: `text-xs text-tertiary ml-1.5`
- **Price:** Current: `text-base font-bold text-primary`. Original (if > price): `text-sm text-tertiary line-through ml-2`
- **Remove heart:** `p-2 rounded-lg hover:bg-red-50 transition-colors` — `Heart` icon `w-5 h-5 fill-primary text-primary`. On click: optimistic remove with undo toast
- **Add to Cart button:** Primary small: `px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors`
  - On click: should show a size-selector popover/dropdown first (since size is required by `POST /api/cart`), then add to cart
  - If product has only 1 size: skip popover, add directly
- **View Product:** Secondary small: `px-4 py-2 text-sm font-medium border border-border text-secondary rounded-lg hover:border-primary hover:text-primary transition-all`

**Responsive (mobile):**
- Image shrinks to `w-20 h-20`
- Buttons stack vertically or use smaller text
- Layout stays horizontal (flex-row) — do NOT switch to vertical card grid

**API:**
- Load: `GET /api/wishlist` → returns `{ items: [{ userId, productId, product: {...} }] }`
- Remove: `DELETE /api/wishlist/:productId`
- Add to cart: `POST /api/cart` → `{ productId, quantity: 1, size }`

---

## 5. CONTENT AREA — Tab: Profile Settings (`profile`)

### 5A. Layout
Two stacked white cards with `space-y-6` gap:
1. Profile Information card
2. Change Password card

---

### 5B. Card 1 — Profile Information

Container: `bg-white rounded-2xl p-8 shadow-sm`

**Header section (inside the card, at the top):**
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   ┌──────────┐                                               │
│   │  Avatar  │   Upload new photo                            │
│   │  80x80   │   [Change Photo]  [Remove]                    │
│   └──────────┘   JPG, PNG. Max 2MB                           │
│                                                              │
│  ──────────────────────────────────────────────────────────  │
│                                                              │
│  Full Name                                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  John Doe                                              │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  Email                                                       │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  john@example.com                          🔒 locked   │  │
│  └────────────────────────────────────────────────────────┘  │
│  Managed by your sign-in provider                            │
│                                                              │
│  Phone                                                       │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  +91 9876543210                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│                                         [Save Changes]       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Avatar Upload Section:**
- Avatar: `w-20 h-20 rounded-full object-cover border-2 border-border` (or initials fallback)
- "Change Photo" button: Secondary small — triggers hidden file input (`accept="image/jpeg,image/png"`)
- "Remove" link: `text-sm text-error hover:underline` (sets avatar to "")
- Hint: `text-xs text-tertiary` — "JPG or PNG. Max 2MB."
- On file select: immediately upload via `POST /api/upload` with `folder: "/avatars"`, then update profile with returned URL via `PUT /api/users/profile`
- Show a small spinner overlay on the avatar during upload
- **API:** `POST /api/upload` → `{ file: base64, folder: "/avatars" }` → returns `{ url }` → then `PUT /api/users/profile` → `{ avatar: url }`

**Form Fields:**

| Field | Type | Validation | Constraints | Notes |
|-------|------|-----------|-------------|-------|
| Full Name | text | Required, 2-100 chars | `min(2).max(100)` | Real-time inline error |
| Email | email | Disabled | — | `bg-gray-50 cursor-not-allowed text-tertiary`, lock icon suffix, helper text: "Managed by your sign-in provider" |
| Phone | tel | Optional, max 20 chars | `max(20)`, digits only on input | Placeholder: "+91 98765 43210", format hint |

**Input Style (all inputs in the dashboard):**
```
w-full px-4 py-3 text-sm rounded-lg border border-border
bg-white text-primary placeholder:text-tertiary
focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
transition-all duration-150
```

**Disabled Input:**
```
bg-gray-50 cursor-not-allowed text-tertiary border-border
```

**Input Error State:**
```
border-error focus:ring-error/20 focus:border-error
```
+ Error message below: `text-xs text-error mt-1`

**Label Style:**
```
text-sm font-medium text-primary mb-1.5 block
```

**Save Button:**
- Right-aligned (or left-aligned — pick one, be consistent)
- Primary button: `px-6 py-2.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-hover transition-all shadow-sm`
- **Loading state:** button shows spinner + "Saving..." text, disabled
- **Success state:** button briefly shows "Saved ✓" with `bg-success` for 2 seconds, then reverts
- **Error state:** toast notification via Sonner: "Failed to update profile. Please try again."
- Only enable button when form is dirty (values differ from original)

**API:** `PUT /api/users/profile` → `{ name, phone, avatar }`

---

### 5C. Card 2 — Change Password

Container: `bg-white rounded-2xl p-8 shadow-sm`

> **Note:** Since auth is managed by Clerk, password change goes through Clerk's API, not a custom backend endpoint. If the user signed up via Google OAuth, this section should display a message instead of the form.

**Google OAuth User:**
```
┌──────────────────────────────────────────────────────────────┐
│  Change Password                                             │
│  ────────────────────────────────────────────────────────── │
│                                                              │
│  🔗 You signed in with Google                                │
│  Password is managed by your Google account.                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Email/Password User:**
```
┌──────────────────────────────────────────────────────────────┐
│  Change Password                                             │
│  ────────────────────────────────────────────────────────── │
│                                                              │
│  Current Password                                            │
│  ┌────────────────────────────────────────────────── [👁]──┐ │
│  │  ••••••••                                               │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  New Password                                                │
│  ┌────────────────────────────────────────────────── [👁]──┐ │
│  │  ••••••••                                               │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ░░░░░░░░░░░░░░░░░░░░ Strength: Strong                      │  ← password strength bar
│                                                              │
│  Confirm New Password                                        │
│  ┌────────────────────────────────────────────────── [👁]──┐ │
│  │  ••••••••                                               │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│                                    [Update Password]         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Password Fields:**
- Each has a show/hide toggle (Eye / EyeOff icon) at the right end of the input
- Toggle: `absolute right-3 top-1/2 -translate-y-1/2 p-1 text-tertiary hover:text-secondary cursor-pointer`
- Input wrapper: `relative`

**Password Strength Bar:**
- Appears below "New Password" input
- 4-segment bar: `h-1 rounded-full` segments with `gap-1`
- Strength levels:
  - **Weak** (< 6 chars): 1 segment filled `bg-error`
  - **Fair** (6+ chars, one type): 2 segments filled `bg-amber-400`
  - **Good** (8+ chars, two types): 3 segments filled `bg-amber-400`
  - **Strong** (8+ chars, 3+ types): 4 segments filled `bg-success`
- Label: `text-xs mt-1` — "Weak" / "Fair" / "Good" / "Strong" in matching color

**Validation:**
- Current password: required
- New password: required, min 8 chars
- Confirm password: must match new password — error: "Passwords don't match"
- All validated in real-time (onChange)

**Button Behavior:** Same pattern as profile save — loading spinner, success flash, error toast.

---

## 6. CONTENT AREA — Tab: Addresses (`addresses`)

### 6A. Header Row
```
Saved Addresses                              [+ Add New Address]
```
- Heading: `text-xl font-semibold text-primary`
- Button: Primary with Plus icon: `flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-hover transition-all shadow-sm`

### 6B. Loading State
2 skeleton address cards with `animate-pulse`

### 6C. Empty State
Same container pattern:
- Icon: `MapPin` (56px, gray-300)
- Title: "No saved addresses"
- Body: "Add an address for faster checkout"
- CTA: "Add Your First Address" — primary button, triggers form

### 6D. Address Cards (with data)
Each address: `bg-white rounded-2xl p-6 shadow-sm mb-4 hover:shadow-md transition-shadow`

```
┌──────────────────────────────────────────────────────────────────┐
│  [🏠 Home]  [Default ✓]                          [Edit] [Delete]│
│                                                                  │
│  John Doe                                                        │
│  123 Main Street, Apartment 4B                                   │
│  Street Name, Near Landmark                                      │
│  Mumbai, Maharashtra — 400001                                    │
│  +91 98765 43210                                                 │
└──────────────────────────────────────────────────────────────────┘
```

- **Label pill:** `text-xs font-medium uppercase tracking-wide px-2.5 py-1 rounded-full bg-gray-100 text-secondary` — shows address.label (Home, Office, etc.)
- **Default badge** (if isDefault): `text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200` — "Default ✓"
- **Full name:** `text-sm font-semibold text-primary mt-3`
- **Address lines:** `text-sm text-secondary leading-relaxed`
- **City/State/Pin:** `text-sm text-secondary`
- **Phone:** `text-sm text-secondary`
- **Edit button:** Ghost icon button: `p-2 rounded-lg text-secondary hover:text-primary hover:bg-gray-50 transition-all` with `Edit` icon (Pencil)
- **Delete button:** Ghost icon button: `p-2 rounded-lg text-secondary hover:text-error hover:bg-red-50 transition-all` with `Trash2` icon
  - On click: show confirm dialog (Radix AlertDialog):
    - Title: "Delete address"
    - Body: "Are you sure you want to delete this address? This action cannot be undone."
    - Cancel: Secondary button
    - Confirm: `bg-error text-white hover:bg-red-600` — "Delete"

**API:**
- Load: `GET /api/addresses` → `{ addresses: [...] }`
- Delete: `DELETE /api/addresses/:id`

### 6E. Address Form (Add / Edit)

**Trigger:** Clicking "Add New Address" or "Edit" on an existing card.
**Display:** Opens as a slide-down section above the address list (NOT a modal — inline form), or as a Radix Dialog/Sheet on mobile.

Container: `bg-white rounded-2xl p-8 shadow-sm mb-6 border-2 border-primary/10`

```
┌──────────────────────────────────────────────────────────────────┐
│  Add New Address  (or "Edit Address")                    [✕]     │
│  ────────────────────────────────────────────────────────────── │
│                                                                  │
│  Address Label                                                   │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  Home                                                    │    │
│  └──────────────────────────────────────────────────────────┘    │
│  ☐ Set as default address                                        │
│                                                                  │
│  ┌─────────── 50% ───────────┐  ┌─────────── 50% ───────────┐   │
│  │  Full Name *              │  │  Phone Number *            │   │
│  │  ┌─────────────────────┐  │  │  ┌─────────────────────┐  │   │
│  │  │ John Doe            │  │  │  │ +91 9876543210      │  │   │
│  │  └─────────────────────┘  │  │  └─────────────────────┘  │   │
│  └───────────────────────────┘  └───────────────────────────┘   │
│                                                                  │
│  Address Line 1 *                                                │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  House/Flat No., Building Name                           │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Address Line 2                                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  Street, Area, Landmark (optional)                       │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌───── 33% ─────┐  ┌───── 33% ─────┐  ┌───── 33% ─────┐      │
│  │  City *        │  │  State *       │  │  PIN Code *    │      │
│  │  ┌──────────┐  │  │  ┌──────────┐  │  │  ┌──────────┐ │      │
│  │  │ Mumbai   │  │  │  │ Select ▾ │  │  │  │ 400001   │ │      │
│  │  └──────────┘  │  │  └──────────┘  │  │  └──────────┘ │      │
│  └────────────────┘  └────────────────┘  └───────────────┘      │
│                                                                  │
│                              [Cancel]    [Save Address]          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Form Fields (matching backend validation):**

| Field | Type | Required | Validation | Placeholder |
|-------|------|----------|-----------|-------------|
| label | text | Yes | 1-50 chars | "Home" |
| isDefault | checkbox | No | boolean | "Set as default address" |
| fullName | text | Yes | 1-100 chars | "John Doe" |
| phone | tel | Yes | 6-20 chars, digits only | "+91 98765 43210" |
| addressLine1 | text | Yes | 1-255 chars | "House/Flat No., Building Name" |
| addressLine2 | text | No | 0-255 chars | "Street, Area, Landmark (optional)" |
| city | text | Yes | 1-100 chars | "Mumbai" |
| state | select | Yes | 1-100 chars | Indian states dropdown |
| pinCode | text | Yes | 4-10 chars, digits only | "400001" |

**State Dropdown:** Use Radix Select with all Indian states pre-populated:
```
Andhra Pradesh, Arunachal Pradesh, Assam, Bihar, Chhattisgarh,
Goa, Gujarat, Haryana, Himachal Pradesh, Jharkhand, Karnataka,
Kerala, Madhya Pradesh, Maharashtra, Manipur, Meghalaya, Mizoram,
Nagaland, Odisha, Punjab, Rajasthan, Sikkim, Tamil Nadu, Telangana,
Tripura, Uttar Pradesh, Uttarakhand, West Bengal,
Delhi, Chandigarh, Puducherry, Jammu & Kashmir, Ladakh
```

**PIN Code field:**
- Input type text (not number — to preserve leading zeros)
- `inputMode="numeric"` for mobile numeric keyboard
- `maxLength={6}` for India
- Validate: exactly 6 digits with regex `/^\d{6}$/`

**Phone field:**
- `inputMode="tel"`
- Allow `+`, digits, spaces
- Strip non-digit characters before sending to API

**Default checkbox:**
```tsx
<label className="flex items-center gap-2 cursor-pointer">
  <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
  <span className="text-sm text-secondary">Set as default address</span>
</label>
```

**Buttons:**
- "Cancel": Secondary — resets form and hides it
- "Save Address" / "Update Address": Primary — submit
- Both: `px-6 py-2.5 text-sm font-medium rounded-lg`
- Save button: disabled until form is valid, shows spinner during API call

**API:**
- Create: `POST /api/addresses` → `{ label, fullName, phone, addressLine1, addressLine2?, city, state, pinCode, isDefault? }`
- Update: `PUT /api/addresses/:id` → same body (partial)

**After successful save:**
1. Hide form
2. Show success toast: "Address saved" / "Address updated"
3. Reload address list
4. Scroll to the new/updated address

---

## 7. CONTENT AREA — Tab: Admin Products (`admin-products`)

Only visible if `user.role === 'admin'`.

If user is NOT admin (edge case, shouldn't happen since nav item is hidden):
```
┌──────────────────────────────────────────────────────────────┐
│  [ShieldCheck icon, 56px, gray-300]                          │
│  Not authorized                                              │
│  You don't have permission to access this section            │
└──────────────────────────────────────────────────────────────┘
```

If admin: render `<AdminProductsTab />` component (separate component, not specified in this prompt).

---

## 8. TOAST NOTIFICATIONS (used across all tabs)

Use **Sonner** library. Configuration:

```tsx
<Toaster
  position="bottom-right"
  toastOptions={{
    style: { fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' },
    duration: 4000,
  }}
/>
```

**Toast patterns used in dashboard:**

| Action | Type | Message |
|--------|------|---------|
| Profile updated | success | "Profile updated successfully" |
| Profile update failed | error | "Failed to update profile. Please try again." |
| Password changed | success | "Password changed successfully" |
| Password change failed | error | error.message or "Failed to change password" |
| Address saved | success | "Address saved successfully" |
| Address updated | success | "Address updated" |
| Address deleted | success | "Address deleted" |
| Delete address failed | error | "Failed to delete address" |
| Wishlist item removed | success | "Removed from wishlist" with [Undo] action |
| Added to cart | success | "Added to cart" with [View Cart →] action link |
| Add to cart failed | error | "Failed to add to cart" |

**Replace ALL `alert()` calls** with Sonner `toast.success()` / `toast.error()`.
**Replace ALL `confirm()` calls** with Radix AlertDialog component.

---

## 9. RESPONSIVE BEHAVIOR SUMMARY

| Element | Mobile (<640px) | Tablet (640-1024px) | Desktop (1024px+) |
|---------|----------------|--------------------|--------------------|
| Sidebar | Hidden — horizontal pill tabs at top | Sidebar visible (narrower) | Full sidebar, sticky |
| Avatar section | Smaller (48px), stacked | Standard (56px) | Standard (56px) |
| Order cards | Compact, buttons stack | Standard | Standard |
| Wishlist items | Image 80px, buttons stack | Image 96px, buttons inline | Image 96px, buttons inline |
| Profile form | Single column inputs | Two-column where noted | Two-column where noted |
| Address form | Single column all fields | 2-col name/phone, 3-col city/state/pin | Same as tablet |
| Address cards | Buttons below content, full-width | Buttons top-right | Buttons top-right |
| Heading text | text-lg | text-xl | text-xl |

---

## 10. ACCESSIBILITY REQUIREMENTS

1. **Focus management:** When switching tabs, focus moves to the content heading (use `tabIndex={-1}` + `ref.focus()`)
2. **Tab navigation:** All interactive elements reachable via Tab key. Logical tab order within forms
3. **ARIA labels:**
   - Sidebar nav: `<nav aria-label="Dashboard navigation">`
   - Each tab button: `aria-selected={isActive}`, `role="tab"`
   - Content panels: `role="tabpanel"`, `aria-labelledby={tabButtonId}`
   - Icon-only buttons: `aria-label="Edit address"`, `aria-label="Delete address"`, `aria-label="Remove from wishlist"`
   - Avatar upload: `aria-label="Change profile photo"`
4. **Form labels:** Every input has a visible `<label>` with `htmlFor` matching input `id` — NOT just placeholder text
5. **Error announcements:** Use `aria-live="polite"` on error message containers so screen readers announce validation errors
6. **Confirm dialogs:** Focus trapped inside dialog, Escape key closes, focus returns to trigger button on close (Radix AlertDialog handles this automatically)
7. **Color contrast:** All text meets 4.5:1 ratio. Status badges use borders + background (not color alone) for distinction
8. **Touch targets:** All buttons minimum 44x44px on mobile (use min-h-[44px] min-w-[44px] if needed)

---

## 11. STATE MANAGEMENT

**Contexts consumed:**
- `useAuth()` → `{ user, logout, refreshUser }`
- `useWishlist()` → `{ wishlist, refreshWishlist, toggleWishlist }`
- `useCart()` → `{ addToCart }`

**Local state:**
```typescript
const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile' | 'addresses' | 'admin-products'>('orders');
const [orders, setOrders] = useState<Order[]>([]);
const [addresses, setAddresses] = useState<Address[]>([]);
const [loading, setLoading] = useState(true);
const [showAddressForm, setShowAddressForm] = useState(false);
const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
```

**Data loading:** Each tab loads its data on activation (`useEffect` on `activeTab`). Show skeleton during load, NOT a spinner-only screen.

**Optimistic updates:**
- Wishlist remove: instantly remove from UI, rollback on error
- Address delete: instantly remove from UI, rollback on error

---

## 12. ANIMATION SPECIFICATIONS

All animations use **Motion** (Framer Motion):

| Element | Animation | Duration |
|---------|-----------|----------|
| Tab content | Fade in + slide up 8px | 200ms ease-out |
| Card appear (list) | Stagger fade in, 50ms delay between cards | 150ms each |
| Form expand (address) | Height auto-animate, opacity 0→1 | 250ms ease-out |
| Form collapse | Height to 0, opacity 1→0 | 200ms ease-in |
| Status badge | Subtle scale 0.95→1 on mount | 150ms spring |
| Button loading state | Smooth opacity transition on text swap | 150ms |
| Toast enter | Slide up from bottom-right | 300ms spring |

Use `motion.div` with `initial`, `animate`, `exit` and `AnimatePresence` for tab switching.

---

## 13. ERROR BOUNDARIES

Wrap the entire dashboard in an error boundary that shows:
```
┌──────────────────────────────────────────────────────────────┐
│  Something went wrong                                        │
│  We couldn't load your dashboard. Please try again.          │
│  [Refresh Page]                                              │
└──────────────────────────────────────────────────────────────┘
```

Individual tab data-fetch failures should NOT crash the whole page — show an inline error with "Try Again" button within that tab only.
