const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT secret (in production, use a proper secret management service)
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-change-in-production';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

// Helper function to create response
const createResponse = (statusCode, body) => ({
  statusCode,
  headers: corsHeaders,
  body: JSON.stringify(body)
});

// Admin login
exports.adminLogin = async (event) => {
  try {
    console.log('Admin login event:', JSON.stringify(event, null, 2));

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
      return createResponse(200, { message: 'OK' });
    }

    const { email, password } = JSON.parse(event.body);

    // Validate input
    if (!email || !password) {
      return createResponse(400, { error: 'Email and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return createResponse(400, { error: 'Invalid email format' });
    }

    // Check against environment variables (in production, use a database)
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !adminPasswordHash) {
      console.error('Admin credentials not configured');
      return createResponse(500, { error: 'Admin authentication not configured' });
    }

    // Verify email
    if (email !== adminEmail) {
      console.log(`Failed login attempt for email: ${email}`);
      return createResponse(401, { error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, adminPasswordHash);
    if (!isValidPassword) {
      console.log(`Failed login attempt for email: ${email}`);
      return createResponse(401, { error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        email: email,
        role: 'admin',
        iat: Math.floor(Date.now() / 1000)
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Log successful login
    console.log(`Successful admin login for email: ${email}`);

    return createResponse(200, {
      success: true,
      data: {
        token: token,
        user: {
          email: email,
          role: 'admin'
        }
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Error in adminLogin:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
}; 