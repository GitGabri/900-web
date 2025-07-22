# Secure Configuration Setup Guide

## 🚨 **Never Expose API Keys in Public Code**

Your current `supabase-config.js` has exposed credentials:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

## 🔒 **Solution 1: Environment Variables (Recommended)**

### For Development (Local):
Create a `.env` file in your project root:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### Update supabase-config.js:
```javascript
// Load from environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### Add .env to .gitignore:
```gitignore
# Environment variables
.env
.env.local
.env.production
.env.staging

# Supabase config
supabase-config.js
```

## 🌐 **Solution 2: Server-Side Proxy (Most Secure)**

### Create a backend API endpoint:
```javascript
// server.js (Node.js/Express)
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

// Environment variables on server
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Proxy endpoint for orders
app.post('/api/orders', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .insert([req.body]);

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Proxy endpoint for admin operations
app.get('/api/orders', async (req, res) => {
    try {
        // Verify admin token here
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('order_date', { ascending: false });

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

### Update frontend to use proxy:
```javascript
// supabase-config.js (Frontend)
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

const DatabaseService = {
    async submitOrder(orderData) {
        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error);
            }

            return result.data;
        } catch (error) {
            console.error('Error submitting order:', error);
            throw error;
        }
    },

    async getOrders() {
        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                headers: {
                    'Authorization': `Bearer ${this.getAdminToken()}`
                }
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error);
            }

            return result.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    }
};
```

## 🚀 **Solution 3: Build-Time Configuration**

### For Static Site Generators (Netlify, Vercel, etc.):

Create a build script that replaces placeholders:
```javascript
// build-config.js
const fs = require('fs');

// Read environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Read the template file
let configContent = fs.readFileSync('supabase-config.template.js', 'utf8');

// Replace placeholders
configContent = configContent
    .replace('YOUR_SUPABASE_URL', SUPABASE_URL)
    .replace('YOUR_SUPABASE_ANON_KEY', SUPABASE_ANON_KEY);

// Write the actual config file
fs.writeFileSync('supabase-config.js', configContent);
```

### Create supabase-config.template.js:
```javascript
// Template file - will be processed during build
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Rest of your config...
```

### Update package.json:
```json
{
  "scripts": {
    "prebuild": "node build-config.js",
    "build": "your-build-command"
  }
}
```

## 🌍 **Solution 4: Deployment Platform Variables**

### Netlify:
1. Go to Site Settings → Environment Variables
2. Add:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
3. Redeploy your site

### Vercel:
1. Go to Project Settings → Environment Variables
2. Add your variables
3. Redeploy

### GitHub Pages:
1. Go to Repository Settings → Secrets and Variables → Actions
2. Add environment variables
3. Update your GitHub Actions workflow

## 🔧 **Solution 5: Runtime Configuration (Client-Side)**

### Create a config endpoint on your server:
```javascript
// server.js
app.get('/api/config', (req, res) => {
    res.json({
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseKey: process.env.SUPABASE_ANON_KEY
    });
});
```

### Update frontend to fetch config:
```javascript
// supabase-config.js
let supabase = null;

async function initializeSupabase() {
    if (supabase) return supabase;

    try {
        const response = await fetch('/api/config');
        const config = await response.json();
        
        supabase = supabase.createClient(config.supabaseUrl, config.supabaseKey);
        return supabase;
    } catch (error) {
        console.error('Failed to load configuration:', error);
        throw error;
    }
}

const DatabaseService = {
    async submitOrder(orderData) {
        const client = await initializeSupabase();
        // Rest of your code...
    }
};
```

## 📋 **Recommended Approach by Deployment Type:**

### **Static Sites (GitHub Pages, Netlify, Vercel):**
- Use **Solution 3** (Build-time configuration)
- Environment variables in deployment platform
- Template files in repository

### **Server-Side Applications:**
- Use **Solution 2** (Server-side proxy)
- Environment variables on server
- No credentials in frontend

### **SPA with Backend:**
- Use **Solution 4** (Runtime configuration)
- Config endpoint on server
- Dynamic client initialization

## 🛡️ **Security Best Practices:**

### **1. Never Commit Credentials:**
```gitignore
# Add to .gitignore
.env*
supabase-config.js
config.js
secrets.json
```

### **2. Use Different Keys:**
- **Development**: Use anon key for testing
- **Production**: Use service role key for admin operations
- **Staging**: Use separate project

### **3. Rotate Keys Regularly:**
- Change API keys every 90 days
- Monitor for unauthorized access
- Use key management services

### **4. Monitor Usage:**
```javascript
// Add to your config
const logApiUsage = (operation) => {
    console.log(`API Usage: ${operation} at ${new Date().toISOString()}`);
    // Send to monitoring service
};
```

## 🚀 **Quick Implementation:**

### **For Netlify/Vercel (Easiest):**
1. Create `supabase-config.template.js` with placeholders
2. Add environment variables in deployment platform
3. Use build script to replace placeholders
4. Deploy with secure configuration

### **For GitHub Pages:**
1. Use GitHub Actions to build with secrets
2. Template files in repository
3. Build-time configuration replacement
4. Deploy static files

This way, your API keys stay secure and your code remains public! 🔒 