define(function(){
var snap;
var bigRect;

function colour_random() {
  var num = Math.floor(Math.random() * Math.pow(2, 24));
  return '#' + ('00000' + num.toString(16)).substr(-6);
}

function provideImageBuffer(width, height) {
  if(!window.__imageBuffer__){
     window.__imageBuffer__ = document.createElement("canvas");
  }
  window.__imageBuffer__.width = width;
  window.__imageBuffer__.height = height;
  return window.__imageBuffer__.getContext("2d");
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
  bigRect = ({pos: ({x: 0, y: 0}), dim: ({w: 150, h: 150}), type: "rectangle" });
};
var drawAnimation = function(ctx){
  snap = ((function(){
    var rect = bigRect;
    return ctx.getImageData(rect.pos.x, rect.pos.y, rect.dim.w, rect.dim.h);
  })());
  ctx.translate(75, 75 );
  ctx.rotate(2* Math.PI/180);
  ctx.translate(-75, -75 );
  var imgBuffer=provideImageBuffer(snap.width, snap.height);
  imgBuffer.putImageData(snap, 0, 0);
  ctx.drawImage(imgBuffer.canvas,0, 0,snap.width, snap.height);
};
var xmlSource = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="setupAnimation" x="9" y="5"><statement name="code"><block type="translate"><value name="x"><block type="math_number"><field name="NUM">75</field></block></value><value name="y"><block type="math_number"><field name="NUM">75</field></block></value><next><block type="fillcolour"><value name="colour"><block type="colour_random"></block></value><next><block type="draw"><value name="shape"><block type="rectangle"><value name="position"><block type="point"><value name="x"><block type="math_number"><field name="NUM">-50</field></block></value><value name="y"><block type="math_number"><field name="NUM">-50</field></block></value></block></value><value name="dimension"><block type="dimension"><value name="width"><block type="math_number"><field name="NUM">100</field></block></value><value name="height"><block type="math_number"><field name="NUM">100</field></block></value></block></value></block></value><next><block type="variables_set"><field name="VAR">bigRect</field><value name="VALUE"><block type="rectangle"><value name="position"><block type="point"><value name="x"><block type="math_number"><field name="NUM">0</field></block></value><value name="y"><block type="math_number"><field name="NUM">0</field></block></value></block></value><value name="dimension"><block type="dimension"><value name="width"><block type="math_number"><field name="NUM">150</field></block></value><value name="height"><block type="math_number"><field name="NUM">150</field></block></value></block></value></block></value></block></next></block></next></block></next></block></statement></block><block type="drawAnimation" x="33" y="276"><statement name="code"><block type="variables_set"><field name="VAR">snap</field><value name="VALUE"><block type="snapshot"><value name="rectangle"><block type="variables_get"><field name="VAR">bigRect</field></block></value></block></value><next><block type="translate"><value name="x"><block type="math_number"><field name="NUM">75</field></block></value><value name="y"><block type="math_number"><field name="NUM">75</field></block></value><next><block type="rotate"><value name="angle"><block type="math_number"><field name="NUM">2</field></block></value><next><block type="translate"><value name="x"><block type="math_number"><field name="NUM">-75</field></block></value><value name="y"><block type="math_number"><field name="NUM">-75</field></block></value><next><block type="drawImage"><value name="image"><block type="variables_get"><field name="VAR">snap</field></block></value></block></next></block></next></block></next></block></next></block></statement></block></xml>';
return { setup: setupAnimation, draw: drawAnimation, source: { code: xmlSource, lang: 'blockly' } };
});
