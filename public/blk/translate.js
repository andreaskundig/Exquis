// https://blockly-demo.appspot.com/static/demos/blockfactory/

Blockly.Blocks['translate'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Translate to");
    this.appendValueInput("x")
        .setCheck("Number")
        .appendField("x");
    this.appendValueInput("y")
        .setCheck("Number")
        .appendField("y");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('translate');
    this.setColour(330);
  }
};

Blockly.JavaScript['translate'] = function(block) {
  var x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
  var y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);

  var code = "ctx.translate(" + x  + ", " + y  + " );\n"; 
  return code;
};


