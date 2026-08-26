import {useEffect, useRef, useState, useCallback} from 'react';
import {io} from 'socket.io-client';
import { Story } from 'inkjs';

//import 'ink'

class GameController{
    constructor(storyJson, {onParagraph, onAnswer, onEnd} = {}){
        this.story = new Story(storyJson);
        console.log("constructed okay");
        this.onParagraph = onParagraph || (() => {});
        this.onAnswer = onAnswer || (() => {});
        this.onEnd = onEnd || (() => {});
        this.varRegistry = {};

        this.socketRef = null;
    }

    setSocket(socket){
        this.socket = socket;
    }

    tracking(){

        const varnames = Array.from(this.story.variablesState._globalVariables.keys());
        //console.log("varnames length:", varnames.length);

        const cvariablechange = (varname, value) =>{
            //TODO send json stringify for a list change.
            console.log(`variable changed: ${varname} -> ${value}`);

            this.socket?.emit('cupdate_var', varname, value);
        }

        for (let varname of varnames){
            console.log(`added tracker: ${varname}`);
            if(varname !== "role"){
                this.varRegistry[varname] = this.story.variablesState[varname];

                this.story.ObserveVariable(varname, (name, newValue) => {
                    cvariablechange(varname, newValue);
                    this.varRegistry[varname] = newValue;
                });
            }
        }
    }

    advance(){
        while(this.story.canContinue){
            const line = this.story.Continue();
            this.onParagraph(line);
        }

        //handle timeout here! Call a function that makes a server request for timeout.
        this.onAnswer(this.story.currentChoices);
    }

    choose(index){
        this.story.ChooseChoiceIndex(index);
        this.advance();
    }

    localvariablechange(varname, value){
        if(this.story.variablesState[varname] !== value){
            console.log(`variable changed: ${varname} -> ${value}`);
            this.story.variablesState[varname] = value;
        }
    }
}

export default GameController;