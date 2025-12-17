# SecondaryPro Deployment Guide

This guide will help you deploy SecondaryPro to Render (free tier).

## Prerequisites

1. **MongoDB Atlas Account**: Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Email Account**: Gmail account with App Password for notifications

## Step 1: Set up MongoDB Atlas

1. Create a new cluster (free tier M0)
2. Create a database user with read/write permissions
3. Add your IP address to the IP Access List (or use 0.0.0.0/0 for all IPs)
4. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/secondarypro`

## Step 2: Deploy to Render

### Option A: Using Render Dashboard (Recommended)

1. **Fork/Upload this repository** to GitHub
2. **Connect to Render**:
   - Go to [render.com](https://render.com) and sign in
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Deploy Backend API**:
   - **Name**: `secondarypro-api`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Environment Variables**:
     ```
     NODE_ENV=production
     PORT=10000
     MONGODB_URI=your_mongodb_atlas_connection_string
     EMAIL_HOST=smtp.gmail.com
     EMAIL_PORT=587
     EMAIL_USER=your_gmail@gmail.com
     EMAIL_PASS=your_app_password
     ADMIN_PASSWORD=your_secure_admin_password
     CLIENT_URL=https://your-frontend-url.onrender.com
     ```

4. **Deploy Frontend**:
   - **Name**: `secondarypro-frontend`
   - **Environment**: `Static Site`
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/build`
   - **Environment Variables**:
     ```
     REACT_APP_API_URL=https://your-backend-url.onrender.com/api
     ```

### Option B: Using render.yaml (Advanced)

1. Use the included `render.yaml` file
2. Update the service names and URLs in the file
3. Deploy using Render's Blueprint feature

## Step 3: Configure Email (Gmail)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Use the 16-character app password** as `EMAIL_PASS` in environment variables

## Step 4: Test Your Deployment

1. **Frontend**: Visit your frontend URL
2. **Backend API**: Visit `your-backend-url.onrender.com/api/health`
3. **Admin Panel**: Visit `your-frontend-url.onrender.com/admin`

## Step 5: Add Sample Data (Optional)

Use the admin panel to add your first products:

1. Go to `/admin/login`
2. Enter your admin password
3. Navigate to "Products" tab
4. Add sample products with image URLs

## Environment Variables Reference

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/secondarypro
NODE_ENV=development
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_PASSWORD=admin123
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Failed**
   - Check your connection string
   - Ensure IP whitelist includes your deployment IPs
   - Verify database user permissions

2. **Email Not Sending**
   - Use Gmail App Password, not regular password
   - Check EMAIL_HOST and EMAIL_PORT settings
   - Ensure 2FA is enabled on Gmail

3. **CORS Errors**
   - Verify CLIENT_URL in backend environment
   - Check REACT_APP_API_URL in frontend environment

4. **Admin Login Not Working**
   - Verify ADMIN_PASSWORD environment variable
   - Check browser console for errors

### Render Free Tier Limitations:

- Services sleep after 15 minutes of inactivity
- 750 hours/month limit per service
- Cold start delays when services wake up

## Production Recommendations

1. **Security**:
   - Use strong admin password
   - Enable MongoDB IP whitelist
   - Use HTTPS only in production

2. **Performance**:
   - Consider upgrading to paid Render plans for better performance
   - Implement image CDN for product images
   - Add database indexing for better query performance

3. **Monitoring**:
   - Set up error tracking (Sentry)
   - Monitor application logs
   - Set up uptime monitoring

## Support

For issues with this deployment:
1. Check the application logs in Render dashboard
2. Verify all environment variables are set correctly
3. Test API endpoints individually
4. Check MongoDB Atlas logs for connection issues
