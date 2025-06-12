# 🚀 **Social Media Growth Platform - API Reference**

## 📡 **API Routes Overview**

| Route | Method | Purpose | Auth Required |
|-------|--------|---------|---------------|
| `/api/plans` | GET | Fetch all active subscription plans | ❌ |
| `/api/checkout` | POST | Create Stripe checkout session | ✅ |
| `/api/subscriptions` | GET/POST | Manage user subscriptions | ✅ |
| `/api/coupons` | GET/POST | Validate/apply coupon codes | ❌/❌ |
| `/api/affiliates` | GET/POST | Affiliate program management | ✅ |
| `/api/referrals` | GET/POST | Referral tracking & validation | ❌/❌ |
| `/api/auth/callback` | GET | Supabase auth callback handler | ❌ |
| `/api/webhooks/stripe` | POST | Stripe webhook events | ❌ |

---

## 🛒 **Checkout API** - `/api/checkout`

### POST - Create Checkout Session
Creates a Stripe checkout session for subscription purchase.

**Headers:**
```
Authorization: Bearer <supabase_session_token>
Content-Type: application/json
```

**Body:**
```json
{
  "planSlug": "pro",
  "billingCycle": "monthly", // or "yearly"
  "platform": "instagram",
  "couponCode": "SAVE20" // optional
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

---

## 📋 **Plans API** - `/api/plans`

### GET - Fetch Active Plans
Returns all active subscription plans with pricing.

**Response:**
```json
{
  "plans": [
    {
      "id": "uuid",
      "name": "Pro Plan",
      "slug": "pro",
      "description": "Advanced growth tools",
      "monthly_price": 11900,
      "yearly_price": 71400,
      "stripe_monthly_price_id": "price_...",
      "stripe_yearly_price_id": "price_...",
      "features": ["feature1", "feature2"],
      "max_accounts": 3,
      "is_active": true
    }
  ],
  "count": 4
}
```

---

## 💰 **Subscriptions API** - `/api/subscriptions`

### GET - Get User Subscriptions
Fetch current user's active subscriptions.

**Headers:**
```
Authorization: Bearer <supabase_session_token>
```

**Response:**
```json
{
  "subscriptions": [
    {
      "id": "uuid",
      "plan_id": "uuid",
      "platform": "instagram",
      "status": "active",
      "billing_cycle": "monthly",
      "current_period_end": "2024-02-15T00:00:00Z",
      "cancel_at_period_end": false,
      "plan": {
        "name": "Pro Plan",
        "slug": "pro"
      }
    }
  ],
  "count": 1
}
```

### POST - Manage Subscription
Cancel, reactivate, or immediately cancel subscriptions.

**Headers:**
```
Authorization: Bearer <supabase_session_token>
Content-Type: application/json
```

**Body:**
```json
{
  "action": "cancel", // "cancel", "cancel_immediately", "reactivate"
  "subscriptionId": "uuid"
}
```

**Response:**
```json
{
  "message": "Subscription will cancel at period end"
}
```

---

## 🎟️ **Coupons API** - `/api/coupons`

### GET - Validate Coupon
Validate a coupon code for checkout.

**Query Params:**
- `code` - The coupon code to validate

**Example:** `/api/coupons?code=SAVE20`

**Response:**
```json
{
  "valid": true,
  "coupon": {
    "code": "SAVE20",
    "discount_percentage": 20,
    "description": "20% off your first month",
    "expires_at": "2024-12-31T23:59:59Z",
    "remaining_uses": 85
  }
}
```

### POST - Apply Coupon
Apply coupon (increment usage counter).

**Body:**
```json
{
  "code": "SAVE20"
}
```

**Response:**
```json
{
  "message": "Coupon applied successfully",
  "discount_percentage": 20
}
```

---

## 👥 **Affiliates API** - `/api/affiliates`

### GET - Get Affiliate Data
Fetch user's affiliate information and referral stats.

**Headers:**
```
Authorization: Bearer <supabase_session_token>
```

**Response:**
```json
{
  "isAffiliate": true,
  "affiliate": {
    "id": "uuid",
    "referral_code": "JOHN2024",
    "commission_tier": "basic",
    "total_earnings": 15750,
    "total_referrals": 12,
    "monthly_referred_revenue": 28800,
    "payment_email": "john@example.com",
    "payment_method": "paypal",
    "referrals": [
      {
        "id": "uuid",
        "status": "active",
        "commission_earned": 1785,
        "created_at": "2024-01-15T00:00:00Z",
        "profiles": {
          "first_name": "Jane",
          "last_name": "Doe",
          "email": "jane@example.com"
        }
      }
    ]
  }
}
```

### POST - Register/Update Affiliate
Register as affiliate or update settings.

**Headers:**
```
Authorization: Bearer <supabase_session_token>
Content-Type: application/json
```

**Body (Register):**
```json
{
  "action": "register",
  "paymentEmail": "john@example.com",
  "paymentMethod": "paypal"
}
```

**Body (Update):**
```json
{
  "action": "update",
  "paymentEmail": "newemail@example.com",
  "paymentMethod": "bank_transfer"
}
```

---

## 🔗 **Referrals API** - `/api/referrals`

### GET - Validate Referral Code
Check if a referral code is valid.

**Query Params:**
- `code` - The referral code to validate

**Example:** `/api/referrals?code=JOHN2024`

**Response:**
```json
{
  "valid": true,
  "affiliate": {
    "referral_code": "JOHN2024",
    "commission_tier": "basic",
    "affiliate_name": "John Smith"
  }
}
```

### POST - Track Referral
Record when a new user signs up via referral.

**Body:**
```json
{
  "referralCode": "JOHN2024",
  "newUserId": "uuid"
}
```

**Response:**
```json
{
  "message": "Referral tracked successfully",
  "referral": {
    "id": "uuid",
    "affiliate_id": "uuid",
    "referred_user_id": "uuid",
    "status": "pending",
    "referral_code": "JOHN2024"
  }
}
```

---

## 🔐 **Auth Callback** - `/api/auth/callback`

### GET - Supabase Auth Callback
Handles email confirmations and OAuth redirects.

**Query Params:**
- `code` - Auth code from Supabase
- `next` - Redirect URL after successful auth (optional)

**Example:** `/api/auth/callback?code=abc123&next=/dashboard`

**Response:** Redirects to specified page or dashboard.

---

## ⚡ **Stripe Webhooks** - `/api/webhooks/stripe`

### POST - Process Stripe Events
Handles Stripe webhook events for payment processing.

**Headers:**
```
stripe-signature: <webhook_signature>
Content-Type: application/json
```

**Supported Events:**
- `checkout.session.completed` - Payment successful
- `customer.subscription.updated` - Subscription changed
- `customer.subscription.deleted` - Subscription canceled
- `invoice.paid` - Recurring payment successful
- `invoice.payment_failed` - Payment failed

**Response:**
```json
{
  "received": true
}
```

---

## 🔒 **Authentication**

Most endpoints require authentication using Supabase session tokens:

```javascript
// Get token from Supabase auth
const { data: { session } } = await supabase.auth.getSession()
const token = session?.access_token

// Use in API calls
fetch('/api/subscriptions', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

---

## ⚠️ **Error Responses**

All endpoints return consistent error formats:

```json
{
  "error": "Human readable error message",
  "details": "Technical error details (optional)"
}
```

**Common HTTP Status Codes:**
- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (invalid/missing auth token)  
- `404` - Not Found (resource doesn't exist)
- `405` - Method Not Allowed
- `500` - Internal Server Error

---

## 🚀 **Next Steps**

1. **Setup Environment Variables** (see `.env.example`)
2. **Deploy Database Schema** (`lib/database.sql`)
3. **Configure Stripe Products** (match plan price IDs)
4. **Setup Stripe Webhooks** (point to `/api/webhooks/stripe`)
5. **Test API Endpoints** with frontend integration

Your backend API is now complete and ready for production! 🎉 