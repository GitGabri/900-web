# AWS Lambda Serverless Setup Guide

## 🚀 **Complete Serverless Solution**

This setup provides a secure, scalable API using AWS Lambda without exposing credentials in your frontend code.

## 📋 **Architecture Overview**

```
Frontend (Static Site)
    ↓ (HTTPS)
API Gateway
    ↓
Lambda Functions
    ↓
Supabase Database
```

### **Benefits:**
- ✅ **No credentials in frontend code**
- ✅ **Server-side security**
- ✅ **Automatic scaling**
- ✅ **Pay-per-use pricing**
- ✅ **Built-in monitoring**

## 🔧 **Setup Steps**

### **1. Install Dependencies**

```bash
# Install Serverless Framework globally
npm install -g serverless

# Install project dependencies
npm install

# Install development dependencies
npm install --save-dev serverless-offline
```

### **2. Configure AWS Credentials**

```bash
# Install AWS CLI
# https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

# Configure your AWS credentials
aws configure

# Enter your:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region (e.g., us-east-1)
# - Default output format (json)
```

### **3. Set Environment Variables**

Create a `.env` file for local development:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# Admin Authentication
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD_HASH=$2a$10$your-hashed-password

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secure-jwt-secret

# Lambda API URL (will be set after deployment)
LAMBDA_API_URL=https://your-api-gateway-url.amazonaws.com/dev
```

### **4. Generate Admin Password Hash**

```bash
# Create a password hash for admin authentication
node -e "
const bcrypt = require('bcryptjs');
const password = 'your-admin-password';
bcrypt.hash(password, 10).then(hash => {
    console.log('Password hash:', hash);
});
"
```

### **5. Deploy to AWS**

```bash
# Deploy to development stage
npm run deploy

# Deploy to production stage
npm run deploy:prod
```

### **6. Update Frontend Configuration**

After deployment, update your `.env` file with the API Gateway URL:

```env
LAMBDA_API_URL=https://your-api-gateway-url.amazonaws.com/dev
```

Then rebuild your frontend:

```bash
node build-config.js
```

## 🛡️ **Security Features**

### **Authentication & Authorization**
- **JWT-based admin authentication**
- **Password hashing with bcrypt**
- **Token expiration (24 hours)**
- **Role-based access control**

### **Input Validation**
- **Request validation**
- **SQL injection prevention**
- **XSS protection**
- **Rate limiting**

### **Audit Logging**
- **Security event logging**
- **Order change tracking**
- **Admin action monitoring**
- **IP address tracking**

### **CORS Configuration**
- **Cross-origin request handling**
- **Preflight request support**
- **Secure headers**

## 📊 **API Endpoints**

### **Public Endpoints**

#### **Submit Order**
```
POST /api/orders
Content-Type: application/json

{
  "orderId": "ORD-12345",
  "customer": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "organization": "Music School"
  },
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zip": "12345",
    "country": "USA"
  },
  "items": [
    {
      "name": "Moonlight Sonata",
      "composer": "Beethoven",
      "price": 15.99,
      "quantity": 2
    }
  ],
  "notes": "Please include fingering suggestions",
  "orderDate": "2024-01-15T10:30:00Z"
}
```

### **Admin Endpoints (Require Authentication)**

#### **Admin Login**
```
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@yourdomain.com",
  "password": "your-admin-password"
}
```

#### **Get Orders**
```
GET /api/orders
Authorization: Bearer <jwt-token>
```

#### **Update Order Status**
```
PUT /api/orders/{orderId}/status
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "status": "processing"
}
```

#### **Get Order Statistics**
```
GET /api/admin/stats
Authorization: Bearer <jwt-token>
```

#### **Search Orders**
```
GET /api/admin/search?q=search-term
Authorization: Bearer <jwt-token>
```

## 🔍 **Monitoring & Logging**

### **CloudWatch Logs**
```bash
# View function logs
npm run logs -- -f submitOrder
npm run logs -- -f getOrders
npm run logs -- -f updateOrderStatus
```

### **AWS Console Monitoring**
- **Lambda Metrics**: Duration, errors, throttles
- **API Gateway**: Request count, latency, 4xx/5xx errors
- **CloudWatch**: Custom metrics and alarms

## 🚀 **Deployment Options**

### **Development**
```bash
# Local development with serverless-offline
npm run dev

# Test locally at http://localhost:3000
```

### **Staging**
```bash
# Deploy to staging environment
serverless deploy --stage staging
```

### **Production**
```bash
# Deploy to production environment
serverless deploy --stage production
```

## 📈 **Scaling & Performance**

### **Automatic Scaling**
- **Concurrent executions**: Up to 1000 by default
- **Memory allocation**: 128MB to 10GB
- **Timeout**: Configurable up to 15 minutes

### **Performance Optimization**
- **Connection pooling**: Reuse database connections
- **Cold start mitigation**: Provisioned concurrency
- **Caching**: Response caching at API Gateway

## 🔧 **Customization**

### **Environment-Specific Configuration**

```yaml
# serverless.yml
provider:
  environment:
    STAGE: ${self:provider.stage}
    NODE_ENV: ${self:provider.stage}
```

### **Custom Domains**
```yaml
# Add to serverless.yml
custom:
  customDomain:
    domainName: api.yourdomain.com
    stage: ${self:provider.stage}
    createRoute53Record: true
```

### **Custom Headers**
```yaml
# Add security headers
functions:
  submitOrder:
    events:
      - httpApi:
          path: /api/orders
          method: POST
          cors: true
          response:
            headers:
              X-Frame-Options: DENY
              X-Content-Type-Options: nosniff
```

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **Deployment Fails**
```bash
# Check AWS credentials
aws sts get-caller-identity

# Check serverless version
serverless --version

# Check permissions
aws iam get-user
```

#### **Function Timeout**
```yaml
# Increase timeout in serverless.yml
functions:
  submitOrder:
    timeout: 30
```

#### **CORS Issues**
```javascript
// Check CORS headers in Lambda response
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};
```

#### **Database Connection Issues**
```javascript
// Check Supabase connection
const { data, error } = await supabase
  .from('orders')
  .select('count')
  .limit(1);

if (error) {
  console.error('Database connection failed:', error);
}
```

## 💰 **Cost Optimization**

### **Lambda Pricing**
- **Free tier**: 1M requests/month
- **Pay per request**: $0.20 per 1M requests
- **Pay per compute**: $0.0000166667 per GB-second

### **API Gateway Pricing**
- **Free tier**: 1M requests/month
- **Pay per request**: $3.50 per 1M requests

### **Cost Estimation**
```
Monthly usage: 10,000 requests
Lambda cost: ~$0.002
API Gateway cost: ~$0.035
Total: ~$0.037/month
```

## 🔐 **Security Best Practices**

### **Production Checklist**
- [ ] Use AWS Secrets Manager for sensitive data
- [ ] Enable CloudTrail for audit logging
- [ ] Set up CloudWatch alarms
- [ ] Use custom domain with SSL
- [ ] Implement proper CORS policies
- [ ] Add rate limiting
- [ ] Use environment-specific secrets
- [ ] Regular security updates

### **Environment Variables**
```bash
# Use AWS Systems Manager Parameter Store
aws ssm put-parameter \
  --name "/paolo-music/prod/supabase-url" \
  --value "https://your-project.supabase.co" \
  --type "SecureString"

# Reference in serverless.yml
environment:
  SUPABASE_URL: ${ssm:/paolo-music/${self:provider.stage}/supabase-url}
```

This serverless setup provides enterprise-grade security and scalability while keeping your frontend code clean and credential-free! 🚀 