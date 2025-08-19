# iCorkIt Admin Setup & Stripe Integration

## 🚀 **Admin System Setup**

### 1. **Database Migration**
After updating the schema, run:
```bash
npx prisma migrate reset --force
npx prisma migrate dev --name add_admin_approval
```

### 2. **Make First User Admin**
Run the script to make your first registered user an admin:
```bash
node scripts/make-admin.js
```

### 3. **Access Admin Dashboard**
- Login with your admin account
- Navigate to `/admin` in your browser
- You'll see the admin dashboard with pending board approvals

## 💳 **Stripe Integration Setup**

### 1. **Environment Variables**
Create/update your `.env.local` file:
```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_... # Your Stripe secret key
STRIPE_PUBLISHABLE_KEY=pk_test_... # Your Stripe publishable key
STRIPE_WEBHOOK_SECRET=whsec_... # Your Stripe webhook secret

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Database
DATABASE_URL="file:./dev.db"
```

### 2. **Stripe Webhook Endpoint**
Your webhook endpoint will be:
```
https://yourdomain.com/api/stripe/webhook
```

### 3. **Webhook Events to Handle**
- `payment_intent.succeeded` - Successful payments
- `payment_intent.payment_failed` - Failed payments
- `customer.subscription.created` - New subscriptions
- `customer.subscription.updated` - Subscription changes
- `customer.subscription.deleted` - Cancelled subscriptions

## 🔧 **Admin Features**

### **Board Approval System**
- All location-based boards (CITY, STATE) require admin approval
- Social boards are auto-approved
- Admins can approve/reject with rejection reasons
- Pending boards appear in admin dashboard

### **User Management**
- View all users
- Manage user roles (Admin, User)
- Monitor user activity
- Handle user disputes

### **System Monitoring**
- Total user count
- Total board count
- Pending approvals count
- Revenue tracking (when Stripe is integrated)

## 📱 **Admin Dashboard Access**

### **URL**: `/admin`
### **Requirements**: User must have `isAdmin: true`

### **Features**:
1. **Pending Board Approvals** - Review and approve/reject new location boards
2. **User Management** - Manage user accounts and permissions
3. **System Settings** - Configure platform-wide settings
4. **Analytics** - View platform statistics and metrics

## 🛡️ **Security Features**

- JWT-based authentication for admin routes
- Role-based access control
- Admin-only API endpoints
- Secure token verification

## 🔄 **Next Steps for Stripe Integration**

1. **Install Stripe SDK**:
   ```bash
   npm install stripe
   ```

2. **Create Stripe API Routes**:
   - `/api/stripe/create-payment-intent` - Create payment intents
   - `/api/stripe/webhook` - Handle webhook events
   - `/api/stripe/customer-portal` - Customer billing portal

3. **Update Corkits Purchase Flow**:
   - Integrate with Stripe Checkout
   - Handle successful payments
   - Update user corkits balance
   - Send confirmation emails

4. **Subscription Management**:
   - Monthly/yearly corkits packages
   - Auto-renewal handling
   - Usage tracking and limits

## 🚨 **Important Notes**

- **Never commit Stripe keys to version control**
- **Use test keys during development**
- **Implement proper error handling for payments**
- **Add logging for all admin actions**
- **Implement audit trails for sensitive operations**

## 📞 **Support**

For technical issues or questions about the admin system, refer to the main README.md or contact the development team.
