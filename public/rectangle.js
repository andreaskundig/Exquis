// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#h3t96r

Blockly.Blocks['rectangle'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Rectangle");
    this.appendValueInput("x")
        .setCheck("Number")
        .appendField("x");
    this.appendValueInput("y")
        .setCheck("Number")
        .appendField("y");
    this.appendValueInput("width")
        .setCheck("Number")
        .appendField("width");
    this.appendValueInput("height")
        .setCheck("Number")
        .appendField("height");
    this.setInputsInline(false);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('draw rectangle');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['rectangle'] = function(block) {
  var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
  var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
  var value_width = Blockly.JavaScript.valueToCode(block, 'width', Blockly.JavaScript.ORDER_ATOMIC);
  var value_height = Blockly.JavaScript.valueToCode(block, 'height', Blockly.JavaScript.ORDER_ATOMIC);

  var code = "ctx.fillRect(" + value_x + "," + value_y + "," + value_width + "," + value_height + ");\n"; 
  return code;
};


