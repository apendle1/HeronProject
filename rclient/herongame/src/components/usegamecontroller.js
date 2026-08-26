import { useRef, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import GameController from './gamecontroller';

export function useGameController(storycontent, { setCurrentPage }, serverURL = 'http://localhost:3000'){
    const controllerRef = useRef(null);
    if(controllerRef.current === null){
        controllerRef.current = new GameController(storycontent, {
            onParagraph: (text) => setParagraphs(prev => [...prev, text]),
            onAnswer: (c) => setAnswers(c),
        });
    }

    const [paragraphs, setParagraphs] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [roomcode, setRoomcode] = useState(null);
    const [connected, setConnected] = useState(null);
    const [roomCapacity, setRoomCapacity] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const initRef = useRef(false);
    useEffect(() => {
        if (initRef.current) return;
        initRef.current = true;

        controllerRef.current.tracking();
        controllerRef.current.advance();
    }, []);

    // socket lifecycle
    useEffect(() => {
        const controller = controllerRef.current;
        const socket = io(serverURL);
        controller.setSocket(socket);

        socket.on('connect', () => setConnected(true));

        socket.on('room_created', ({ code }) => {
        setRoomCapacity(1);
        setRoomcode(code);
        });

        socket.on('room_joined', ({ code }) => {
        setRoomCapacity(1);
        setRoomcode(code);
        });

        socket.on('room_ready', () => setRoomCapacity(2));

        socket.on('assign_role', (idnum) => {
        setCurrentPage("story");
        controller.localvariablechange("role", idnum ? "p1" : "p1");
        });

        socket.on('supdate_var', (varname, value) => {
        controller.localvariablechange(varname, value);
        });

        socket.on('player_disconnected', () => {
        console.log('Other player disconnected');
        });

        socket.on('error', ({ message }) => setErrorMessage(message));

        return () => {
        socket.disconnect();
        };
    }, [serverURL, setCurrentPage]);

    const createRoom = useCallback(() => {
        controllerRef.current.socket?.emit('create_room');
    }, []);

    const joinRoom = useCallback((code) => {
        controllerRef.current.socket?.emit('join_room', code);
    }, []);

    return {
        controllerRef,
        paragraphs,
        answers,
        roomcode,
        roomCapacity,
        connected,
        errorMessage,
        createRoom,
        joinRoom,
    
    };
}