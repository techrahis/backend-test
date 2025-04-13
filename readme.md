# 🚀 Backend Test

This is a production-ready Node.js backend built using Express, PostgreSQL (via Sequelize), and features like JWT auth, Cloudinary image uploads, email OTP via Resend, Redis, and more.

## Tech Stack

- Node.js & Express.js
- PostgreSQL with Sequelize ORM
- Redis for OTP storage
- Cloudinary for image upload
- Resend with Nodemailer for email OTP
- Multer for image handling
- JWT Auth (Access + Refresh Token)
- Express Rate Limit for route-wise throttling
- Jest + Supertest for testing

## Folder Structure

\`\`\`
src/
config/ # Cloudinary, Redis, DB configs
controllers/ # Route logic
routes/ # Express routes
services/ # Business logic
utils/ # Helper functions (e.g. upload, OTP)
middlewares/ # Auth, error handling, etc.
models/ # Sequelize models
app.js # Main app file
server.js # Server entry point
tests/ # Test files
\`\`\`

## Features

- ✅ Authentication (Register, Login, Refresh Token)
- ✅ Email OTP-based Password Reset
- ✅ Profile Picture Upload to Cloudinary
- ✅ Rate Limiting per Route
- ✅ Environment Config Management
- ✅ Tested Login Route using Jest + Supertest

## Testing

To test the app:

**Run all tests:**
\`\`\`
yarn test
\`\`\`

**Run tests with watch mode (re-runs tests on file changes):**
\`\`\`
yarn test --watch
\`\`\`

**Detect open async operations after tests:**
\`\`\`
yarn test --detectOpenHandles
\`\`\`

## Environment Setup

Create a `.env` file at the root with the following:

\`\`\`
NODE_ENV=development
PORT=5678
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=5432

ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

RESEND_API_KEY=your_resend_api_key

REDIS_HOST=your_redis_host
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_TLS_SSL=true

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
\`\`\`

## Local Development

To run the app locally:

1. Install dependencies:
   \`\`\`
   yarn install
   \`\`\`

2. Start the development server:
   \`\`\`
   yarn dev
   \`\`\`

## Deployment (Vercel)

### Steps:

1. Ensure your `vercel.json` is configured correctly:

\`\`\`
{
"version": 2,
"builds": [
{ "src": "api/**/*.js", "use": "@vercel/node" }
],
"routes": [
{ "src": "/api/(.*)", "dest": "/api/index.js" }
]
}
\`\`\`

2. Place your Express server in `/api/index.js` or adjust the `dest` path in `vercel.json`.

3. Add environment variables in Vercel Dashboard > Project > Settings > Environment Variables.

---

Built with ❤️ by Rajarshi Samaddar
