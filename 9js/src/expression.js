function bin(f, left, right){
    function eval(x, y, z){
        return f(left(x, y, z), right(x, y, z));
    }
    return eval;
}

function un(f, left){
    function eval(x, y, z){
        return f(left(x, y, z));
    }
    return eval;
}

function abs(left){
    return un(function f(a){return Math.abs(a)}, left);
}

function log(left){
    return un(function f(a){return Math.log(a)}, left);
}

function mod(left, right){
    return bin(function f(a, b){return a % b}, left, right);
}

function power(left, right){
    return bin(function f(a, b){return Math.pow(a, b)}, left, right);
}

function cnst(value){
    function eval(x, y, z){ return value; }
    return eval;
}

function variable(name){
    function eval(x, y, z){
        if (name == 'x') return x;
        if (name == 'y') return y;
        return z;
    }
    return eval;
}

function add(left, right){
    return bin(function (a, b) {return a + b}, left, right);
}

function subtract(left, right) {
    return bin(function (a, b) { return a - b }, left, right);
}

function multiply(left, right){
    return bin(function(a, b){return a * b}, left, right);
}

function divide(left, right){
    return bin(function(a, b){return a / b}, left ,right);
}

function parse(expression){
    var tokens = expression.split(/\s+/);
    var stack = [];
    for (var i = 0; i < tokens.length; i++){
        switch (tokens[i]){
            case "*":
                var a = stack.pop();
                stack.push(multiply(stack.pop(), a));
                break;
            case "/":
                var a = stack.pop();
                stack.push(divide(stack.pop(), a));
                break;
            case "+":
                var a = stack.pop();
                stack.push(add(stack.pop(), a));
                break;
            case "-":
                var a = stack.pop();
                stack.push(subtract(stack.pop(), a));
                break;
            case "**":
                var a = stack.pop();
                stack.push(power(stack.pop(), a));
                break;
            case "log":
                stack.push(log(stack.pop()));
                break;
            case "abs":
                stack.push(abs(stack.pop()));
                break;
            case "%":
                var a = stack.pop();
                stack.push(mod(stack.pop(), a));
                break;
            case "":
                break;
            default :
                if (tokens[i].match(/-?[0-9]+/)){
                    stack.push(cnst(parseInt(tokens[i])));
                } else{
                    stack.push(variable(tokens[i]));
                }
        }
    }
    return stack.pop();
}