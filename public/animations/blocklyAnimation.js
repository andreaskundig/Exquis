define(function(){
var snap;
var bigRect;


var setupAnimation = function(ctx){
  var shape = ({pos: ({x: -50, y: -50}), dim: ({w: 100, h: 100}), type: "rectangle" });
  if(shape.type === "rectangle"){
    var point = shape.pos;
    var dim = shape.dim;
    ctx.fillRect(point.x, point.y, dim.w, dim.h);
  }
  bigRect = ({pos: ({x: 0, y: 0}), dim: ({w: 150, h: 150}), type: "rectangle" });
};
var drawAnimation = function(ctx){
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  snap = ((function(){
    var rect = bigRect;
    return ctx.getImageData(rect.pos.x, rect.pos.y, rect.dim.w, rect.dim.h);
  })());
  ctx.translate(75, 75 );
  ctx.rotate(2* Math.PI/180);
  ctx.translate(-75, -75 );
};
var xmlSource = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="setupAnimation" x="9" y="5"><statement name="code"><block type="draw"><value name="shape"><block type="rectangle"><value name="position"><block type="point"><value name="x"><block type="math_number"><field name="NUM">-50</field></block></value><value name="y"><block type="math_number"><field name="NUM">-50</field></block></value></block></value><value name="dimension"><block type="dimension"><value name="width"><block type="math_number"><field name="NUM">100</field></block></value><value name="height"><block type="math_number"><field name="NUM">100</field></block></value></block></value></block></value><next><block type="variables_set"><field name="VAR">bigRect</field><value name="VALUE"><block type="rectangle"><value name="position"><block type="point"><value name="x"><block type="math_number"><field name="NUM">0</field></block></value><value name="y"><block type="math_number"><field name="NUM">0</field></block></value></block></value><value name="dimension"><block type="dimension"><value name="width"><block type="math_number"><field name="NUM">150</field></block></value><value name="height"><block type="math_number"><field name="NUM">150</field></block></value></block></value></block></value></block></next></block></statement></block><block type="drawAnimation" x="6" y="266"><statement name="code"><block type="clear"><next><block type="variables_set"><field name="VAR">snap</field><value name="VALUE"><block type="snapshot"><value name="rectangle"><block type="variables_get"><field name="VAR">bigRect</field></block></value></block></value><next><block type="translate"><value name="x"><block type="math_number"><field name="NUM">75</field></block></value><value name="y"><block type="math_number"><field name="NUM">75</field></block></value><next><block type="rotate"><value name="angle"><block type="math_number"><field name="NUM">2</field></block></value><next><block type="translate"><value name="x"><block type="math_number"><field name="NUM">-75</field></block></value><value name="y"><block type="math_number"><field name="NUM">-75</field></block></value></block></next></block></next></block></next></block></next></block></statement></block></xml>';
return { setup: setupAnimation, draw: drawAnimation, source: { code: xmlSource, lang: 'blockly' } };
});
