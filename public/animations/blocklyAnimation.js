define(['bibs/canvasBuffer'], function(makeBuffer){
var snapshot;
var rotation;

function colour_random() {
  var num = Math.floor(Math.random() * Math.pow(2, 24));
  return '#' + ('00000' + num.toString(16)).substr(-6);
}


var setupAnimation = function(ctx){
  ctx.translate(75, 75 );
  ctx.fillStyle = (colour_random());
  snapshot = makeBuffer();
  rotation = 0;
};
var drawAnimation = function(ctx, borders){
  snapshot.context.putImageData(borders.north, ({x: 0, y: 0}).x,({x: 0, y: 0}).y)
  snapshot.copyFromBuffer(ctx);snapshot.copyToBuffer(ctx, ({x: 0, y: 0}), ({width: 150, height: 150}));
  ctx.translate(25, 75 );
  ctx.rotate(rotation* Math.PI/180);
  ctx.translate(-75, -75 );
  snapshot.copyFromBuffer(ctx);rotation = rotation + 4;

};
var xmlSource = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="setupAnimation" x="10" y="-16"><statement name="code"><block type="translate"><value name="x"><block type="math_number"><field name="NUM">75</field></block></value><value name="y"><block type="math_number"><field name="NUM">75</field></block></value><next><block type="fillcolour"><value name="colour"><block type="colour_random"></block></value><next><block type="variables_set"><field name="VAR">snapshot</field><value name="VALUE"><block type="blankImage"></block></value><next><block type="variables_set"><field name="VAR">rotation</field><value name="VALUE"><block type="math_number"><field name="NUM">0</field></block></value></block></next></block></next></block></next></block></statement></block><block type="drawAnimation" x="208" y="104"><statement name="code"><block type="border"><field name="BORDER_DIRECTION">north</field><value name="position"><block type="point"><value name="x"><block type="math_number"><field name="NUM">0</field></block></value><value name="y"><block type="math_number"><field name="NUM">0</field></block></value></block></value><value name="image"><block type="variables_get"><field name="VAR">snapshot</field></block></value><next><block type="drawImage"><value name="image"><block type="variables_get"><field name="VAR">snapshot</field></block></value><next><block type="takeSnapshot"><value name="position"><block type="point"><value name="x"><block type="math_number"><field name="NUM">0</field></block></value><value name="y"><block type="math_number"><field name="NUM">0</field></block></value></block></value><value name="dimension"><block type="dimension"><value name="width"><block type="math_number"><field name="NUM">150</field></block></value><value name="height"><block type="math_number"><field name="NUM">150</field></block></value></block></value><value name="image"><block type="variables_get"><field name="VAR">snapshot</field></block></value><next><block type="translate"><value name="x"><block type="math_number"><field name="NUM">25</field></block></value><value name="y"><block type="math_number"><field name="NUM">75</field></block></value><next><block type="rotate"><value name="angle"><block type="variables_get"><field name="VAR">rotation</field></block></value><next><block type="translate"><value name="x"><block type="math_number"><field name="NUM">-75</field></block></value><value name="y"><block type="math_number"><field name="NUM">-75</field></block></value><next><block type="drawImage"><value name="image"><block type="variables_get"><field name="VAR">snapshot</field></block></value><next><block type="variables_set"><field name="VAR">rotation</field><value name="VALUE"><block type="math_arithmetic"><field name="OP">ADD</field><value name="A"><block type="variables_get"><field name="VAR">rotation</field></block></value><value name="B"><block type="math_number"><field name="NUM">4</field></block></value></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></xml>';
return { setup: setupAnimation, draw: drawAnimation, source: { code: xmlSource, lang: 'blockly' } };
});
