// Build script to replace Supabase credentials
const fs = require('fs');
const path = require('path');

console.log('🔧 Building Supabase configuration...');

// Read environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Check if environment variables are set
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Error: Missing environment variables');
    console.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY');
    console.error('');
    console.error('For local development, create a .env file:');
    console.error('SUPABASE_URL=https://your-project-id.supabase.co');
    console.error('SUPABASE_ANON_KEY=your-anon-key-here');
    process.exit(1);
}

// Read the template file
const templatePath = path.join(__dirname, 'supabase-config.template.js');
const outputPath = path.join(__dirname, 'supabase-config.js');

try {
    let configContent = fs.readFileSync(templatePath, 'utf8');
    
    // Replace placeholders with actual values
    configContent = configContent
        .replace(/YOUR_SUPABASE_URL/g, SUPABASE_URL)
        .replace(/YOUR_SUPABASE_ANON_KEY/g, SUPABASE_ANON_KEY);
    
    // Write the actual config file
    fs.writeFileSync(outputPath, configContent);
    
    console.log('✅ Supabase configuration built successfully');
    console.log(`📁 Output: ${outputPath}`);
    console.log(`🔗 URL: ${SUPABASE_URL}`);
    console.log(`🔑 Key: ${SUPABASE_ANON_KEY.substring(0, 10)}...`);
    
} catch (error) {
    console.error('❌ Error building configuration:', error.message);
    process.exit(1);
} 