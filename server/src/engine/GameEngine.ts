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

//frame

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

    constructor() {
        this.frameset = personalityData as defaultFrameSet;
        this.frameindex = -1;
    }

    getOpeningFrame(): frame {
        return this.frameset.frames[0]!;
    }

    getFrame(): frame{
        this.frameindex++;
        return this.frameset.frames[this.frameindex]!;
    }

}