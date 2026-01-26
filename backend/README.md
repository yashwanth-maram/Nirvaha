# Nirvaha Backend - Companion Feature API

Backend implementation for the Companion feature of the Nirvaha Dashboard.

## Tech Stack

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT-based authentication
- Zod for request validation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```env
MONGODB_URI=mongodb://localhost:27017/nirvaha
JWT_SECRET=your-secret-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

3. Run in development mode:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```

## API Endpoints

### Companions

#### GET /api/companions
Get list of companions with optional filters.

**Query Parameters:**
- `availability` (string): Filter by availability (true/false)
- `specialty` (string): Filter by specialty
- `language` (string): Filter by language
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "...",
      "title": "...",
      "avatar": "...",
      "coverImage": "...",
      "rating": 4.9,
      "reviews": 342,
      "sessions": 1247,
      "location": "...",
      "languages": ["English", "Hindi"],
      "specialties": ["Breath Work", "Chakra Healing"],
      "bio": "...",
      "hourlyRate": "$60",
      "callRate": "$25",
      "availability": "Available",
      "responseTime": "2 hours",
      "color": "from-emerald-400 to-teal-500"
    }
  ]
}
```

#### GET /api/companions/:id
Get full companion profile by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "...",
    // ... full companion object
  }
}
```

#### POST /api/companions/:id/like
Like a companion (Auth required).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Companion liked successfully",
  "data": { "liked": true }
}
```

#### DELETE /api/companions/:id/like
Unlike a companion (Auth required).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Companion unliked successfully",
  "data": { "liked": false }
}
```

#### POST /api/companions/apply
Submit companion application.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "specialties": ["Meditation", "Yoga"],
  "experience": "10 years of experience...",
  "bio": "I am a spiritual guide..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "id": "...",
    "status": "pending"
  }
}
```

### Bookings

#### POST /api/bookings
Create a new booking (Auth required).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "companionId": "...",
  "type": "chat",
  "platform": "WhatsApp",
  "startDateTime": "2024-01-15T10:00:00.000Z"
}
```

**Platform Options:**
- Chat: "In-App Chat", "WhatsApp", "Telegram", "Signal"
- Video: "Google Meet", "Zoom", "Microsoft Teams"

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": "...",
    "companionId": "...",
    "companionName": "...",
    "type": "chat",
    "platform": "WhatsApp",
    "startDateTime": "2024-01-15T10:00:00.000Z",
    "createdAt": "2024-01-10T12:00:00.000Z"
  }
}
```

### User

#### GET /api/users/me/likes
Get liked companion IDs for current user (Auth required).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": ["companionId1", "companionId2", ...]
}
```

#### GET /api/users/me/bookings
Get bookings for current user (Auth required).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "companionId": "...",
      "companionName": "...",
      "type": "chat",
      "platform": "WhatsApp",
      "startDateTime": "2024-01-15T10:00:00.000Z",
      "createdAt": "2024-01-10T12:00:00.000Z"
    }
  ]
}
```

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

The token should contain a `userId` or `id` field that will be available in `req.user.userId`.

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // Optional, for validation errors
}
```

## Data Models

### Companion
- All fields as specified in requirements
- `availability` stored as boolean, returned as "Available" or "Busy"
- `hourlyRate` and `callRate` stored as numbers, returned as formatted strings (e.g., "$60")

### Booking
- `startDateTime` stored as UTC ISO string (Date object)
- Prevents duplicate bookings for same companion and time
- Validates companion availability

### Like
- One like per user per companion (enforced by unique index)
- Idempotent operations

### CompanionApplication
- Status defaults to "pending"
- Stores application data for review

