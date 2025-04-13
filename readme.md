# Backend Test Project

This is a backend project that includes various features like Spotify API integration, Redis caching, and PostgreSQL for storing data. It is built using **Node.js**, **Express.js**, **Sequelize ORM**, **Jest testing**, and other tools.

## Key Features:

- **Spotify API Integration**: Allows users to get their top tracks, see the currently playing song, and control playback (play, pause).
- **Redis Caching**: Caches frequently accessed data for better performance.
- **PostgreSQL Database**: Used for persistent storage of data.
- **Cloudinary**: For media uploads (e.g., images).
- **Rate Limiting**: Uses Express-rate-limit for controlling request rates.
- **Email Sending**: Uses **Resend** for email functionality (via NodeMailer).

## Technologies Used:

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework for Node.js
- **Sequelize ORM**: ORM for PostgreSQL
- **Redis**: For caching frequently accessed data
- **Cloudinary**: For uploading and storing media (e.g., images)
- **Jest**: Testing framework for unit and integration tests
- **Multer**: Middleware for handling file uploads
- **Upstash**: Redis as a service
- **PostgreSQL**: Relational database
- **Resend**: Email service integration for sending emails
- **Cloudflare**: For distributing the app on a custom subdomain

## Endpoints:

### 1. **Spotify Integration**

- `GET /api/v1/spotify/top-tracks`: Get the user's top 10 tracks from Spotify.
- `GET /api/v1/spotify/now-playing`: Get the currently playing song on Spotify.
- `POST /api/v1/spotify/play-song`: Start playing a song (from the top 10).
- `PUT /api/v1/spotify/pause-song`: Pause the currently playing song.

### 2. **Authentication Endpoints**:

- `POST /api/v1/auth/register`: Register a new user.
- `POST /api/v1/auth/login`: Login a user.
- `POST /api/v1/auth/logout`: Logout a user (requires authentication).
- `POST /api/v1/auth/refresh`: Refresh the authentication token.
- `GET /api/v1/auth/me`: Get the current user's details (requires authentication).
- `PUT /api/v1/auth/update`: Update the user's details (requires authentication).
- `PUT /api/v1/auth/update-profile-picture`: Update the user's profile picture (requires authentication).
- `DELETE /api/v1/auth/remove-profile-picture`: Remove the user's profile picture (requires authentication).
- `POST /api/v1/auth/initiate-reset-password`: Initiate the password reset process by sending an OTP.
- `POST /api/v1/auth/reset-password`: Reset the user's password with OTP verification.

## Rate Limiting:

- **General Limiting**: Applied to most routes to prevent abuse.
- **Spotify Rate Limiting**: Applied to Spotify-related routes to control the frequency of requests to the Spotify API.
- **Auth Rate Limiting**: Specific rate limiters are applied to authentication-related routes, such as login, registration, OTP requests, etc.

## Project Setup and Deployment:

1. **Local Setup**:

   - Clone the repository.
   - Run `yarn` to install dependencies.
   - Create a `.env` file and configure the necessary environment variables (e.g., Spotify credentials, PostgreSQL URL, Redis URL).
   - Start the development server using `yarn dev`.

2. **Deployment**:
   - Deployed on **Vercel** for serverless deployment.
   - The app uses **Cloudflare** for distribution on a custom subdomain.

## Testing:

- **Jest** is used for testing.
- Use `yarn test` to run tests.

## Postman Collection:

To test the API, you can import the Postman collection from the following link:

[Postman Collection](https://www.postman.com/payload-geoscientist-74286553/my-workspace/collection/notc52q/backend-test?action=share&creator=34868713)

This collection includes all the available API routes and their expected responses.

## License:

MIT License. See `LICENSE` for more information.
