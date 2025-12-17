#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 SecondaryPro Setup Script');
console.log('============================\n');

// Check if we're in the right directory
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: Please run this script from the SecondaryPro root directory');
  process.exit(1);
}

// Create .env files if they don't exist
const serverEnvPath = path.join(process.cwd(), 'server', '.env');
const clientEnvPath = path.join(process.cwd(), 'client', '.env');

if (!fs.existsSync(serverEnvPath)) {
  console.log('📝 Creating server .env file...');
  const serverEnvContent = `PORT=5000
MONGODB_URI=mongodb://localhost:27017/secondarypro
NODE_ENV=development

# Email Configuration (Update with your Gmail credentials)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Admin Credentials (Change this!)
ADMIN_PASSWORD=admin123

# Frontend URL
CLIENT_URL=http://localhost:3000
`;
  fs.writeFileSync(serverEnvPath, serverEnvContent);
  console.log('✅ Server .env file created');
} else {
  console.log('📄 Server .env file already exists');
}

if (!fs.existsSync(clientEnvPath)) {
  console.log('📝 Creating client .env file...');
  const clientEnvContent = `REACT_APP_API_URL=http://localhost:5000/api
`;
  fs.writeFileSync(clientEnvPath, clientEnvContent);
  console.log('✅ Client .env file created');
} else {
  console.log('📄 Client .env file already exists');
}

console.log('\n🎉 Setup complete!');
console.log('\nNext steps:');
console.log('1. Update server/.env with your MongoDB URI and email credentials');
console.log('2. Run: npm run install-all');
console.log('3. Run: npm run dev');
console.log('\nFor deployment instructions, see DEPLOYMENT.md');
console.log('\nAdmin panel: http://localhost:3000/admin');
console.log('Default admin password: admin123 (change this in server/.env)');
