Blockly.Blocks['setup'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Setup");
    this.appendStatementInput("code");
    this.setPreviousStatement(false);
    this.setNextStatement(false);
    this.setTooltip('setuping function');
  }
};

Blockly.JavaScript['setup'] = function(block) {
  var code = Blockly.JavaScript.statementToCode(block, 'code');
    
  code = "var setup = function(ctx){\n"+code+"};";
  return code;
};
