define(function(){
var angle;


var draw = function(ctx){
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();
    ctx.translate(50, 40 );
    ctx.rotate(angle* Math.PI/180);
    ctx.fillRect(-10,-50,100,100);
    angle = angle - 1;
  ctx.restore();
};
var setup = function(ctx){
  angle = 0;
};
var xmlSource = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="draw" x="29" y="1"><statement name="code"><block type="clear"><next><block type="transformation_sandbox"><statement name="transformations"><block type="translate"><value name="x"><block type="math_number"><field name="NUM">50</field></block></value><value name="y"><block type="math_number"><field name="NUM">40</field></block></value><next><block type="rotate"><value name="angle"><block type="variables_get"><field name="VAR">angle</field></block></value><next><block type="rectangle"><value name="x"><block type="math_number"><field name="NUM">-10</field></block></value><value name="y"><block type="math_number"><field name="NUM">-50</field></block></value><value name="width"><block type="math_number"><field name="NUM">100</field></block></value><value name="height"><block type="math_number"><field name="NUM">100</field></block></value><next><block type="variables_set"><field name="VAR">angle</field><value name="VALUE"><block type="math_arithmetic"><field name="OP">MINUS</field><value name="A"><block type="variables_get"><field name="VAR">angle</field></block></value><value name="B"><block type="math_number"><field name="NUM">1</field></block></value></block></value></block></next></block></next></block></next></block></statement></block></next></block></statement></block><block type="setup" x="91" y="387"><statement name="code"><block type="variables_set"><field name="VAR">angle</field><value name="VALUE"><block type="math_number"><field name="NUM">0</field></block></value></block></statement></block></xml>';
return { setup:setup, draw:draw, source: { code: xmlSource, lang: 'blockly' } };
});
