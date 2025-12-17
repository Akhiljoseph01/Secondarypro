# SecondaryPro

An online shoe reselling platform connected to Instagram for marketing and preorder collection.

## Features

- **Admin Panel**: Upload products, manage orders, update order status
- **Customer Website**: Browse shoes, view details, submit preorders
- **Responsive Design**: Mobile-first approach
- **Email Notifications**: Order confirmations via Nodemailer

## Tech Stack

- **Frontend**: React + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Hosting**: Render (Free Tier)
- **Email**: Nodemailer

## Quick Start

1. **Install dependencies**:
   ```bash
   npm run install-all
   ```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env` in the server directory
   - Add your MongoDB Atlas connection string
   - Add email credentials for Nodemailer

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Admin Panel: http://localhost:3000/admin

## Deployment

This project is configured for deployment on Render:
- Backend: Node.js Web Service
- Frontend: Static Site

## Project Structure

```
secondarypro/
├── client/          # React frontend
├── server/          # Express backend
├── package.json     # Root package.json
└── README.md        # This file
```
