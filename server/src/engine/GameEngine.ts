export class GameEngine {
    private pids: string[];

    constructor() { //TODO update to handle games with more than two.
        this.pids = ["", ""];
    }

    setPlayer(id: number, name: string){
        this.pids[id] = name;
    }
}