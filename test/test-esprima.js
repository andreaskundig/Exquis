const requirejs = require('requirejs');
const util = require('util');
const assert = require('assert');
const astring = require('astring');

requirejs.config({
    baseUrl: './public'
});

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


global.astring = astring;

requirejs(['paramsManager'], function(paramsManager){

    const mgr = paramsManager();
    
    const rootAst = mgr.parseCodeString(program);
    // console.log(JSON.stringify(rootAst, null, 2));
    let argsAst = mgr.findDefineArguments(rootAst);
    let paramsAst = mgr.extractParamsFromArguments(argsAst);
    let paramsO = mgr.extractParamsObject(paramsAst);

    let newSpeedValue = 257;

    paramsO.speed.value = newSpeedValue;
    mgr.setParamsValue(paramsAst, paramsO);
    const modifiedProg = mgr.generateCodeString(rootAst);

    const modifiedRootAst =  mgr.parseCodeString(modifiedProg);
    const modArgsAst = mgr.findDefineArguments(modifiedRootAst);
    const modParamsAst = mgr.extractParamsFromArguments(modArgsAst);
    let modParamsO = mgr.extractParamsObject(modParamsAst);
    
    assert.equal(paramsO.speed.value, newSpeedValue);

    console.log("all tests passed");
});
