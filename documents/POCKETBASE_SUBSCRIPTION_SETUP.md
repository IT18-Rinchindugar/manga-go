# PocketBase Subscription Collections Setup

This guide will help you set up the subscription collections in PocketBase.

## Collections to Create

### 1. subscription_plans Collection

Create a new collection named `subscription_plans`:

**Fields:**
- `name` (Text, Required) - Plan name (e.g., "Monthly Premium")
- `sequence` (Number, Required) - Display order (1, 2, 3...)
- `price` (Number, Required) - Price in MNT (e.g., 19900)
- `discount` (Number, Optional) - Discount percentage (0-100)
- `discountTitle` (Text, Optional) - Discount label (e.g., "20% OFF")
- `durationDays` (Number, Required) - Duration in days (30, 90, 365)
- `isActive` (Bool, Required, Default: true) - Whether plan is visible
- `features` (JSON, Optional) - Array of features (e.g., `["Unlimited reading", "Ad-free", "Early access"]`)

**API Rules:**
- List/Search: `@request.auth.id != ""`
- View: `@request.auth.id != ""`
- Create: `@request.auth.role = "ADMIN"`
- Update: `@request.auth.role = "ADMIN"`
- Delete: `@request.auth.role = "ADMIN"`

### 2. subscriptions Collection

Create a new collection named `subscriptions`:

**Fields:**
- `user` (Relation, Required) - Single relation to `users` collection
- `subscriptionPlan` (Relation, Required) - Single relation to `subscription_plans` collection
- `status` (Select, Required) - Options: "pending", "active", "expired", "cancelled"
- `qpayInvoiceId` (Text, Optional) - Mock QPay invoice ID
- `qpayQRImage` (Text, Optional) - Mock QR code data (base64 or URL)
- `amount` (Number, Required) - Final amount paid
- `startDate` (Date, Optional) - When subscription started
- `expiryDate` (Date, Optional) - When subscription expires

**API Rules:**
- List/Search: `@request.auth.id = user || @request.auth.role = "ADMIN"`
- View: `@request.auth.id = user || @request.auth.role = "ADMIN"`
- Create: `@request.auth.id = user`
- Update: `@request.auth.id = user || @request.auth.role = "ADMIN"`
- Delete: `@request.auth.role = "ADMIN"`

### 3. Update users Collection

Add these fields to the existing `users` collection:

**New Fields:**
- `subscription_status` (Text, Default: "free") - Current subscription status
- `subscription_expiry` (Date, Optional) - When subscription expires

## Sample Data

### Sample Subscription Plans

Add these sample plans to test:

```json
// Plan 1: Monthly
{
  "name": "Monthly Premium",
  "sequence": 1,
  "price": 19900,
  "discount": 0,
  "discountTitle": "",
  "durationDays": 30,
  "isActive": true,
  "features": ["Unlimited manga reading", "Ad-free experience", "HD image quality"]
}

// Plan 2: Quarterly (Popular)
{
  "name": "Quarterly Premium",
  "sequence": 2,
  "price": 49900,
  "discount": 20,
  "discountTitle": "20% OFF",
  "durationDays": 90,
  "isActive": true,
  "features": ["Unlimited manga reading", "Ad-free experience", "HD image quality", "Early access to new chapters"]
}

// Plan 3: Yearly (Best Value)
{
  "name": "Yearly Premium",
  "sequence": 3,
  "price": 159900,
  "discount": 35,
  "discountTitle": "35% OFF",
  "durationDays": 365,
  "isActive": true,
  "features": ["Unlimited manga reading", "Ad-free experience", "HD image quality", "Early access to new chapters", "Exclusive content"]
}
```

## Setup Steps

1. Log in to PocketBase Admin UI (`http://127.0.0.1:8090/_/`)
2. Go to **Collections** → **New Collection**
3. Create `subscription_plans` collection with fields above
4. Create `subscriptions` collection with fields above
5. Update `users` collection with new fields
6. Add sample subscription plans
7. Configure API rules for each collection
8. Test by making API calls from the application

## Testing

After setup, you can test with:

```bash
# Get all active plans
curl http://127.0.0.1:8090/api/collections/subscription_plans/records?filter=isActive=true

# Create a subscription (with auth token)
curl -X POST http://127.0.0.1:8090/api/collections/subscriptions/records \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "user": "USER_ID",
    "subscriptionPlan": "PLAN_ID",
    "status": "pending",
    "amount": 19900
  }'
```

## Notes

- The `qpayQRImage` field will store mock QR code data (base64 image or placeholder URL)
- The `qpayInvoiceId` will be a randomly generated ID for mock implementation
- When payment is verified, update `status` to "active", set `startDate` and `expiryDate`
- Update user's `subscription_status` and `subscription_expiry` when subscription becomes active

