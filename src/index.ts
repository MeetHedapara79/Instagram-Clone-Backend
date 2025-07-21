import express from 'express';
import { PrismaClient } from './generated/prisma';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './routes';
import 'dotenv/config';
import { setTimeout } from "timers/promises";
import { redis } from './redisClient';
import os from 'os';
import { Server as SocketServer } from 'socket.io';
import http from 'http';
import { createMessageService } from './services/chat.service';

const app = express();
const allowedOrigins = [
  "https://localhost:4200",
  "https://instagram-clone-frontend-production.up.railway.app",
  "http://localhost:4200",
  "http://instagram-clone-frontend-production.up.railway.app"
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: '*',
  }
});
const PORT = process.env['PORT'] || 3000;

const onlineUsers = new Map<string, string>();
io.on('connection', (socket) => {

  socket.on('register_user', (userId: string) => {
    onlineUsers.set(userId, socket.id);
  });

  // Listen for a message to be sent
  socket.on('send_message', async (data) => {
    const { senderId, receiverId, content, postId } = data;

    try {
      // Create the new message
      const newMessage = await createMessageService(senderId, receiverId, content, postId);

      // Emit the new message to the receiver's socket
      if('content' in newMessage){
        // Join sender to room
        socket.join(newMessage.conversationId);
        // If receiver is online, join them to the room
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          const receiverSocket = io.sockets.sockets.get(receiverSocketId);
          if (receiverSocket) {
            receiverSocket.join(newMessage.conversationId);
          }
        }
    
        io.to(newMessage.conversationId).emit('new_message', newMessage);
        
      } else {
        console.error('Error: newMessage does not have a content property:', newMessage);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // Handle user joining a conversation for real-time updates
  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
  });

  socket.on('disconnect', () => {
    // Remove user from online map
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

const prisma = new PrismaClient()

// Function to wait for the database to be ready
async function waitForDatabase(retries = 60, delayMs = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      // Perform a simple query to check DB connection
      await prisma.$queryRaw`SELECT 1`;
      console.log("✅ Connected to the database");
      return;
    } catch (err) {
      console.warn(`⏳ Waiting for DB... (${i + 1}/${retries})`);
      console.error(err);
      await setTimeout(delayMs);
    }
  }
  throw new Error("❌ Could not connect to the database.");
}

// Function to wait for Redis to be ready
async function waitForRedis(retries = 60, delayMs = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      // Try a simple Redis command (ping)
      await redis.ping();
      console.log("✅ Connected to Redis");
      return;
    } catch (err) {
      console.warn(`⏳ Waiting for Redis... (${i + 1}/${retries})`);
      console.error(err);
      await setTimeout(delayMs);
    }
  }
  throw new Error("❌ Could not connect to Redis.");
}


async function main() {
    await waitForDatabase();
    await waitForRedis();
    

// Function to get the local IP address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  let ipAddress = '';

  for (const interfaceName in interfaces) {
    const interfaceInfo = interfaces[interfaceName];
    if (!interfaceInfo) continue;
    for (const i of interfaceInfo) {
      if (i.family === 'IPv4' && !i.internal) {
        ipAddress = i.address;
        break;
      }
    }
  }

  return ipAddress;
}

// Example usage
const localIp = getLocalIpAddress();
console.log('Local IP Address:', localIp);

    app.use("/api", router);
    server.listen(PORT, async () => {
      console.log(`Server is running with WebSocket on http://localhost:${PORT}`);
    });    
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

