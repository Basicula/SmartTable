class Pair{
    constructor(first, second){
        if (typeof first === "undefined" || typeof second === "undefined")
            throw "Wrong pair construction";
        this.first = first;
        this.second = second;
    }
}