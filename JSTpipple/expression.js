function bin(f, oper1, oper2){
    function eval(x, y, z){
        return f(oper1(x, y, z), oper2(x, y, z));
    }
    return eval;
}

function un(f, oper1){
    function eval(x, y, z){
        return f(oper1(x, y, z));
    }
    return eval;
}

function abs(oper1){
    return un(function f(a){return Math.abs(a)}, oper1);
}

function log(oper1){
    return un(function f(a){return Math.log(a)}, oper1);
}

function negate(oper1){
    return un(function f(a){return -a}, oper1);
}

function mod(oper1, oper2){
    return bin(function f(a, b){return a % b}, oper1, oper2);
}

function power(oper1, oper2){
    return bin(function f(a, b){return Math.pow(a, b)}, oper1, oper2);
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

function add(oper1, oper2){
    return bin(function (a, b) {return a + b}, oper1, oper2);
}

function subtract(oper1, oper2) {
    return bin(function (a, b) { return a - b }, oper1, oper2);
}

function multiply(oper1, oper2){
    return bin(function(a, b){return a * b}, oper1, oper2);
}

function divide(oper1, oper2){
    return bin(function(a, b){return a / b}, oper1 ,oper2);
}

function parse(expression){
    var tokens = expression.split(/\s+/);
    var stack = [];
    for (var i = 0; i < tokens.length; i+=1){
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
            case "negate":
                stack.push(negate(stack.pop()));
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