Blockly.Blocks['setupAnimation'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Setup animation");
    this.appendStatementInput("code");
    this.setPreviousStatement(false);
    this.setNextStatement(false);
    this.setTooltip('setuping function');
  }
};

Blockly.JavaScript['setupAnimation'] = function(block) {
  var code = Blockly.JavaScript.statementToCode(block, 'code');
    
  code = "var setupAnimation = function(ctx){\n"+code+"};";
  return code;
};
