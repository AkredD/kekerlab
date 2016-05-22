function Const(value){
    this.value = value;
}

Const.prototype.evaluate = function(x, y, z){
    return this.value;
};

Const.prototype.toString = function(){
    return this.value.toString();
};

Const.prototype.prefix = Const.prototype.toString;

Const.prototype.diff = function(){
    return new Const(0);
};

function Variable(name) {
    this.name = name;
}

Variable.prototype.evaluate = function(x, y, z) {
    if (this.name == 'x') {
        return x;
    }
    if (this.name == 'y') {
        return y;
    }
    if (this.name == 'z'){
        return z;
    }
};

Variable.prototype.toString = function(){
    return this.name;
};

Variable.prototype.prefix = Variable.prototype.toString;

Variable.prototype.diff = function(str){
    if (str == this.name) return new Const(1);
    return new Const(0);
};

function Bin(oper1, oper2, op){
    this.oper1 =  oper1;
    this.oper2 = oper2;
    this.op = op;
}

Bin.toString = function(){
    return this.oper1.toString() + " " + this.oper2.toString() + " " + this.op;
};

Bin.prefix = function(){
    return "(" + this.op + " " + this.oper1.prefix()
        + " " + this.oper2.prefix() + ")";
};


function Un(oper1, op){
    this.oper1 = oper1;
    this.op = op;
}

Un.toString = function(){
    return this.oper1.toString() + " " + this.op;
};

Un.prefix = function(){
    return "(" + this.op + " " + this.oper1.prefix() + ")";
};


function Add(oper1, oper2){
    Bin.apply(this, [oper1, oper2, "+"]);
}
Add.prototype = Object.create(Bin);

Add.prototype.evaluate = function(x, y, z){
    return this.oper1.evaluate(x, y, z) + this.oper2.evaluate(x, y, z);
};

Add.prototype.diff = function(str){
    return new Add(this.oper1.diff(str), this.oper2.diff(str));
};

function Subtract(oper1, oper2){
    Bin.apply(this, [oper1, oper2, "-"]);
}
Subtract.prototype = Object.create(Bin);

Subtract.prototype.evaluate = function(x, y, z){
    return this.oper1.evaluate(x, y, z) - this.oper2.evaluate(x, y, z);
};

Subtract.prototype.diff = function(str){
    return new Subtract(this.oper1.diff(str), this.oper2.diff(str));
};

function Multiply(oper1, oper2){
    Bin.apply(this, [oper1, oper2, "*"]);
}
Multiply.prototype = Object.create(Bin);

Multiply.prototype.evaluate = function(x, y, z){
    return this.oper2.evaluate(x, y, z) * this.oper1.evaluate(x, y, z);
};

Multiply.prototype.diff = function(str){
    return new Add(new Multiply(this.oper1.diff(str), this.oper2), new Multiply(this.oper1, this.oper2.diff(str)));
};

function Divide(oper1, oper2){
    Bin.apply(this, [oper1, oper2, "/"]);
}

Divide.prototype = Object.create(Bin);

Divide.prototype.evaluate = function(x, y, z){
    return this.oper1.evaluate(x, y, z) / this.oper2.evaluate(x, y, z);
};

Divide.prototype.diff = function(str){
    return new Divide(
        new Subtract(new Multiply(this.oper1.diff(str), this.oper2), new Multiply(this.oper1, this.oper2.diff(str))),
        new Multiply(this.oper2, this.oper2));
};

function Negate(oper1){
    Un.apply(this, [oper1, "negate"]);
}

Negate.prototype = Object.create(Un);

Negate.prototype.evaluate = function(x, y, z){
    return -(this.oper1.evaluate(x, y, z));
}

Negate.prototype.diff = function(str){
    return new Negate(this.oper1.diff(str));
}

function Sin(oper1){
    Un.apply(this, [oper1, "sin"]);
}

Sin.prototype = Object.create(Un);

Sin.prototype.evaluate = function(x, y, z){
    return Math.sin(this.oper1.evaluate(x, y, z));
};

Sin.prototype.diff = function (str) {
    return new Multiply(new Cos(this.oper1), this.oper1.diff(str));
};


/*function fun (token, eval) {
 var f = function(oper1, oper2) {Bin.call(this, oper1, oper2, token)};
 f.prototype = Object.create(Bin.prototype);
 f.prototype.evaluate = eval;

 return f;
 }
 */
// var Add = fun("+", function(x, y) {return x + y});
// var Subtract = fun("-");
// new Add(e1, e2);

function Cos(oper1){
    Un.apply(this, [oper1, "cos"]);
}

Cos.prototype = Object.create(Un);

Cos.prototype.evaluate = function(x, y, z){
    return Math.cos(this.oper1.evaluate(x, y, z));
};

Cos.prototype.diff = function (str) {
    return new Multiply(new Negate(new Sin(this.oper1)), this.oper1.diff(str));
};

function Exp(oper1){
    Un.apply(this, [oper1, "exp"]);
}

Exp.prototype = Object.create(Un);

Exp.prototype.evaluate = function(x, y, z){
    return Math.exp(this.oper1.evaluate(x, y, z));
};

Exp.prototype.diff = function (str) {
    return new Multiply(new Exp(this.oper1), this.oper1.diff(str));
};

function ArcTan(oper1){
    Un.apply(this, [oper1, "atan"]);
}

ArcTan.prototype = Object.create(Un);

ArcTan.prototype.evaluate = function(x, y, z){
    return Math.atan(this.oper1.evaluate(x, y, z));
};

ArcTan.prototype.diff = function (str) {
    return new Multiply(new Divide(new Const(1), new Add(new Const(1),
        new Multiply(this.oper1,this.oper1))),
        this.oper1.diff(str));
};

var ops = {
    "-": {count: 2, cons: Subtract},
    "+": {count: 2, cons: Add},
    "*": {count: 2, cons: Multiply},
    "/": {count: 2, cons: Divide},
    "negate": {count: 1, cons: Negate},
    "sin": {count: 1, cons: Sin},
    "cos": {count: 1, cons: Cos},
    "exp": {count: 1, cons: Exp},
    "atan":{count: 1, cons: ArcTan},
};

function parse(expression){
    var tokens = expression.split(/\s+/);
    var stack = [];
    for (var i = 0; i < tokens.length; i++){
        if (tokens[i] == "") continue;
        if (tokens[i] in ops) {
            var descr = ops[tokens[i]];
            if (descr.count == 2) {
                var right = stack.pop();
                var left = stack.pop();
                stack.push(new descr.cons(left, right));
            } else {
                var arg = stack.pop();
                stack.push(new descr.cons(arg));
            }
        }else {
            if (tokens[i].match(/-?[0-9]+/)) {
                stack.push(new Const(parseInt(tokens[i])));
            } else {
                stack.push(new Variable(tokens[i]));
            }
        }
    }
    return stack.pop();
}

function postfix(){

}

var position;
function parsePrefix(expression){
    var newExpression = "";
    var bracketsBalance = 0;
    for (var i = 0; i < expression.length; i++){
        if (expression[i] == '(') bracketsBalance += 1;
        if (expression[i] == ')') bracketsBalance -= 1;
        if (bracketsBalance < 0) throw "Unexpected closing bracket";
    }
    if (bracketsBalance != 0) throw "Unexpected opening bracket";
    for (var i = 0; i < expression.length; i++){
        expression[i] == ')' || expression[i] == '(' ?
            newExpression += (" " + expression[i] + " ") : newExpression += (expression[i] + "");
    }
    var tokens = newExpression.split(/\s+/);
    position = tokens.length;
    if (tokens.length == 0) throw "Expression not found";
    return parsePrefixTokens(tokens);
}

function parsePrefixTokens(tokens){
    position = position - 1;
    var stack = [];
    for (; position >= 0; position--){
        if (tokens[position] == "") continue;
        if (tokens[position] == "("){
            if (stack.length != 1) throw "Critical error";
            return stack.pop();
        }
        if (tokens[position] == ")"){
            stack.push(parsePrefixTokens(tokens));
            continue;
        }
        if (tokens[position] in ops) {
            var descr = ops[tokens[position]];
            if (descr.count == 2) {
                if (stack.length < 2) throw "Not enough arguments";
                stack.push(new descr.cons(stack.pop(), stack.pop()));
            } else {
                if (stack.length < 1) throw "Not enough arguments";
                stack.push(new descr.cons(stack.pop()));
            }
        }else {
            if (tokens[position].match(/-?[0-9]+/g) == tokens[position]) {
                stack.push(new Const(parseInt(tokens[position])));
            } else {
                if (tokens[position].match(/[xyz]/g) == tokens[position]) {
                    stack.push(new Variable(tokens[position]));
                }else{
                    throw "Unknown operation";
                }
            }
        }
    }
    if (stack.length != 1) throw "Critical error";
    return stack.pop();
}