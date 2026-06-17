import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);

app.use(cors({origin: "*"}));

interface Room{
    code: string,
    players: string[]; //socket ids
}

const rooms = new Map<string, Room>();
const playerRooms = new Map<string, string | null>(); //socket.id -> room code

function generateRoomCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function leaveCurrentRoom(socket: Socket) {
  const currentCode = playerRooms.get(socket.id);
  if(!currentCode) return;

  const room = rooms.get(currentCode);
  if (room) {
    socket.to(currentCode).emit('player_disconnected');

    rooms.delete(currentCode);
  }
}

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);
  playerRooms.set(socket.id, null);
  
  //player 1 creates room
  socket.on('create_room', ()=>{
    leaveCurrentRoom(socket);

    const code = generateRoomCode();
    const room: Room = {code, players: [socket.id]};
    rooms.set(code, room);
    socket.join(code);
    playerRooms.set(socket.id, code);
    socket.emit('room_created', { code });
    console.log(`Room ${code} created by ${socket.id}`);
  });

  //player 2 joins room
  socket.on('join_room', (code: string)=>{
    const room = rooms.get(code);

    if(!room){
        socket.emit('error', {message: 'Room not found'});
        return;
    }

    if(room.players.length >= 2) {
        socket.emit('error', {message: 'Room is full'});
        return;
    }

    room.players.push(socket.id);
    console.log(`Player count: ${room.players.length}`)
    socket.join(code);
    playerRooms.set(socket.id, code);
    socket.emit('room_joined', { code });

    //notify players that the room is ready
    io.to(code).emit('room_ready', {code});
    console.log(`Room ${code} is ready`);
  });

  socket.on('disconnect', ()=> {
    //clean up
    leaveCurrentRoom(socket);
    playerRooms.delete(socket.id);
    console.log(`Disconnected ${socket.id}`);
  });
});

app.get('/test', (req, res) => {
    res.sendFile(process.cwd() + '/test.html');
});

httpServer.listen(3000, () => {
  console.log('Server running on port 3000');
});