class Type{
    constructor(name){
        this.name = name;
    }

    check(value){
        return true;
    }
}

class StringType extends Type {
    constructor() {
        super("String");
    }

    check(value) {
        return true;
    }
}

class BooleanType extends Type{
    constructor(){
        super("Bolean");
    }

    check(value){
        if (typeof value !== "boolean")
            return false;
        return true;
    }
}

class NumberType extends Type{
    constructor(){
        super("Number");
    }

    check(value){
        if (typeof value !== "number")
            return false;
        return true;
    }
}

class ValuesSetType extends Type{
    constructor(name, values){
        super(name);
        this.values = values;
    }

    check(value){
        if (this.values.includes(value))
            return true;
        return false;
    }
}