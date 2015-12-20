// https://blockly-demo.appspot.com/static/demos/blockfactory/

Blockly.Blocks['clear'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Clear");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('clear');
    this.setColour(330);
  }
};

Blockly.JavaScript['clear'] = function(block) {

  var code = "ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);\n"; 
  return code;
};


