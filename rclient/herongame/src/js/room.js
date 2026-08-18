/*

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

*/

import { useEffect, useRef, useState, useCallback} from 'react';
import {io} from 'socket.io-client';

//import storycontroller and ink stuff

export function useGameSocket(serverURL = 'http://localhost:3000'){
    const [roomcode, setRoomcode] = useState(null);
    const [connected, setConnected] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [roomCapacity, setRoomCapacity] = useState(null);

    const socketRef = useRef(null);
    const storyRef = useRef(null); //this was s

    useEffect(() => {
        const socket = io(serverURL);
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected: ' + socket.id);
            setConnected(true);
        });

        socket.on('room_created', ({ code }) => {
            console.log(`Room created! Code: ${code} — share this with your friend`);
            setRoomCapacity(1);
            setRoomcode(code);
        });

        socket.on('room_joined', ({ code }) => {
            console.log(`Joined room: ${code}`);
            setRoomCapacity(1);
            setRoomcode(code);
        });

        socket.on('room_ready', ({ code }) => {
            console.log(`Both players in room ${code} — ready to start!`);
            setRoomCapacity(2);
            //wait a moment then trigger a switch to the new content side.
            //s = new StoryController(storyContent);
            //s.processStory();
        });

        socket.on('assign_role', (idnum) => {
            console.log(`accept role: ${idnum}`);
            //s.localvariablechange("role", (idnum ? "p2" : "p1"));
        });

        socket.on('supdate_var', (varname, value) => {
            //s.localvariablechange(varname, value);
        });

        socket.on('player_disconnected', () => {
            console.log('Other player disconnected');
        });

        socket.on('error', ({ message }) => {
            console.log('Error: ' + message);
            setErrorMessage(message);
        });

        return () => {
        socket.disconnect();
    };
    }, [serverURL]);

    //cleanup on unmount

    /* function createRoom() {
        socket.emit('create_room');
    }
    
    function joinRoom() {
        const code = document.getElementById('codeInput').value.toUpperCase();
        socket.emit('join_room', code);
    }

    function sendVar(varname, value) {
        socket.emit('cupdate_var', varname, value); 
    } */

    const createRoom = useCallback(() => {
        socketRef.current?.emit('create_room');
    }, []);

    const joinRoom = useCallback((code) => {
        socketRef.current?.emit('join_room', code);
    }, []);

    const sendVar = useCallback((varname, value) => {
        socketRef.current?.emit('cupdate_var', varname, value);
    }, []);

    return {
        roomcode,
        roomCapacity,
        connected,
        errorMessage,
        story: storyRef.current,
        createRoom,
        joinRoom,
        sendVar
    };
}