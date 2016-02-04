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

Blockly.JavaScript['draw'] = function(block) {
  var code = Blockly.JavaScript.statementToCode(block, 'code');
    
  code = "var draw = function(ctx){\n"+code+"};";
  return code;
};
