var startcode = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="controls_repeat_ext" x="67" y="262"><value name="TIMES"><block type="math_number"><field name="NUM">100</field></block></value><statement name="DO"><block type="square"><value name="COLOR"><block type="math_number"><field name="NUM">0</field></block></value></block></statement></block></xml> ';


function loadBlockly(){
    var workspace = Blockly.inject('blocklyDiv',
                                   {toolbox: document.getElementById('toolbox')});

    var xml = Blockly.Xml.textToDom(startcode);
    Blockly.Xml.domToWorkspace( Blockly.mainWorkspace, xml );
    function myUpdateFunction() {
        var code = Blockly.JavaScript.workspaceToCode(workspace);
        document.getElementById('textarea').value = code;
    }
    workspace.addChangeListener(myUpdateFunction);

    window.save  = function (){
        var dom = Blockly.Xml.workspaceToDom(workspace);
        console.log(dom);
        console.log(Blockly.Xml.domToText(dom));
        localStorage.setItem('data',Blockly.Xml.domToText(dom));
    };
    window.load = function () {
        if(localStorage.data!=null){
            var xml = Blockly.Xml.textToDom(localStorage.data);
            Blockly.mainWorkspace.clear();
            Blockly.Xml.domToWorkspace( Blockly.mainWorkspace, xml );
            console.log("restored");
        }
    };
    window.execute  = function (){
        Blockly.JavaScript.addReservedWords('code');
        var code = Blockly.JavaScript.workspaceToCode(workspace);
        code += "\nvar anim = { setup:setup, draw:draw };";
        console.log(code);
        var ctx = document.getElementById("canvas").getContext("2d");
        try {
            eval(code);
            anim.setup(ctx);
            var render = function(){
                anim.draw(ctx);
                requestAnimationFrame(render);
            };
            render();
        } catch (e) {
            alert(e);
        }
    };
    
}
window.onload = loadBlockly;
