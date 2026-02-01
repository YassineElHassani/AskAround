# AskAround Backend

A robust, scalable location-based Q&A platform API built with NestJS, MongoDB, and TypeScript. Features real-time geospatial queries, JWT authentication, and RESTful architecture.

## Features

- **Geospatial Queries**: MongoDB 2dsphere indexing for efficient location-based searches
- **JWT Authentication**: Secure token-based authentication with Passport
- **Questions System**: Create, read, and search questions by location
- **Answers System**: Nested answers with author population
- **Favorites System**: User can save and track favorite questions
- **Like System**: Question popularity tracking
- **Input Validation**: Class-validator for request validation
- **Error Handling**: Centralized exception handling
- **CORS Enabled**: Cross-origin resource sharing configured
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: NestJS 10.x
- **Runtime**: Node.js 20.x
- **Database**: MongoDB 7.0 with Mongoose ODM
- **Authentication**: Passport JWT
- **Validation**: class-validator & class-transformer
- **Password Hashing**: bcrypt

## Project Structure

```
backend/
├── src/
│   ├── answers/             # Answers module
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── schemas/         # Mongoose schemas
│   │   ├── answers.controller.ts
│   │   ├── answers.service.ts
│   │   └── answers.module.ts
│   │
│   ├── auth/                # Authentication module
│   │   ├── dto/             # Login/Register DTOs
│   │   ├── guards/          # JWT auth guard
│   │   ├── strategies/      # Passport strategies
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   │
│   ├── questions/           # Questions module
│   │   ├── dto/             # Question DTOs
│   │   ├── schemas/         # Question schema with geospatial index
│   │   ├── questions.controller.ts
│   │   ├── questions.service.ts
│   │   └── questions.module.ts
│   │
│   ├── users/               # Users module
│   │   ├── dto/             # User DTOs
│   │   ├── schemas/         # User schema
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   │
│   ├── common/              # Shared utilities
│   │   └── decorators/      # Custom decorators
│   │
│   ├── app.module.ts        # Root module
│   ├── app.controller.ts    # Root controller
│   ├── app.service.ts       # Root service
│   └── main.ts              # Application entry point
│
├── test/                    # E2E tests
├── .env                     # Environment variables
├── .env.example             # Environment template
├── nest-cli.json            # NestJS CLI configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies
├── Dockerfile               # Docker configuration
└── postman_collection.json  # API testing collection
```

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- MongoDB 7.0 or higher
- npm or yarn

### Installation

1. **Clone and navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/askaround
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   PORT=3000
   NODE_ENV=development
   ```

4. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7.0

   # Or local installation
   mongod --dbpath /path/to/data
   ```

5. **Run the application**
   ```bash
   # Development mode with hot reload
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod

   # Debug mode
   npm run start:debug
   ```

6. **Access the API**
   - API: http://localhost:3000
   - Health Check: http://localhost:3000
   - API Documentation: Check `API_DOCUMENTATION.md`

## Environment Variables

| Variable      | Description                          | Default                               | Required |
|---------------|--------------------------------------|---------------------------------------|----------|
| `MONGODB_URI` | MongoDB connection string            | `mongodb://localhost:27017/askaround` | Yes      |
| `JWT_SECRET`  | Secret key for JWT tokens            | -                                     | Yes      |
| `PORT`        | Application port                     | `3000`                                | No       |
| `NODE_ENV`    | Environment (development/production) | `development`                         | No       |

### Docker Environment Variables

```env
# For Docker Compose
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/askaround?authSource=admin
JWT_SECRET=your-secret-key
PORT=3000
NODE_ENV=production
```

## API Documentation

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Questions

#### Get Nearby Questions
```http
GET /questions?latitude=40.7128&longitude=-74.0060&maxDistance=5000&limit=50
```

Query Parameters:
- `latitude` (required): User's latitude
- `longitude` (required): User's longitude
- `maxDistance` (optional): Search radius in meters (default: 10000)
- `limit` (optional): Max results (default: 50)

#### Create Question
```http
POST /questions
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Best coffee shop nearby?",
  "content": "Looking for recommendations",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

#### Get Question by ID
```http
GET /questions/{questionId}
```

### Answers

#### Create Answer
```http
POST /answers
Authorization: Bearer {token}
Content-Type: application/json

{
  "questionId": "507f1f77bcf86cd799439011",
  "content": "Try Blue Bottle Coffee on 5th Avenue!"
}
```

#### Get Answers for Question
```http
GET /answers/question/{questionId}
```

### Favorites

#### Add to Favorites (Like)
```http
POST /users/favorites/{questionId}
Authorization: Bearer {token}
```

#### Remove from Favorites (Unlike)
```http
DELETE /users/favorites/{questionId}
Authorization: Bearer {token}
```

#### Get User's Favorites
```http
GET /users/favorites
Authorization: Bearer {token}
```

## Database Schema

### User
```typescript
{
  name: String (required)
  email: String (required, unique)
  password: String (required, hashed)
  favoriteQuestions: [ObjectId] (ref: Question)
  createdAt: Date
  updatedAt: Date
}
```

### Question
```typescript
{
  title: String (required)
  content: String (required)
  location: {
    type: 'Point' (required)
    coordinates: [longitude, latitude] (required)
  }
  author: ObjectId (required, ref: User)
  answers: [ObjectId] (ref: Answer)
  likeCount: Number (default: 0)
  createdAt: Date
  updatedAt: Date
}

// Indexes
location: 2dsphere (geospatial index)
```

### Answer
```typescript
{
  content: String (required)
  author: ObjectId (required, ref: User)
  question: ObjectId (required, ref: Question)
  createdAt: Date
  updatedAt: Date
}
```

## Docker

### Development
```bash
# From project root
docker-compose up -d

# Backend only
docker-compose up -d backend mongodb
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Access Container
```bash
# Shell access
docker-compose exec backend sh

# View logs
docker-compose logs -f backend

# Restart service
docker-compose restart backend
```