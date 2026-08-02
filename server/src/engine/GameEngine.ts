export class GameEngine {
    private pOne: string;
    private pTwo: string;

    constructor(player1: string, player2: string) { //TODO update to handle games with more than two.
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
}