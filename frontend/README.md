# AskAround Frontend

A modern, responsive location-based Q&A platform built with React, TypeScript, and cutting-edge web technologies. Features an interactive map interface with real-time geolocation and beautiful UI/UX.

## Features

- **Interactive Map**: Leaflet-powered map with custom markers and clustering
- **Marker Clustering**: Automatic grouping of nearby questions for better UX
- **Geolocation**: Real-time user location tracking
- **Authentication**: Secure JWT-based login/register system
- **Question Management**: Create, view, and search questions by location
- **Answer System**: Add and view answers to questions
- **Favorites System**: Save and manage favorite questions
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion for delightful interactions
- **Modern UI**: Clean, professional design with navy/teal theme
- **TypeScript**: Full type safety throughout

## Tech Stack

### Core
- **React** 19.2.0 - UI framework
- **TypeScript** 5.x - Type safety
- **Vite** 7.2.4 - Build tool & dev server

### Mapping
- **Leaflet** 1.9.4 - Interactive maps
- **React Leaflet** 4.2.1 - React bindings for Leaflet
- **React Leaflet Cluster** 3.0.0 - Marker clustering

### Styling
- **Tailwind CSS** 4.1.18 - Utility-first CSS framework
- **Framer Motion** 12.0.5 - Animation library
- **Lucide React** 0.469.0 - Icon library

### State & Data
- **Axios** 1.8.0 - HTTP client
- **React Router DOM** 7.6.2 - Routing
- **Context API** - Global state management

### Utilities
- **clsx** - Conditional classnames
- **tailwind-merge** - Tailwind class merging
- **sonner** - Toast notifications

### Development
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript linting
- **Vite PWA Plugin** - Progressive Web App support

## Project Structure

```
frontend/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images, fonts, etc.
│   │
│   ├── components/         # React components
│   │   ├── ui/             # Reusable UI components
│   │   │   ├── Button.tsx      # Custom button component
│   │   │   ├── Card.tsx        # Card container
│   │   │   └── Input.tsx       # Form input
│   │   ├── CreateQuestionModal.tsx  # Question creation modal
│   │   └── Map.tsx             # Main map component with clustering
│   │
│   ├── context/                # React Context providers
│   │   └── AuthContext.tsx     # Authentication state & methods
│   │
│   ├── hooks/                  # Custom React hooks
│   │   └── useGeolocation.ts   # Browser geolocation hook
│   │
│   ├── lib/                   # Utilities
│   │   └── utils.ts           # Helper functions (cn, etc.)
│   │
│   ├── pages/                 # Route pages
│   │   ├── AuthPage.tsx       # Login/Register page
│   │   ├── FavoritesPage.tsx  # User's saved questions
│   │   ├── HomePage.tsx       # Main map view
│   │   └── QuestionPage.tsx   # Question details
│   │
│   ├── services/             # API service layer
│   │   ├── api.ts            # Axios instance & interceptors
│   │   ├── auth.service.ts   # Authentication API calls
│   │   ├── questions.service.ts  # Questions API calls
│   │   └── answers.service.ts    # Answers API calls
│   │
│   ├── App.tsx             # Root component with routes
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles & Tailwind imports
│
├── .env                    # Environment variables
├── .env.example            # Environment template
├── index.html              # HTML entry point
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
├── eslint.config.js        # ESLint configuration
├── Dockerfile              # Docker configuration
├── nginx.conf              # Production Nginx config
└── package.json            # Dependencies & scripts
```

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Backend API running (see backend/README.md)

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open http://localhost:5173 in your browser
   - Allow location permissions when prompted
   - Register or login to start using the app

### Quick Start with Docker

```bash
# From project root
docker-compose up -d

# Frontend will be available at http://localhost:5173
```

## Environment Variables

| Variable       | Description          | Default                 | Required |
|----------------|----------------------|-------------------------|----------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000` | Yes      |

### Production Environment

```env
VITE_API_URL=https://api.yourdomain.com
```

## Components

### UI Components

#### Button
Reusable button component with variants:
```tsx
<Button variant="primary" size="lg" onClick={handleClick}>
  Click Me
</Button>
```

Variants: `primary`, `secondary`, `ghost`  
Sizes: `sm`, `md`, `lg`

#### Card
Container component for content:
```tsx
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
  </Card.Header>
  <Card.Content>Content here</Card.Content>
</Card>
```

#### Input
Form input with label and error states:
```tsx
<Input
  type="email"
  label="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={error}
/>
```

### Feature Components

#### Map
Main interactive map component with Leaflet and marker clustering:
```tsx
<Map
  questions={questions}
  onMarkerClick={handleMarkerClick}
  userLocation={userLocation}
/>
```

Features:
- Custom styled markers (navy/teal theme)
- Marker clustering for 5+ nearby questions
- Spiderfy animation for overlapping markers
- Zoom controls
- Attribution

#### CreateQuestionModal
Modal for creating new questions:
```tsx
<CreateQuestionModal
  isOpen={isOpen}
  onClose={handleClose}
  onSubmit={handleSubmit}
  userLocation={userLocation}
/>
```

## State Management

### AuthContext

Global authentication state using React Context API:

```tsx
const { user, token, login, register, logout, isAuthenticated } = useAuth();
```

Methods:
- `login(email, password)` - Authenticate user
- `register(name, email, password)` - Create new account
- `logout()` - Clear session
- `isAuthenticated` - Boolean authentication status

State persisted to localStorage for session management.

### Local State

Pages use `useState` and `useEffect` for component-level state:
- Questions list
- Favorites list
- Form inputs
- Loading states
- Error states

## Services

### API Service (`api.ts`)

Centralized Axios instance with interceptors:

```typescript
// Automatic token injection
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handling
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirect to login
    }
    return Promise.reject(error);
  }
);
```

### Auth Service

```typescript
authService.register(name, email, password)
authService.login(email, password)
```

### Questions Service

```typescript
questionsService.getNearbyQuestions(lat, lng, maxDistance)
questionsService.createQuestion(title, content, lat, lng)
questionsService.getQuestionById(id)
```

### Answers Service

```typescript
answersService.createAnswer(questionId, content)
answersService.getAnswersForQuestion(questionId)
```

## Styling

### Tailwind CSS

Utility-first CSS framework with custom configuration:

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        navy: '#1D546D',
        teal: '#5F9598',
        dark: '#061E29',
        light: '#F3F4F4',
      },
    },
  },
}
```

### Design System

#### Colors
- **Navy** (`#1D546D`) - Primary brand color
- **Teal** (`#5F9598`) - Secondary/accent color
- **Dark** (`#061E29`) - Text and backgrounds
- **Light** (`#F3F4F4`) - Backgrounds and borders

#### Typography
- Font Family: System font stack for performance
- Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

#### Spacing
Standard Tailwind spacing scale (0.25rem increments)

### Animations

Framer Motion for smooth transitions:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

## Map Integration

### Leaflet Setup

```tsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

<MapContainer center={[lat, lng]} zoom={13}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  <MarkerClusterGroup>
    {questions.map(q => (
      <Marker key={q.id} position={[q.latitude, q.longitude]}>
        <Popup>{q.title}</Popup>
      </Marker>
    ))}
  </MarkerClusterGroup>
</MapContainer>
```

### Custom Cluster Styling

```css
.marker-cluster {
  background: linear-gradient(135deg, #1D546D 0%, #5F9598 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Geolocation Hook

```tsx
const { location, error, loading } = useGeolocation();

// location: { latitude, longitude }
// error: string | null
// loading: boolean
```

## Build

### Development Build

```bash
npm run dev
# Runs on http://localhost:5173 with hot reload
```

### Production Build

```bash
npm run build
# Creates optimized build in dist/
```

### Preview Production Build

```bash
npm run preview
# Preview production build locally
```

### Linting

```bash
npm run lint
# Run ESLint on all TypeScript/TSX files
```

### Docker Build

```bash
# Development
docker build --target development -t askaround-frontend:dev .
docker run -p 5173:5173 askaround-frontend:dev

# Production
docker build --target production -t askaround-frontend:prod .
docker run -p 80:80 askaround-frontend:prod
```

## Scripts

| Command           | Description                          |
|-------------------|--------------------------------------|
| `npm run dev`     | Start development server (port 5173) |
| `npm run build`   | Build for production                 |
| `npm run preview` | Preview production build             |
| `npm run lint`    | Lint code with ESLint                |

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Troubleshooting

### Map Not Displaying

1. Check Leaflet CSS is imported:
   ```tsx
   import 'leaflet/dist/leaflet.css';
   ```

2. Verify container has height:
   ```css
   .map-container {
     height: 100vh;
     width: 100%;
   }
   ```

### Location Permission Denied

```typescript
// Handle geolocation errors
if (error) {
  console.error('Geolocation error:', error);
  // Fallback to default location
}
```

### API Connection Issues

1. Check VITE_API_URL in `.env`
2. Verify backend is running
3. Check CORS configuration on backend
4. Inspect network requests in DevTools

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### TypeScript Errors

```bash
# Regenerate TypeScript cache
rm -rf node_modules/.vite
npm run dev
```