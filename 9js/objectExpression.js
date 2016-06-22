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

Const.prototype.simplify = function(){
    return this;
}

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

Variable.prototype.simplify = function(){
    return this;
}

Variable.prototype.prefix = Variable.prototype.toString;

Variable.prototype.diff = function(str){
    if (str == this.name) return new Const(1);
    return new Const(0);
};

function Wrap(args, op){
    this.args =  args;
    this.op = op;
}

Wrap.toString = function(){
    return (this.args[1]==undefined ? this.args.toString() + " " + this.op
                                : this.args[0].toString() + " " + this.args[1].toString() + " " + this.op);
};

Wrap.prefix = function(){
    return (this.args[1]==undefined ? ("(" + this.op + " " + this.args.prefix() + ")")
                                 :("(" + this.op + " " + this.args[0].prefix()
                                      + " " + this.args[1].prefix() + ")"));
};

Wrap.simplify = function(){
    return (this.args[1] == undefined ? this.args.simplify()
                    : new ops[this.op](this.args[0],this.args[1]).simplify());
};


/*function Opsymp(args, temp){

}*/

function Add(arg, temp){
    var args = [];
    if (temp!=undefined) {args[0] = arg; args[1] = temp;} else { args = arg;}
    Wrap.apply(this, [args, "+"]);
}
Add.prototype = Object.create(Wrap);

Add.prototype.simplify = function(){
    //return Opsymp(args, this.op);
    this.args[0] = this.args[0].simplify(); this.args[1] = this.args[1].simplify();
    if (this.args[0].value == 0 && !(this.args[1] instanceof Const)) return this.args[1].simplify();
    if (!(this.args[0] instanceof Const) && (this.args[1].value == 0)) return this.args[0].simplify();
    if (this.args[0] instanceof Const && this.args[1] instanceof Const)
        return new Const(this.args[0].value + this.args[1].value);
    return new Add(this.args[0], this.args[1]);
}

Add.prototype.evaluate = function(x, y, z){
    return this.args[0].evaluate(x, y, z) + this.args[1].evaluate(x, y, z);
};

Add.prototype.diff = function(str){
    return new Add(this.args[0].diff(str), this.args[1].diff(str));
};

function Subtract(arg, temp){
    var args = [];
    if (temp!=undefined) {args[0] = arg; args[1] = temp;} else { args = arg;}
    Wrap.apply(this, [args, "-"]);
}
Subtract.prototype = Object.create(Wrap);

Subtract.prototype.evaluate = function(x, y, z){
    return this.args[0].evaluate(x, y, z) - this.args[1].evaluate(x, y, z);
};

Subtract.prototype.simplify = function(){
    //return Opsymp(args, this.op);
    this.args[0] = this.args[0].simplify(); this.args[1] = this.args[1].simplify();
    if (this.args[0].value == 0 && !(this.args[1] instanceof Const)) return new Negate(this.args[1].simplify());
    if (!(this.args[0] instanceof Const) && (this.args[1].value == 0)) return this.args[0].simplify();
    if (this.args[0] instanceof Const && this.args[1] instanceof Const) {
        return new Const(this.args[0].value - this.args[1].value);
    }
    return new Subtract(this.args[0], this.args[1]);
}

Subtract.prototype.diff = function(str){
    return new Subtract(this.args[0].diff(str), this.args[1].diff(str));
};

function Multiply(arg, temp){
    var args = [];
    if (temp!=undefined) {args[0] = arg; args[1] = temp;} else { args = arg;}
    Wrap.apply(this, [args, "*"]);
}
Multiply.prototype = Object.create(Wrap);

Multiply.prototype.evaluate = function(x, y, z){
    return this.args[0].evaluate(x, y, z) * this.args[1].evaluate(x, y, z);
};

Multiply.prototype.simplify = function(){
    this.args[0] = this.args[0].simplify(); this.args[1] = this.args[1].simplify();
    if (this.args[0].value == 0 || this.args[1].value == 0) return new Const(0);
    if (this.args[0] instanceof Const && this.args[1] instanceof Const) return new Const(this.args[0].value * this.args[1].value);
    if (this.args[0].value == 1 && !(this.args[1] instanceof Const)) return this.args[1].simplify();
    if (!(this.args[0] instanceof Const) && this.args[1].value == 1) return this.args[0].simplify();
    return new Multiply(this.args[0], this.args[1]);
}

Multiply.prototype.diff = function(str){
    return new Add(new Multiply(this.args[0].diff(str), this.args[1]), new Multiply(this.args[0], this.args[1].diff(str)));
};

function Divide(arg, temp){
    var args = [];
    if (temp!=undefined) {args[0] = arg; args[1] = temp;} else {args = arg;}
    Wrap.apply(this, [args, "/"]);
}

Divide.prototype = Object.create(Wrap);

Divide.prototype.evaluate = function(x, y, z){
    return this.args[0].evaluate(x, y, z) / this.args[1].evaluate(x, y, z);
};

Divide.prototype.simplify = function(){
    this.args[0] = this.args[0].simplify(); this.args[1] = this.args[1].simplify();
    if (this.args[0].value == 0) return new Const(0);
    if (this.args[1].value == 1) return this.args[0].simplify();
    if (this.args[0] instanceof Const && this.args[1] instanceof Const) return new Const(this.args[0].value / this.args[1].value);
    return new Divide(this.args[0], this.args[1]);
}

Divide.prototype.diff = function(str){
    return new Divide(
        new Subtract(new Multiply(this.args[0].diff(str), this.args[1]), new Multiply(this.args[0], this.args[1].diff(str))),
        new Multiply(this.args[1], this.args[1]));
};

function Negate(args){
    Wrap.apply(this, [args, "negate"]);
}

Negate.prototype = Object.create(Wrap);

Negate.prototype.evaluate = function(x, y, z){
    return -(this.args.evaluate(x, y, z));
}

Negate.prototype.simplify = function(){
    return new Const(-this.args.simplify());
}

Negate.prototype.diff = function(str){
    return new Negate(this.args.diff(str));
}

function Sin(args){
    Wrap.apply(this, [args, "sin"]);
}

Sin.prototype = Object.create(Wrap);

Sin.prototype.evaluate = function(x, y, z){
    return Math.sin(this.args.evaluate(x, y, z));
};

Sin.prototype.diff = function (str) {
    return new Multiply(new Cos(this.args), this.args.diff(str));
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

function Cos(args){
    Wrap.apply(this, [args, "cos"]);
}

Cos.prototype = Object.create(Wrap);

Cos.prototype.evaluate = function(x, y, z){
    return Math.cos(this.args.evaluate(x, y, z));
};

Cos.prototype.diff = function (str) {
    return new Multiply(new Negate(new Sin(this.args)), this.args.diff(str));
};

function Exp(args){
    Wrap.apply(this, [args, "exp"]);
}

Exp.prototype = Object.create(Wrap);

Exp.prototype.evaluate = function(x, y, z){
    return Math.exp(this.args.evaluate(x, y, z));
};

Exp.prototype.diff = function (str) {
    return new Multiply(new Exp(this.args), this.args.diff(str));
};

function ArcTan(args){
    Wrap.apply(this, [args, "atan"]);
}

ArcTan.prototype = Object.create(Wrap);

ArcTan.prototype.evaluate = function(x, y, z){
    return Math.atan(this.args.evaluate(x, y, z));
};

ArcTan.prototype.diff = function (str) {
    return new Multiply(new Divide(new Const(1), new Add(new Const(1),
        new Multiply(this.args,this.args))),
        this.args[0].diff(str));
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
    var args = [];
    for (var i = 0; i < tokens.length; i++){
        if (tokens[i] == "") continue;
        if (tokens[i] in ops) {
            var descr = ops[tokens[i]];
            if (descr.count == 2) {
                args[1] = stack.pop();
                args[0] = stack.pop();
                stack.push(new descr.cons(args));
            } else {
                args[0] = stack.pop();
                args[1] = null;
                stack.push(new descr.cons(args));
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
/*
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
}*/


function parse(expression){
    var tokens = expression.split(/\s+/);
    var stack = [];
    var args = [];
    for (var i = 0; i < tokens.length; i++){
        var args = [];
        if (tokens[i] == "") continue;
        if (tokens[i] in ops) {
            var descr = ops[tokens[i]];
            if (descr.count == 2) {
                args[1] = stack.pop();
                args[0] = stack.pop();
                stack.push(new descr.cons(args));
            } else {
                args[0] = stack.pop();
                stack.push(new descr.cons(args[0]));
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


function ParserError(message) {
    this.name = "ParserError";
    this.message = message;
}
ParserError.prototype = Error.prototype;

function parseExpression(expression, bracketParser, stackOrder) {
    var exprLen = expression.length, tokensSize = [];
    var tokens = parseToken();
    var token, tokensLen = tokens.length;
    var expr, index = 0, typeParser = bracketParser('(') == '(';
    expr = parseOperand();
    if (expr == undefined)
        throw new ParserError("Empty input");
    if (expr == ')')
        throw new ParserError("Expression starts with close bracket");
    if (index < tokensLen)
        throw new ParserError("Excessive info at index " + getIndex(index));
    return expr;


    function parseToken() {
        var tokens = [];
        var index = 0, token;
        var separator = " ()";
        while ((token = getToken()) != undefined) {
            tokens.push(token);
            tokensSize.push(index);
        }
        tokensSize = stackOrder(tokensSize);
        return stackOrder(tokens);

        function getToken() {
            while (expression[index] == " ")
                index++;
            if (index == exprLen)
                return undefined;
            if (expression[index] == '(' || expression[index] == ')') {
                return bracketParser(expression[index++]);
            }
            var startIndex = index;
            while (index < exprLen && separator.indexOf(expression[index]) == -1)
                index++;
            return expression.substring(startIndex, index);
        }
    }


    function parseOperand() {
        if (index == tokensLen)
            return undefined;
        token = tokens[index++];
        if (token == '(')
            return parseOperate();
        if (token == ')')
            return ')';
        if (isAlpha(token)) {
            if (vars.indexOf(token) == -1)
                throw new ParserError("Unknown variable: [->" + token + "<-] at index " +
                    (getIndex(index - 1) - 1));
            return new Variable(token);
        }
        if (operators[token] != undefined)
            throw new ParserError("Missing " + (bracketParser("(") == '(' ? "open" : "close") + " bracket");
        return new Const(getNumber(token));
    }


    function parseOperate() {
        var stack = [], operand;
        var operate = tokens[index++];
        if (operators[operate] == undefined)
            throw new ParserError("Invalid operator: [->" + operate + "<-] at index " + (getIndex(index - 1) - 1));
        while ((operand = parseOperand()) != ')') {
            if (operand == undefined)
                throw new ParserError("Missing close brackets");
            stack.push(operand);
        }
        var f = operators[operate], n = f.prototype.numberOfArguments;
        if (stack.length != n) {
            var i = getIndex(index - stack.length);
            throw new ParserError((stack.length < n ? "Not enough" : "Too many") + " arguments for operation: [->" + operate + "<-] " +
                "at index " + (getIndex(index - stack.length) + 1)
                + "\nNeed " + n + (n > 1 ? " arguments" : " argument") + ", has " + stack.length);
        }
        var curExpr = Object.create(f.prototype);
        f.apply(curExpr, stackOrder(stack));
        return curExpr;
    }


    function isAlpha(str) {
        return /^[A-Za-z]*$/.test(str);
    }


    function getNumber(s) {
        var numbers = "0123456789";
        var l = s.length;
        for (var i = s[0] == "-" ? 1 : 0; i < l; i++) {
            if (numbers.indexOf(s[i]) == -1)
                throw new ParserError("Invalid symbol in argument: " + s.substr(0, i) + "[->" + s[i] + "<-]" + s.substring(i + 1, l)
                    + " at index " + (getIndex(index - 2) + i));
        }
        var result = parseInt(s);
        if (isNaN(result))
            throw new ParserError("Invalid number: [->" + s + "<-] at index " + tokensSize[index - 1]);
        return result;
    }

    function getIndex(i) {
        return tokensSize[i] == undefined ? 0 : tokensSize[i];
    }

}


var parsePrefix = function (expression) {
    return parseExpression(expression, function (bracket) {
        return bracket;
    }, function (tokens) {
        return tokens;
    });
};
var parsePostfix = function (expression) {
    return parseExpression(expression, function (bracket) {
        return bracket == "(" ? ")" : "(";
    }, function (tokens) {
        return tokens.reverse();
    });
};
print(parse('x negate 2 /').diff('x').simplify());