class Type{
    constructor(name){
        this.name = name;
    }

    check(value){
        return true;
    }

    is_exact_the_same(left, right) {
        return left === right;
    }

    is_almost_the_same(left, right) {
        return this.is_exact_the_same(left, right);
    }
}

class StringType extends Type {
    constructor() {
        super("String");
    }

    check(value) {
        return true;
    }

    is_exact_the_same(left, right) {
        left = left.toString();
        right = right.toString();
        return left === right;
    }

    is_almost_the_same(left, right) {
        left = left.toString();
        right = right.toString();
        if (is_prefix(left, right))
            return 1.0;
        const similarity = string_similarity(left, right);
        return similarity >= 0.5;
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

    is_exact_the_same(left, right) {
        left = Number(left);
        right = Number(right);
        return left === right;
    }

    is_almost_the_same(left, right) {
        left = left.toString();
        right = right.toString();
        return is_prefix(left, right);
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