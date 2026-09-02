class StateCompare{
    static compare(preChoice, postChoice){
        //preChoice json vs postChoice json state

        const prec = StateCompare.stripVal(preChoice);
        const postc = StateCompare.stripVal(postChoice);

        for(var key in prec){
            if(prec[key] === postc[key]){
                delete postc[key];
            }
        }

        const ct = JSON.stringify(postc)
        const ctfix = ct.replaceAll('\"^', '\"');

        console.log(ctfix);
        return ctfix;
    }

    static stripVal(state){
        var a = JSON.parse(state);
        var b = a["variablesState"];
        delete b["role"];
        return b;
    }
}
export default StateCompare;