// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#m929q2
Blockly.Blocks['snapshot'] = {
  init: function() {
    this.appendValueInput("rectangle")
        .setCheck("rectangle")
        .appendField("Snapshot");
    this.setOutput(true, "image");
    this.setColour(165);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['snapshot'] = function(block) {
  var value_rectangle = Blockly.JavaScript.valueToCode(block, 'rectangle', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
    var bufferVar = Blockly.JavaScript.variableDB_.getDistinctName('buffer', Blockly.Variables.NAME_TYPE);
    var rectVar = Blockly.JavaScript.variableDB_.getDistinctName('rect', Blockly.Variables.NAME_TYPE);
    var pointVar = Blockly.JavaScript.variableDB_.getDistinctName('point', Blockly.Variables.NAME_TYPE);
    var dimVar = Blockly.JavaScript.variableDB_.getDistinctName('dim', Blockly.Variables.NAME_TYPE);
    // TODO create a utility function makeBuffer, based on canvasBuffer.js (or reusing it?)
    // https://developers.google.com/blockly/custom-blocks/caching-arguments#utility_functions
    
    var code = '(function(){\n';
    code += '  var '+bufferVar+' = document.createElement("canvas")';
    code += '  var '+rectVar+' = '+value_rectangle+';\n';
    code += '  var '+pointVar+' = '+rectVar+'.pos;\n';
    code += '  var '+dimVar+' = '+rectVar+'.dim;\n';
    code += '  return ctx.getImageData('+pointVar+'.x, '+pointVar+'.y, '+dimVar+'.w, '+dimVar+'.h);\n';
    code += '})()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};;
