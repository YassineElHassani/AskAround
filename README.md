# AskAround

AskAround is a location-based Q&A platform that allows users to ask questions related to their surroundings and receive answers from nearby users. Built with modern web technologies, it combines real-time geospatial queries with an intuitive map interface.

## Features

- **Location-Based Questions**: Ask and discover questions based on your current location
- **Interactive Map**: Visualize questions on an interactive Leaflet map with clustering
- **Secure Authentication**: JWT-based authentication system
- **Favorites System**: Save and manage your favorite questions
- **Real-time Answers**: Post and browse answers with nested reply support
- **Modern UI**: Clean, responsive design with Tailwind CSS and Framer Motion animations

## Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **MongoDB** - NoSQL database with geospatial indexing (2dsphere)
- **Passport JWT** - Authentication strategy
- **TypeScript** - Type-safe development

### Frontend
- **React 19** - Modern UI library
- **Vite** - Fast build tool
- **Tailwind CSS 4** - Utility-first styling
- **Leaflet** - Interactive maps
- **React Leaflet Cluster** - Map marker clustering
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB 7.0+
- Docker & Docker Compose (optional)

### Installation

#### Run the whole project using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/YassineElHassani/AskAround.git
cd AskAround

# Start all services with Docker Compose
docker-compose up -d

# Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/askaround
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
PORT=3000
```

## Project Structure

```
AskAround/
├── backend/             # NestJS backend application
│   ├── src/
│   │   ├── answers/     # Answers module
│   │   ├── auth/        # Authentication module
│   │   ├── questions/   # Questions module with geospatial queries
│   │   ├── users/       # Users module
│   │   └── common/      # Shared decorators and utilities
│   ├── test/            # E2E tests
│   └── Dockerfile       # Backend container configuration
├── frontend/            # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service layer
│   │   ├── context/     # React context (Auth)
│   │   └── hooks/       # Custom React hooks
│   └── Dockerfile       # Frontend container configuration
└── docker-compose.yml   # Multi-container orchestration
```

## API Endpoints

**Key Endpoints:**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /questions` - Get questions by location (with radius filtering)
- `POST /questions` - Create a new question
- `POST /answers` - Post an answer to a question
- `GET /users/me` - Get current user profile
- `POST /users/favorites/:questionId` - Add question to favorites
