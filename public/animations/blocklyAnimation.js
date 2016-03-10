define(['bibs/canvasBuffer'], function(canvasBuffer){
var snapshot;

function colour_random() {
  var num = Math.floor(Math.random() * Math.pow(2, 24));
  return '#' + ('00000' + num.toString(16)).substr(-6);
}


var setupAnimation = function(ctx){
  ctx.translate(75, 75 );
  ctx.fillStyle = (colour_random());
  var shape = ({pos: ({x: -50, y: -50}), dim: ({w: 100, h: 100}), type: "rectangle" });
  if(shape.type === "rectangle"){
    var point = shape.pos;
    var dim = shape.dim;
    ctx.fillRect(point.x, point.y, dim.w, dim.h);
  }
};
var drawAnimation = function(ctx){
  snapshot = canvasBuffer(({w: 150, h: 150}).w,({w: 150, h: 150}).h)
   .copyToBuffer(ctx, ({x: 0, y: 0}));
  ctx.translate(75, 75 );
  ctx.rotate(2* Math.PI/180);
  ctx.translate(-75, -75 );
  snapshot.copyFromBuffer(ctx);
};
var xmlSource = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="setupAnimation" x="12" y="6"><statement name="code"><block type="translate"><value name="x"><block type="math_number"><field name="NUM">75</field></block></value><value name="y"><block type="math_number"><field name="NUM">75</field></block></value><next><block type="fillcolour"><value name="colour"><block type="colour_random"></block></value><next><block type="draw"><value name="shape"><block type="rectangle"><value name="position"><block type="point"><value name="x"><block type="math_number"><field name="NUM">-50</field></block></value><value name="y"><block type="math_number"><field name="NUM">-50</field></block></value></block></value><value name="dimension"><block type="dimension"><value name="width"><block type="math_number"><field name="NUM">100</field></block></value><value name="height"><block type="math_number"><field name="NUM">100</field></block></value></block></value></block></value></block></next></block></next></block></statement></block><block type="drawAnimation" x="18" y="211"><statement name="code"><block type="variables_set"><field name="VAR">snapshot</field><value name="VALUE"><block type="snapshot"><value name="position"><block type="point"><value name="x"><block type="math_number"><field name="NUM">0</field></block></value><value name="y"><block type="math_number"><field name="NUM">0</field></block></value></block></value><value name="dimension"><block type="dimension"><value name="width"><block type="math_number"><field name="NUM">150</field></block></value><value name="height"><block type="math_number"><field name="NUM">150</field></block></value></block></value></block></value><next><block type="translate"><value name="x"><block type="math_number"><field name="NUM">75</field></block></value><value name="y"><block type="math_number"><field name="NUM">75</field></block></value><next><block type="rotate"><value name="angle"><block type="math_number"><field name="NUM">2</field></block></value><next><block type="translate"><value name="x"><block type="math_number"><field name="NUM">-75</field></block></value><value name="y"><block type="math_number"><field name="NUM">-75</field></block></value><next><block type="drawImage"><value name="image"><block type="variables_get"><field name="VAR">snapshot</field></block></value></block></next></block></next></block></next></block></next></block></statement></block></xml>';
return { setup: setupAnimation, draw: drawAnimation, source: { code: xmlSource, lang: 'blockly' } };
});
