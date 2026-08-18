

const socket = io('http://localhost:3000');
let roomcode = null;
let s = null;

socket.on('connect', () => console.log('Connected: ' + socket.id));

socket.on('room_created', ({ code }) => {
    console.log(`Room created! Code: ${code} — share this with your friend`);
    roomcode = code;
});

socket.on('room_joined', ({ code }) => {
    console.log(`Joined room: ${code}`);
    roomcode = code;
});

socket.on('room_ready', ({ code }) => {
    console.log(`Both players in room ${code} — ready to start!`);
    s = new StoryController(storyContent);
    s.processStory();
});

socket.on('assign_role', (idnum) => {
    console.log(`accept role: ${idnum}`);
    s.localvariablechange("role", (idnum ? "p2" : "p1"));
});

socket.on('supdate_var', (varname, value) => {
    s.localvariablechange(varname, value);
});

socket.on('player_disconnected', () => {
    console.log('Other player disconnected');
});

socket.on('error', ({ message }) => {
    console.log('Error: ' + message);
});


function createRoom() {
    socket.emit('create_room');
}

function joinRoom() {
    const code = document.getElementById('codeInput').value.toUpperCase();
    socket.emit('join_room', code);
}

function sendVar(varname, value) {
    socket.emit('cupdate_var', varname, value);
}

//socket emit will happen when variables update.