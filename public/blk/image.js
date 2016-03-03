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
    var value_rectangle = Blockly.JavaScript.valueToCode(
        block, 'rectangle', Blockly.JavaScript.ORDER_ATOMIC);
    var vdb = Blockly.JavaScript.variableDB_;
    var rectVar = vdb.getDistinctName('rect', Blockly.Variables.NAME_TYPE);

    // The code should be evaluable to a single assignable value,
    // because we defined an output (of type "image),
    // that can be placed on the right side of = .
    // We can use intermediary variables if we put them 
    // inside an immediately evaluated function. 
    var code = '(function(){\n';
    code += '  var '+rectVar+' = '+value_rectangle+';\n';
    code += '  return ctx.getImageData('+rectVar+'.pos.x, '+rectVar+'.pos.y, ';
    code +=                             rectVar+'.dim.w, '+rectVar+'.dim.h);\n';
    code += '})()';
    return [code, Blockly.JavaScript.ORDER_NONE];
};



Blockly.Blocks['drawImage'] = {
    init: function() {
        this.appendValueInput("image")
            .setCheck("image")
            .appendField("Draw Image");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(165);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};

//TODO make this work
//https://developers.google.com/blockly/custom-blocks/caching-arguments#utility_functions
// var functionName = Blockly.JavaScript.provideFunction_(
//     'list_lastElement',
//     [ 'function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(aList) {',
//       '  // Return the last element of a list.',
//       '  return aList[aList.length - 1];',
//       '}']);
// Generate the function call for this block.

Blockly.JavaScript['drawImage'] = function(block) {
    var value_image = Blockly.JavaScript.valueToCode(
        block, 'image', Blockly.JavaScript.ORDER_ATOMIC);

    var vdb = Blockly.JavaScript.variableDB_;
    var bufVar = vdb.getDistinctName('imgBuffer', Blockly.Variables.NAME_TYPE);
    var provideImageBuffer = Blockly.JavaScript.provideFunction_(
        'provideImageBuffer',
        [ 'function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ + '(width, height) {',
          '  if(!window.__imageBuffer__){',
          '     window.__imageBuffer__ = document.createElement("canvas");',
          '  }',
          '  window.__imageBuffer__.width = width;',
          '  window.__imageBuffer__.height = height;',
          '  return window.__imageBuffer__.getContext("2d");',
          '}']);
    var code = 'var '+bufVar+'=' + provideImageBuffer + '('+value_image+'.width, '+value_image+'.height);\n';
    code += bufVar+'.putImageData('+value_image+', 0, 0);\n';
    code += 'ctx.drawImage('+bufVar+'.canvas,0, 0,'+value_image +'.width, '; 
    code +=  value_image +'.height);\n';  
    return code;
};

