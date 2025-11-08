# Poker Backend with Redis

## Project Structure

```
backend/
├── src/
│   ├── controllers/       # Request handlers
│   │   └── testRedis.controller.ts
│   ├── routes/           # Route definitions
│   │   └── testRedis.route.ts
│   ├── utils/            # Utilities (Redis client)
│   │   └── redis.ts
│   └── index.ts          # Main server file
├── docker-compose.yml    # Redis Docker setup
├── package.json
├── tsconfig.json
└── .env.example          # Environment variables template
```

## Setup

1. **Copy environment variables:**
```bash
cp .env.example .env
```

2. **Start Redis with Docker:**
```bash
docker-compose up -d
```

3. **Install dependencies:**
```bash
npm install
```

4. **Run the development server:**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## Environment Variables

- `PORT` - Server port (default: 5000)
- `REDIS_URL` - Redis connection URL (default: redis://localhost:6379)

## API Endpoints

### Health Check
- `GET /health` - Server health check

### Redis Operations
- `POST /redis/test` - Test Redis read/write
- `POST /redis/write` - Write to Redis
  - Body: `{ "key": "string", "value": "string" }`
- `GET /redis/read/:key` - Read from Redis

## Testing Redis

### Using curl:
```bash
# Test endpoint
curl -X POST http://localhost:5000/redis/test

# Write data
curl -X POST http://localhost:5000/redis/write \
  -H "Content-Type: application/json" \
  -d '{"key":"mykey","value":"myvalue"}'

# Read data
curl http://localhost:5000/redis/read/mykey
```

## Docker Commands

```bash
# Start Redis
docker-compose up -d

# Stop Redis
docker-compose down

# View logs
docker-compose logs -f

# Check Redis status
docker-compose ps
```
