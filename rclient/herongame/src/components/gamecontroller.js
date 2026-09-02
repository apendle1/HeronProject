import {useEffect, useRef, useState, useCallback} from 'react';
import {io} from 'socket.io-client';
import { Story } from 'inkjs';
import StateCompare from "./statecompare"

//import 'ink'

//TODO redesign the observer system, the listener is not accurate enough to be running a reload system the way I set it up.
//Adjust to manual reading via state json so there can be more control over it.

class GameController{
    constructor(storyJson, {onParagraph, onAnswer, onEnd} = {}){
        this.story = new Story(storyJson);
        console.log("constructed okay");
        this.onParagraph = onParagraph || (() => {});
        this.onAnswer = onAnswer || (() => {});
        this.onEnd = onEnd || (() => {});
        this.varRegistry = {};
        this.lock = false;

        this.socketRef = null;
        this.qindex = 0;
    }

    setSocket(socket){
        this.socket = socket;
    }

    tracking(){

        const varnames = Array.from(this.story.variablesState._globalVariables.keys());
        //console.log("varnames length:", varnames.length);

        const cvariablechange = (varname, value) =>{
            if(!this.lock){
                console.log(`variable changed: ${varname} -> ${value} and lock is ${this.lock}`);
                this.socket?.emit('cupdate_var', varname, value);
            }
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
        this.qindex++;
        this.contPermission = false;
        //handle timeout here! Call a function that makes a server request for timeout.
        const hasTimeout = this.story.currentChoices.some(choice => choice.text === "timeout");

        if(hasTimeout){
            console.log("timeout detected at " + this.qindex);
            this.socket?.emit('timerstart', this.qindex);
        }

        this.onAnswer(this.story.currentChoices);
    }

    choose(index){
        this.story.ChooseChoiceIndex(index);
        this.socket?.emit('cchoicemade');
        //save state, continue one step, turn of var listener, load state, turn on var listener.
        const a = this.story.state.toJson();

        console.log(StateCompare.stripVal(a));
        console.log("peeked:" + this.story.Continue());
        this.lock = true;
        this.story.state.LoadJson(a);
        this.lock = false;
    }

    actTimeout(){
        const tIndex = this.story.currentChoices.findIndex(choice => choice.text === "timeout");
        this.choose(tIndex);
    }

    localvariablechange(varname, value){
        if(this.story.variablesState[varname] !== value){
            console.log(`variable changed: ${varname} -> ${value}`);
            this.story.variablesState[varname] = value;
        }
    }
}

export default GameController;