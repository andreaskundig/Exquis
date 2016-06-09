// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#m929q2
Blockly.Blocks['blankImage'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Blank image");
    this.setOutput(true, "image");
    this.setColour(165);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['blankImage'] = function(block) {
    var code = 'makeBuffer()';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
/*
 copy from border: top bottom left right
 (blockly enum https://developers.google.com/blockly/custom-blocks/dropdown-menus)
 into image: canvasBuffer cb (blank image)
 at: point
 cb.context.putImageData(borders.east, point.x, point.y);

 
 */

Blockly.Blocks['takeSnapshot'] = {
    init: function() {
        this.appendValueInput("position")
            .setCheck("point")
            .appendField("Copy from origin");
        this.appendValueInput("dimension")
            .setCheck("dimension")
            .appendField("and dimension");
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
    var value_dimension = Blockly.JavaScript.valueToCode(block, 'dimension', Blockly.JavaScript.ORDER_ATOMIC);
    var vdb = Blockly.JavaScript.variableDB_;
    var rectVar = vdb.getDistinctName('rect', Blockly.Variables.NAME_TYPE);
    var code = value_image + '.copyToBuffer(ctx, '+value_position+', '+value_dimension+');\n';
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

Blockly.Blocks['border'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Copy from border")
            .appendField(new Blockly.FieldDropdown([["top", "north"], ["right", "east"], ["bottom", "south"], ["left", "west"]]), "BORDER_DIRECTION");
        this.appendValueInput("position")
            .setCheck("point")
            .appendField("to point");
        this.appendValueInput("image")
            .setCheck("image")
            .appendField("in image");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(165);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};

Blockly.JavaScript['border'] = function(block) {
    var value_image = Blockly.JavaScript.valueToCode(block, 'image', Blockly.JavaScript.ORDER_ATOMIC);
    var value_position = Blockly.JavaScript.valueToCode(block, 'position', Blockly.JavaScript.ORDER_ATOMIC);
    
    var dropdown_name = block.getFieldValue('BORDER_DIRECTION');
    var vdb = Blockly.JavaScript.variableDB_;
    var rectVar = vdb.getDistinctName('rect', Blockly.Variables.NAME_TYPE);

    var code = [value_image, '.context.putImageData(borders.', dropdown_name, ', ',
                value_position, '.x,', value_position, '.y);\n'].join('');
    return code;
};
