import {useEffect, useRef, useState, useCallback} from 'react';
import {io} from 'socket.io-client';
import { Story } from 'inkjs';
import StateCompare from "./statecompare"

//import 'ink'

//THIS IS A COPY OF THE OTHER GAME CONTROLLER, I'M CHANGING HOW CHOICES WORK IN THIS FILE

class GameController{
    constructor(storyJson, {onParagraph, onAnswer, onEnd} = {}){
        this.story = new Story(storyJson);
        console.log("constructed okay");
        this.onParagraph = onParagraph || (() => {});
        this.onAnswer = onAnswer || (() => {});
        this.onEnd = onEnd || (() => {});
        this.cindex = 0;
        this.changesset = "";

        this.socketRef = null;
        this.qindex = 0;
    }

    setSocket(socket){
        this.socket = socket;
    }

    advance(){
        const prestate = this.story.state.toJson();
        while(this.story.canContinue){
            const line = this.story.Continue();
            this.onParagraph(line);
        }
        this.qindex++;
        this.contPermission = false;

        //check for var changes.
        const poststate = this.story.state.toJson();

        this.changesset = StateCompare.compare(prestate, poststate)

        this.socket?.emit('cadvancecheck', this.changesset);
    }

    advanceApproved(){
        //handle timeout here! Call a function that makes a server request for timeout.
        const hasTimeout = this.story.currentChoices.some(choice => choice.text === "timeout");


        if(hasTimeout){
            console.log("timeout detected at " + this.qindex);
            this.socket?.emit('timerstart', this.qindex);
        }

        this.onAnswer(this.story.currentChoices);
    }

    choose(index){
        
       this.cindex = index;
       const buttonText = this.story.currentChoices[index].text;
       const prestate = this.story.state.toJson();
       
       //state saved, make choice.

       this.story.ChooseChoiceIndex(index);
       const ntext = this.story.Continue();
       if(ntext === "" || ntext !== buttonText)this.story.Continue(); //story has post choice content (uses [])

       //choice made, take post choice state:

       const poststate = this.story.state.toJson();

       //state compare:

       //revert to pre-choice made.
       this.story.state.LoadJson(prestate);
       
       //send changes to server with choice decision

       this.changesset = StateCompare.compare(prestate, poststate)

       this.socket?.emit('cchoicemade', this.changesset);
    }

    chooseOnPermission(){
        this.story.ChooseChoiceIndex(this.cindex);
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

    localsyncvariablechange(varname, value){
        if(this.changesset !== ""){
            const localc = JSON.parse(this.changesset);
            if(this.story.variablesState[varname] !== value){
                if(!(varname in localc)){
                    console.log(`variable changed: ${varname} -> ${value}`);
                    this.story.variablesState[varname] = value;
                }
            }
        }
    }
}

export default GameController;