import express, { Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectRedis } from './utils/redis';
import { setupSocketHandlers } from './controllers/socket.controller';

// Bun automatically loads .env files
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

setupSocketHandlers(io);

const startServer = async () => {
    try {
        await connectRedis();
        httpServer.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`Socket.IO ready for connections`);
            console.log(`Health check: GET http://localhost:${PORT}/health`);
        }).on('error', (err: any) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use. Please free the port or use a different one.`);
            } else {
                console.error('Failed to start server:', err);
            }
            process.exit(1);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
