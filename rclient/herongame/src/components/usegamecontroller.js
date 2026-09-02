import { useRef, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import GameController from './gamecontrollerc';

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
        controllerRef.current.advance();
        setCurrentPage("story");
        controller.localvariablechange("role", idnum ? "p2" : "p1");
        });

        socket.on('supdate_var', (varname, value) => {
        controller.localvariablechange(varname, value);
        });

        socket.on('player_disconnected', () => {
        console.log('Other player disconnected');
        });

        socket.on('sgive_permission', (changes) => {
        console.log('Server gave permission for choice');
        console.log(changes);
        for(var c of changes){
            const log = JSON.parse(c);
            for(var key in log){
                controller.localsyncvariablechange(key, log[key]);
            }
        }
        controller.chooseOnPermission();
        controller.advance();
        });

        socket.on('sadv_permission', (changes) => {
        console.log('Server gave permission for advance');
        console.log(changes);
        for(var c of changes){
            const log = JSON.parse(c);
            for(var key in log){
                controller.localsyncvariablechange(key, log[key]);
            }
        }
        //controller.chooseOnPermission();
        controller.advanceApproved();
        });

        socket.on('timer_up', () => {
            console.log("server says time is up");
            //choose timeout.
            controller.actTimeout();
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