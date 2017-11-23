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
  code = `var drawAnimation = function(ctx, borders){
ctx.setTransform(1, 0, 0, 1, 0, 0);
${code}
};`;
  return code;
};
