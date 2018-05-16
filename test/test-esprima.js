const esprima = require('esprima');
const escodegen = require('escodegen');
const util = require('util');
const assert = require('assert');
const program = `
define({
        setup: function (context){
            this.rotation = 0;
        },
        draw: function (context, borders){
            context.fillStyle = "rgb(100,250,0)";
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);

            context.save();
            context.translate(75, 75);
            context.rotate(this.rotation);
            context.fillStyle = "rgb(200,0,255)";
            context.fillRect(-75, -75, 150, 150);
            context.restore();
            
            this.rotation += this.params.speed.value * Math.PI / 180;
        },
        params:{speed:{value:1, min:-10, max:10, step:0.01}}
});
`;

const findDefineArguments = function(parseTree){
    const define = parseTree.body.find(e => {
        const isExpr = e.type == "ExpressionStatement";
        const isDef = e.expression.callee.name == 'define';
        return isExpr && isDef;
    });
    return define && define.expression.arguments;
};

const extractParamsFromArguments = function(args){
    return args[0].properties.find(
        p => p.key.name == "params");
};

const extractParamsObject = function(paramsAst) {
    let codeString = escodegen.generate(paramsAst.value);
    eval(`var paramsObject = ${codeString}`);
    return paramsObject;
};

const setParamsValue = function(paramsAst, paramsValueObject){
    let paramsCodeString = JSON.stringify(paramsValueObject);
    let paramsValueAst = esprima.parse('a = '+paramsCodeString).body[0].expression.right;
    paramsAst.value = paramsValueAst;
};

const rootAst = esprima.parse(program);
// console.log(JSON.stringify(rootAst, null, 2));
let argsAst = findDefineArguments(rootAst);
let paramsAst = extractParamsFromArguments(argsAst);
let paramsO = extractParamsObject(paramsAst);

paramsO.speed.value = 257;
setParamsValue(paramsAst, paramsO);
const modifiedProg = escodegen.generate(rootAst);
// console.log(modifiedProg);

const modifiedRootAst =  esprima.parse(modifiedProg);
const modArgsAst = findDefineArguments(modifiedRootAst);
const modParamsAst = extractParamsFromArguments(modArgsAst);
let modParamsO = extractParamsObject(modParamsAst);
assert.equal(paramsO.speed.value, 257);
