# Poker Application

A full-stack poker application with Redis integration.

## Project Structure

```
poker/
├── backend/          # Express + TypeScript + Redis backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utilities (Redis client)
│   │   └── index.ts        # Main server
│   ├── docker-compose.yml  # Redis setup
│   └── package.json
│
└── frontend/         # Next.js frontend
    ├── src/
    │   └── app/
    │       ├── page.tsx        # Home page
    │       └── RedisTest.tsx   # Redis test component
    └── package.json
```

## Quick Start

### Prerequisites
- Node.js (v18+)
- Docker and Docker Compose
- npm or yarn

### 1. Start Redis

```bash
cd backend
docker-compose up -d
```

### 2. Setup Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Setup Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Test Redis Connection

1. Open http://localhost:3000 in your browser
2. Click the "Test Redis Read/Write" button
3. You should see a success message with the test results

## API Endpoints

**Backend (Port 5000):**
- `GET /health` - Health check
- `POST /redis/test` - Test Redis read/write
- `POST /redis/write` - Write to Redis
- `GET /redis/read/:key` - Read from Redis

## Environment Variables

### Backend (.env)
```
PORT=5000
REDIS_URL=redis://localhost:6379
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Tech Stack

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Redis** - In-memory data store
- **Docker** - Container platform

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## Development

### Backend Commands
```bash
npm run dev    # Run development server
npm run build  # Build for production
npm start      # Run production server
```

### Frontend Commands
```bash
npm run dev    # Run development server
npm run build  # Build for production
npm start      # Run production server
```

### Docker Commands
```bash
docker-compose up -d    # Start Redis
docker-compose down     # Stop Redis
docker-compose logs -f  # View logs
docker-compose ps       # Check status
```

## License

MIT
