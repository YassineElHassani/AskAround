# AskAround API Documentation

## Overview
AskAround is a location-based Q&A platform that allows users to post questions related to specific locations and get answers from nearby users.

## Technologies
- **Backend**: NestJS, MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Geospatial Queries**: MongoDB 2dsphere indexes

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/askaround
JWT_SECRET=your_secret_key_here
PORT=3000
```

3. Start MongoDB:
```bash
# Make sure MongoDB is running on your system
```

4. Run the application:
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication

#### Register
- **POST** `/auth/register`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "user@example.com"
    }
  }
  ```

#### Login
- **POST** `/auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "user@example.com"
    }
  }
  ```

### Questions

#### Create a Question
- **POST** `/questions`
- **Headers**: `Authorization: Bearer {token}`
- **Body**:
  ```json
  {
    "title": "Best coffee shop nearby?",
    "content": "I'm new to the area and looking for a good coffee shop",
    "longitude": -73.935242,
    "latitude": 40.730610
  }
  ```
- **Response**: Question object

#### Get Nearby Questions
- **GET** `/questions?longitude={lng}&latitude={lat}&maxDistance={meters}&limit={number}`
- **Query Parameters**:
  - `longitude` (required): User's longitude
  - `latitude` (required): User's latitude
  - `maxDistance` (optional): Maximum distance in meters (default: 10000)
  - `limit` (optional): Maximum number of results (default: 50)
- **Example**: `/questions?longitude=-73.935242&latitude=40.730610&maxDistance=5000&limit=20`
- **Response**: Array of questions sorted by distance

#### Get Question by ID
- **GET** `/questions/:id`
- **Response**: Question object with populated answers

### Answers

#### Create an Answer
- **POST** `/answers`
- **Headers**: `Authorization: Bearer {token}`
- **Body**:
  ```json
  {
    "content": "I recommend Blue Bottle Coffee on 5th Avenue",
    "questionId": "question_id_here"
  }
  ```
- **Response**: Answer object

#### Get Answers for a Question
- **GET** `/answers/question/:questionId`
- **Response**: Array of answers for the specified question

#### Get Answer by ID
- **GET** `/answers/:id`
- **Response**: Answer object

### Favorites

#### Add Question to Favorites
- **POST** `/users/favorites/:questionId`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: 
  ```json
  {
    "message": "Question added to favorites",
    "user": { ... }
  }
  ```

#### Remove Question from Favorites
- **DELETE** `/users/favorites/:questionId`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: 
  ```json
  {
    "message": "Question removed from favorites",
    "user": { ... }
  }
  ```

#### Get User's Favorite Questions
- **GET** `/users/favorites`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: 
  ```json
  {
    "favorites": [...]
  }
  ```

## Data Models

### User
```typescript
{
  _id: ObjectId
  email: string
  password: string (hashed)
  favoriteQuestions: ObjectId[] // References to Question
  createdAt: Date
  updatedAt: Date
}
```

### Question
```typescript
{
  _id: ObjectId
  title: string
  content: string
  location: {
    type: "Point"
    coordinates: [longitude, latitude]
  }
  author: ObjectId // Reference to User
  answers: ObjectId[] // References to Answer
  likeCount: number
  createdAt: Date
  updatedAt: Date
}
```

### Answer
```typescript
{
  _id: ObjectId
  content: string
  author: ObjectId // Reference to User
  question: ObjectId // Reference to Question
  createdAt: Date
  updatedAt: Date
}
```

## Features Implemented

✅ **1. User Registration**: Sign up using email & password  
✅ **2. User Login**: Sign in using email & password with JWT authentication  
✅ **3. Post Questions**: Create questions with title, content, and location  
✅ **4. Post Answers**: Reply to questions  
✅ **5. Location-Based Queries**: Get questions sorted by distance from user's location  
✅ **6. Favorite Questions**: Like/unlike questions (add/remove from favorites)  
✅ **7. View Favorites**: Display list of liked questions  
✅ **8. Remove from Favorites**: Remove questions from favorites list  

## Geospatial Features

The application uses MongoDB's geospatial indexes to efficiently query questions based on location:
- Questions are stored with GeoJSON Point format
- 2dsphere index on `location` field
- `$near` operator for proximity searches
- Results automatically sorted by distance

## Security

- Passwords are hashed using bcrypt (10 rounds)
- JWT tokens expire after 7 days
- Protected routes require valid JWT token
- Input validation on all endpoints using class-validator
- CORS enabled for frontend communication

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `404`: Not Found
- `409`: Conflict (duplicate entries)

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Additional Notes

### Distance Calculation
- Distances are calculated in meters
- MongoDB uses the WGS84 coordinate system
- Longitude comes before latitude in GeoJSON format

### Location Format
```json
{
  "longitude": -73.935242,  // East-West position
  "latitude": 40.730610      // North-South position
}
```

### Recommended Testing Tools
- **Postman**: For API testing
- **MongoDB Compass**: For database visualization
- **VS Code REST Client**: For in-editor API testing

## Future Enhancements (Optional)

- 🗺️ **Map Integration**: Display questions on Google Maps
- 🔍 **Search**: Full-text search for questions
- 📸 **Media Upload**: Allow images in questions/answers
- 🔔 **Notifications**: Real-time notifications for new answers
- ⭐ **Ratings**: Vote on answers
- 👤 **User Profiles**: Extended user information
- 🏷️ **Tags/Categories**: Organize questions by topics
