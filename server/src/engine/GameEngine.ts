import personalityData from '../story/scenes.json' with { type: "json"};

//frame type

//export type = 

export interface defaultChoice {
    id: string;
    label: string;
    subtext: string | null;
}

export interface defaultQuestion {
    id: string;
    type: string;
    reveal: boolean;
    answers: defaultChoice[];
    style: string;
}

export interface defaultSet{
    questions: defaultQuestion[];
}

export class GameEngine {
    private personalityQuestion: defaultQuestion;

    constructor() {
        this.personalityQuestion = personalityData as defaultQuestion;
    }

    getOpeningFrame(): defaultQuestion {
    return this.personalityQuestion;
    }
}