define(function(){
var angle;


var draw = function(ctx){
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();
    ctx.translate(100, 100 );
    ctx.rotate(angle* Math.PI/180);
    var shape = ({position: ({x: -50, y: -50}), dimension: ({width: 100, height: 100}), type: "rectangle" });
    if(shape.type === "rectangle"){
      var x = shape.position.x;
      var y = shape.position.y;
      var width = shape.dimension.width;
      var height = shape.dimension.height;
      ctx.fillRect(x, y, width, height);
    }
    angle = angle + 1;
  ctx.restore();
};
var setup = function(ctx){
  angle = 0;
};
var xmlSource = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="drawAnimation" x="33" y="27"><statement name="code"><block type="clear"><next><block type="transformation_sandbox"><statement name="transformations"><block type="translate"><value name="x"><block type="math_number"><field name="NUM">100</field></block></value><value name="y"><block type="math_number"><field name="NUM">100</field></block></value><next><block type="rotate"><value name="angle"><block type="variables_get"><field name="VAR">angle</field></block></value><next><block type="draw"><value name="shape"><block type="rectangle"><value name="position"><block type="point"><value name="x"><block type="math_number"><field name="NUM">-50</field></block></value><value name="y"><block type="math_number"><field name="NUM">-50</field></block></value></block></value><value name="dimension"><block type="dimension"><value name="width"><block type="math_number"><field name="NUM">100</field></block></value><value name="height"><block type="math_number"><field name="NUM">100</field></block></value></block></value></block></value><next><block type="variables_set"><field name="VAR">angle</field><value name="VALUE"><block type="math_arithmetic"><field name="OP">ADD</field><value name="A"><block type="variables_get"><field name="VAR">angle</field></block></value><value name="B"><block type="math_number"><field name="NUM">1</field></block></value></block></value></block></next></block></next></block></next></block></statement></block></next></block></statement></block><block type="setupAnimation" x="35" y="383"><statement name="code"><block type="variables_set"><field name="VAR">angle</field><value name="VALUE"><block type="math_number"><field name="NUM">0</field></block></value></block></statement></block></xml>';
return { setup:setup, draw:draw, source: { code: xmlSource, lang: 'blockly' } };
});
