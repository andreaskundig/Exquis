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
        p => p.key.name == "params")
    .value.properties;
};


const parseTree = esprima.parse(program);
// console.log(JSON.stringify(parseTree, null, 2));

let args = findDefineArguments(parseTree);
let params = extractParamsFromArguments(args);
assert.equal(args[0].type, "ObjectExpression");
let speed  = params[0];
assert.equal(speed.key.name, "speed");
let speedValue = speed.value.properties[0].value;
assert.equal(speedValue.value, 1);

// modifies parse tree
speedValue.value = 12;

const modifiedProg = escodegen.generate(parseTree);
const modifiedPT =  esprima.parse(modifiedProg);
const modArgs = findDefineArguments(modifiedPT);
const modParams = extractParamsFromArguments(modArgs);
speed  = modParams[0];
speedValue = speed.value.properties[0].value;
assert.equal(speedValue.value, 12);
console.log(escodegen.generate(parseTree));
