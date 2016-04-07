// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#m929q2
Blockly.Blocks['blankImage'] = {
  init: function() {
    this.appendValueInput("dimension")
        .setCheck("dimension")
        .appendField("Blank image of size");
    this.setOutput(true, "image");
    this.setColour(165);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['blankImage'] = function(block) {
    var value_dimension = Blockly.JavaScript.valueToCode(block, 'dimension', Blockly.JavaScript.ORDER_ATOMIC);
    var vdb = Blockly.JavaScript.variableDB_;
    var rectVar = vdb.getDistinctName('rect', Blockly.Variables.NAME_TYPE);

    var code = 'canvasBuffer('+value_dimension+')';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.Blocks['takeSnapshot'] = {
    init: function() {
        this.appendValueInput("position")
            .setCheck("point")
            .appendField("Copy from point");
        this.appendValueInput("image")
            .setCheck("image")
            .appendField("into image");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(165);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};

Blockly.JavaScript['takeSnapshot'] = function(block) {
    var value_image = Blockly.JavaScript.valueToCode(block, 'image', Blockly.JavaScript.ORDER_ATOMIC);
    var value_position = Blockly.JavaScript.valueToCode(block, 'position', Blockly.JavaScript.ORDER_ATOMIC);
    var vdb = Blockly.JavaScript.variableDB_;
    var rectVar = vdb.getDistinctName('rect', Blockly.Variables.NAME_TYPE);

    var code = value_image + '.copyToBuffer(ctx, '+value_position+');\n';
    return code;
};

Blockly.Blocks['drawImage'] = {
    init: function() {
        this.appendValueInput("image")
            .setCheck("image")
            .appendField("Draw image");
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

