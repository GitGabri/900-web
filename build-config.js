// Build script to replace API configuration
const fs = require('fs');
const path = require('path');

console.log('🔧 Building API configuration...');

// Read environment variables
const LAMBDA_API_URL = process.env.LAMBDA_API_URL;

// Check if environment variables are set
if (!LAMBDA_API_URL) {
    console.error('❌ Error: Missing environment variables');
    console.error('Please set LAMBDA_API_URL');
    console.error('');
    console.error('For local development, create a .env file:');
    console.error('LAMBDA_API_URL=https://your-api-gateway-url.amazonaws.com/dev');
    console.error('');
    console.error('For production, set the environment variable in your deployment platform');
    process.exit(1);
}

// Read the template file
const templatePath = path.join(__dirname, 'supabase-config.template.js');
const outputPath = path.join(__dirname, 'supabase-config.js');

try {
    let configContent = fs.readFileSync(templatePath, 'utf8');
    
    // Replace placeholders with actual values
    configContent = configContent
        .replace(/YOUR_LAMBDA_API_URL/g, LAMBDA_API_URL);
    
    // Write the actual config file
    fs.writeFileSync(outputPath, configContent);
    
    console.log('✅ API configuration built successfully');
    console.log(`📁 Output: ${outputPath}`);
    console.log(`🔗 API URL: ${LAMBDA_API_URL}`);
    
} catch (error) {
    console.error('❌ Error building configuration:', error.message);
    process.exit(1);
} 