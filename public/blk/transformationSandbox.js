Blockly.Blocks['transformation_sandbox'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Transformation sandbox");
    this.appendStatementInput("transformations");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['transformation_sandbox'] = function(block) {
  var transformations_statements = Blockly.JavaScript.statementToCode(block, 'transformations');
  // TODO: Assemble JavaScript into code variable.
  var code = 'ctx.save();\n';
  code += transformations_statements;
  code += 'ctx.restore();\n';
  return code;
};
