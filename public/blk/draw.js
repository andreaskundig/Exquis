// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#7m4636
Blockly.Blocks['draw'] = {
  init: function() {
    this.appendValueInput("shape")
        .setCheck("rectangle")
        .appendField("Draw");
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['draw'] = function(block) {
  var value_shape = Blockly.JavaScript.valueToCode(block, 'shape', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code ="";
  if(value_shape.type === 'rectangle'){
      code += 'var x = value_shape.position.x;';
      code += 'var y = value_shape.position.y;';
      code += 'var width = value_shape.dimension.width;';
      code += 'var height = value_shape.dimension.height;';
      code += 'ctx.fillRect(x, y, width, height);';
  }
  return code;
};


// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#7brosu

Blockly.Blocks['rectangle'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Rectangle");
    this.appendValueInput("position")
        .setCheck("point")
        .appendField("origin");
    this.appendValueInput("dimension")
        .setCheck("dimension")
        .appendField("dimension");
    this.setOutput(true, "rectangle");
    this.setColour(300);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['rectangle'] = function(block) {
  var value_position = Blockly.JavaScript.valueToCode(block, 'position', Blockly.JavaScript.ORDER_ATOMIC);
  var value_dimension = Blockly.JavaScript.valueToCode(block, 'dimension', Blockly.JavaScript.ORDER_ATOMIC);
  var code = '{position: ' + value_position + ', dimension: ' + value_dimension + ', type: "rectangle" }';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#pf2iid
Blockly.Blocks['point'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Point");
    this.appendValueInput("x")
        .setCheck("Number")
        .appendField("x");
    this.appendValueInput("y")
        .setCheck("Number")
        .appendField("y");
    this.setInputsInline(true);
    this.setOutput(true, "point");
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['point'] = function(block) {
  var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
  var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
  var code = '{x: ' + value_x + ', y: ' + value_y + '}';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

// https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#6u54cy
Blockly.Blocks['dimension'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Dimension");
    this.appendValueInput("width")
        .setCheck("Number")
        .appendField("width");
    this.appendValueInput("height")
        .setCheck("Number")
        .appendField("height");
    this.setInputsInline(true);
    this.setOutput(true, "dimension");
    this.setColour(180);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['dimension'] = function(block) {
  var value_width = Blockly.JavaScript.valueToCode(block, 'width', Blockly.JavaScript.ORDER_ATOMIC);
  var value_height = Blockly.JavaScript.valueToCode(block, 'height', Blockly.JavaScript.ORDER_ATOMIC);
  var code = '{width: ' + value_width + ', height: ' + value_height + '}';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

