# AskAround API Documentation

Complete REST API documentation for the AskAround backend service.

## Base URL

```
http://localhost:3000
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### Register User

**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2026-02-03T10:00:00.000Z"
  }
}
```

#### Login

**POST** `/auth/login`

Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

---

### Questions

#### Get Nearby Questions

**GET** `/questions`

Retrieve questions within a specified radius of a location.

**Query Parameters:**
- `latitude` (required): User's latitude
- `longitude` (required): User's longitude
- `radius` (optional): Search radius in meters (default: 5000)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Best coffee shop nearby?",
    "content": "Looking for a good coffee shop in this area",
    "location": {
      "type": "Point",
      "coordinates": [2.3522, 48.8566]
    },
    "author": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe"
    },
    "createdAt": "2026-02-03T10:30:00.000Z",
    "answerCount": 5
  }
]
```

#### Create Question

**POST** `/questions`

Create a new location-based question.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Best coffee shop nearby?",
  "content": "Looking for a good coffee shop in this area",
  "latitude": 48.8566,
  "longitude": 2.3522
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Best coffee shop nearby?",
  "content": "Looking for a good coffee shop in this area",
  "location": {
    "type": "Point",
    "coordinates": [2.3522, 48.8566]
  },
  "author": "507f1f77bcf86cd799439011",
  "createdAt": "2026-02-03T10:30:00.000Z"
}
```

#### Get Question by ID

**GET** `/questions/:id`

Retrieve a specific question with full details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Best coffee shop nearby?",
  "content": "Looking for a good coffee shop in this area",
  "location": {
    "type": "Point",
    "coordinates": [2.3522, 48.8566]
  },
  "author": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe"
  },
  "createdAt": "2026-02-03T10:30:00.000Z"
}
```

---

### Answers

#### Create Answer

**POST** `/answers`

Post an answer to a question.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "questionId": "507f1f77bcf86cd799439012",
  "content": "Try Café de Flore, it's amazing!",
  "parentAnswerId": null
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "content": "Try Café de Flore, it's amazing!",
  "author": "507f1f77bcf86cd799439011",
  "question": "507f1f77bcf86cd799439012",
  "createdAt": "2026-02-03T11:00:00.000Z"
}
```

#### Get Answers for Question

**GET** `/answers/question/:questionId`

Retrieve all answers for a specific question.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "content": "Try Café de Flore, it's amazing!",
    "author": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe"
    },
    "question": "507f1f77bcf86cd799439012",
    "createdAt": "2026-02-03T11:00:00.000Z",
    "replies": []
  }
]
```

---

### Users & Favorites

#### Get Current User

**GET** `/users/me`

Get the authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "favoriteQuestions": ["507f1f77bcf86cd799439012"],
  "createdAt": "2026-02-03T10:00:00.000Z"
}
```

#### Add to Favorites

**POST** `/users/favorites/:questionId`

Add a question to user's favorites.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Question added to favorites",
  "favoriteQuestions": ["507f1f77bcf86cd799439012"]
}
```

#### Remove from Favorites

**DELETE** `/users/favorites/:questionId`

Remove a question from user's favorites.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Question removed from favorites",
  "favoriteQuestions": []
}
```

#### Get User's Favorites

**GET** `/users/favorites`

Retrieve all favorite questions for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Best coffee shop nearby?",
    "content": "Looking for a good coffee shop in this area",
    "author": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe"
    },
    "createdAt": "2026-02-03T10:30:00.000Z"
  }
]
```

---

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": ["email must be an email", "password must be longer than 8 characters"],
  "error": "Bad Request"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Question not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Data Models

### User Schema

```typescript
{
  _id: ObjectId;
  username: string;
  email: string;
  password: string; // hashed
  favoriteQuestions: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Question Schema

```typescript
{
  _id: ObjectId;
  title: string;
  content: string;
  location: {
    type: 'Point';
    coordinates: [longitude, latitude];
  };
  author: ObjectId; // ref: User
  createdAt: Date;
  updatedAt: Date;
}
```

### Answer Schema

```typescript
{
  _id: ObjectId;
  content: string;
  author: ObjectId; // ref: User
  question: ObjectId; // ref: Question
  parentAnswer: ObjectId | null; // ref: Answer (for nested replies)
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Testing with Postman

Import the `postman_collection.json` file included in the backend directory for a complete collection of API requests.

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production deployments.

## CORS

CORS is enabled for all origins in development. Configure appropriately for production.
