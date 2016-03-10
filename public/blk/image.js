// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#m929q2
Blockly.Blocks['snapshot'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Snapshot");
    this.appendValueInput("position")
        .setCheck("point")
        .appendField("origin");
    this.appendValueInput("dimension")
        .setCheck("dimension")
        .appendField("dimension");
    this.setOutput(true, "image");
    this.setColour(165);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['snapshot'] = function(block) {
    var value_position = Blockly.JavaScript.valueToCode(block, 'position', Blockly.JavaScript.ORDER_ATOMIC);
    var value_dimension = Blockly.JavaScript.valueToCode(block, 'dimension', Blockly.JavaScript.ORDER_ATOMIC);
    var vdb = Blockly.JavaScript.variableDB_;
    var rectVar = vdb.getDistinctName('rect', Blockly.Variables.NAME_TYPE);

    var code = 'canvasBuffer('+value_dimension+')\n   .copyToBuffer(ctx, '+value_position+')';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};



Blockly.Blocks['drawImage'] = {
    init: function() {
        this.appendValueInput("image")
            .setCheck("image")
            .appendField("Draw Image");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(165);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};

Blockly.JavaScript['drawImage'] = function(block) {
    var value_image = Blockly.JavaScript.valueToCode(
        block, 'image', Blockly.JavaScript.ORDER_ATOMIC);
    return value_image +'.copyFromBuffer(ctx);';
};

