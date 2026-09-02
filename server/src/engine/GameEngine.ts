export class GameEngine {
    private pids: string[];
    private queindex: number;
    private tlength: number;
    private answered: number;
    private changes: string[];
    private advanceCheck: number;

    constructor() { //TODO update to handle games with more than two.
        this.pids = ["", ""];
        this.changes = [];
        this.queindex = 0;
        this.tlength = 50000;
        this.answered = 0;
        this.advanceCheck = 0;
    }

    setPlayer(id: number, name: string){
        this.pids[id] = name;
    }

    //tell when to advance
    ansSubmit(changesmade: string): boolean{
        this.answered++;
        this.changes.push(changesmade);

        if(this.answered === this.pids.length){
            this.answered = 0;
            return true;
        } else {
            return false;
        }
    }

    advCheckup(changesmade: string): boolean{
        this.advanceCheck++;
        this.changes.push(changesmade);

        if(this.advanceCheck === this.pids.length){
            this.advanceCheck = 0;
            return true;
        } else {
            return false;
        }
    }

    getChanges(): string[]{
        console.log(this.changes);
        return this.changes;
    }

    clearChanges(){
        this.changes = [];
    }

    //timerindex of current
    timercheck(id: number): Promise<boolean>{
        if(id === this.queindex){
            return Promise.resolve(false);
        } else {
            this.queindex = id;
            //wait tlength amount
            console.log("waiting...");

            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log("waiting finished.");
                    resolve(id === this.queindex);
                }, this.tlength);
            });

        }
    }


}