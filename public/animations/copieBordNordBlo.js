define(['bibs/canvasBuffer'], function(makeBuffer){
var snapshot;

function colour_random() {
  var num = Math.floor(Math.random() * Math.pow(2, 24));
  return '#' + ('00000' + num.toString(16)).substr(-6);
}


var setupAnimation = function(ctx){
  ctx.fillStyle = (colour_random());
  snapshot = makeBuffer();
};
var drawAnimation = function(ctx, borders){
  snapshot.copyToBuffer(ctx, ({x: 0, y: 0}), ({width: 150, height: 149}));
  snapshot.context.putImageData(borders.north, ({x: 0, y: 0}).x,({x: 0, y: 0}).y);
  ctx.translate(0, 1 );
  snapshot.copyFromBuffer(ctx);

};
var xmlSource = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="setupAnimation" x="10" y="-16"><statement name="code"><block type="fillcolour"><value name="colour"><block type="colour_random"></block></value><next><block type="variables_set"><field name="VAR">snapshot</field><value name="VALUE"><block type="blankImage"></block></value></block></next></block></statement></block><block type="drawAnimation" x="9" y="116"><statement name="code"><block type="takeSnapshot"><value name="position"><block type="point"><value name="x"><block type="math_number"><field name="NUM">0</field></block></value><value name="y"><block type="math_number"><field name="NUM">0</field></block></value></block></value><value name="dimension"><block type="dimension"><value name="width"><block type="math_number"><field name="NUM">150</field></block></value><value name="height"><block type="math_number"><field name="NUM">149</field></block></value></block></value><value name="image"><block type="variables_get"><field name="VAR">snapshot</field></block></value><next><block type="border"><field name="BORDER_DIRECTION">north</field><value name="position"><block type="point"><value name="x"><block type="math_number"><field name="NUM">0</field></block></value><value name="y"><block type="math_number"><field name="NUM">0</field></block></value></block></value><value name="image"><block type="variables_get"><field name="VAR">snapshot</field></block></value><next><block type="translate"><value name="x"><block type="math_number"><field name="NUM">0</field></block></value><value name="y"><block type="math_number"><field name="NUM">1</field></block></value><next><block type="drawImage"><value name="image"><block type="variables_get"><field name="VAR">snapshot</field></block></value></block></next></block></next></block></next></block></statement></block></xml>';
return { setup: setupAnimation, draw: drawAnimation, source: { code: xmlSource, lang: 'blockly' } };
});