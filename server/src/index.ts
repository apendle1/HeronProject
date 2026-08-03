import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { GameEngine } from './engine/GameEngine.ts';

const app = express();
const httpServer = createServer(app);

app.use(cors({origin: "*"}));

interface Room{
    code: string,
    players: string[]; //socket ids
    gameEngine: GameEngine;
}

const rooms = new Map<string, Room>();
const playerRooms = new Map<string, string>(); //socket.id -> room code

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
  //playerRooms.set(socket.id, "");
  
  //player 1 creates room
  socket.on('create_room', ()=>{
    leaveCurrentRoom(socket);

    const code = generateRoomCode();
    const room: Room = {code, players: [socket.id], gameEngine: new GameEngine};
    rooms.set(code, room);
    socket.join(code);
    playerRooms.set(socket.id, code);
    socket.emit('room_created', { code });
    console.log(`Room ${code} created by ${socket.id}`);
    room.gameEngine.setPlayer(0, socket.id)
  });

  //player 2 joins room
  socket.on('join_room', (code: string)=>{
    leaveCurrentRoom(socket);
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
    room.gameEngine.setPlayer(1, socket.id);
    console.log(`Player count: ${room.players.length}`)
    socket.join(code);
    playerRooms.set(socket.id, code);
    socket.emit('room_joined', { code });

    //notify players that the room is ready
    io.to(code).emit('room_ready', {code});
    console.log(`Room ${code} is ready`);

    //TODO assign roles
    for(let i = 0; i < room.players.length; i++){
      const target = room.players[i];
      if(!target)continue;
      io.to(target).emit('assign_role', i);
      console.log(`role assigned to ${target}: ${i}`);
    }

    /*

    //This logic is for a previous version of server. Game States are now held locally.
    room.gameEngine = new GameEngine(room.players[0]!, room.players[1]!);
    console.log(`room players: ${room.players[0]}, ${room.players[1]}`);

    outputFrame(code, room.gameEngine);
    */
  });

  socket.on('disconnect', ()=> {
    //clean up
    leaveCurrentRoom(socket);
    playerRooms.delete(socket.id);
    console.log(`Disconnected ${socket.id}`);
  });

  socket.on('cupdate_var', (varname: string, value: string)=>{
    //TODO go to room in game engine, get other players to send out var to.
    console.log(`Received Var ${varname}: ${value} from ${socket.id}`);
  });
});

app.get('/test', (req, res) => {
    res.sendFile(process.cwd() + '/test.html');
});

httpServer.listen(3000, () => {
  console.log('Server running on port 3000');
});