Blockly.Blocks['drawAnimation'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Draw animation");
    this.appendStatementInput("code");
    this.setPreviousStatement(false);
    this.setNextStatement(false);
    this.setTooltip('drawing function');
  }
};

Blockly.JavaScript['drawAnimation'] = function(block) {
  var code = Blockly.JavaScript.statementToCode(block, 'code');
  code = "var drawAnimation = function(ctx){\n"+code+"\n};";
  return code;
};
