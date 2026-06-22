import personalityData from '../story/scenes.json' with { type: "json"};

//every frame has an id, type, and style. perhaps I make it its own thing. idtag?

export interface idtag {
    id: string;
    type: string;
    style: string;
}

export interface choiceidtag{
    id: string;
    type: string;
}

//default question

export interface defaultQuestion {
    identity: idtag;
    reveal: boolean;
    answers: choice[];
    text: string;
}

//TF Question

export interface defaultTF {
    identity: idtag;
    reveal: boolean;
}

//textbox question

export interface defaultTextbox {
    identity: idtag;
    reveal: boolean;
    size: number;
}

//pure text

export interface defaultText {
    identity: idtag;
    text: string;
}

//choice types

//multi choice type

export interface defaultChoice {
    identity: choiceidtag;
    label: string;
    subtext: string | null;
}

//textbox choice

export interface defaultTBChoice {
    identity: choiceidtag;
    label: string;
    default: string | null;
}

//recording a choice
export interface choiceTag {
    playerid: string;
    choiceid: string;
}

export interface choiceStringValue {
    value: string;
}

export interface choiceTFValue {
    value: boolean;
}

//frame

export type choicerecord = {value: string} | {value: boolean};
export type choice = defaultChoice | defaultTBChoice | null;
export type frame = {identity: {id: string; type: 'defaultQuestion'; style: string}; reveal: boolean; answers: choice[]; text: string} //default choice
    | {identity: {id: string; type: 'defaultText'; style: string}; text: string}; //default text

//frame set

export interface defaultFrameSet{
    frames: frame[];
}

export class GameEngine {
    //private personalityQuestion: defaultQuestion;
    private frameset: defaultFrameSet;
    private frameindex: number;
    #pcstorage = new Map<string, choicerecord>;
    private pOne: string;
    private pTwo: string;

    constructor(player1: string, player2: string) {
        this.frameset = personalityData as defaultFrameSet;
        this.frameindex = -1;
        this.#pcstorage = new Map<string, choicerecord>;
        this.pOne = player1;
        this.pTwo = player2;
    }

    setPlayer(id: number, name: string){
        switch(id){
            case 1:
                this.pOne = name;
                break;
            case 2:
                this.pTwo = name;
                break;
        }
    }

    getOpeningFrame(): frame {
        return this.frameset.frames[0]!;
    }

    getFrame(): frame{
        this.frameindex++;
        return this.frameset.frames[this.frameindex]!;
    }

    private toKey(pid: string, qid: string) : string {
        return `${pid}::${qid}`
    }

    //record answer, move on when it receives two answers (by returning a boolean)
    recordResponse(pid: string, qid: string, value: string | boolean){
        this.#pcstorage.set(this.toKey(pid, qid), {value: value});
        //console.log(`recording: ${pid} : ${this.pOne}, ${qid}, ${value}, ${this.#pcstorage.has({playerid: this.pOne, choiceid: qid})}`);
        if(this.#pcstorage.has(this.toKey(this.pOne, qid)) && this.#pcstorage.has(this.toKey(this.pTwo, qid))){
            return true;
        }
        return false;
    }
}