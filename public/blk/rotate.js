// https://blockly-demo.appspot.com/static/demos/blockfactory/

Blockly.Blocks['rotate'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Rotate");
    this.appendValueInput("angle")
        .setCheck("Number")
        .appendField("angle");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('rotate');
    this.setColour(330);
  }
};

Blockly.JavaScript['rotate'] = function(block) {
  var value_angle = Blockly.JavaScript.valueToCode(block, 'angle', Blockly.JavaScript.ORDER_ATOMIC);
  console.log(value_angle);

  var code = "ctx.rotate(" + value_angle  + "* Math.PI/180);\n"; 
  return code;
};


