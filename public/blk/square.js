Blockly.Blocks['square'] = {
  init: function() {
    this.appendValueInput("COLOR")
        .appendField("color");
    this.appendValueInput("angle")
        .setCheck("Number")
        .appendField("ANGLE");
    this.setInputsInline(false);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(330);
    this.setTooltip('squares');
    this.setHelpUrl('http://www.example.com/');
    //  this.setOutput(true, 'Number');
  }
};

Blockly.JavaScript['square'] = function(block) {
  var value_color = Blockly.JavaScript.valueToCode(block, 'COLOR', Blockly.JavaScript.ORDER_ATOMIC);
  var value_angle = Blockly.JavaScript.valueToCode(block, 'angle', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = "("+makesquare().toString().replace("__COLOR__", value_color)+")(ctx);";
  return code;
};


function makesquare (){
    return function (context){
        context.rotate(this.rotation* this.toRadians);
        context.fillStyle = "rgb(__COLOR__,20,"+Math.floor(Math.random()*255)+")";
        var x = Math.floor(Math.random()*context.canvas.width);
        var y = Math.floor(Math.random()*context.canvas.height);
        context.fillRect(x, y, 50, 50);
    };
}

