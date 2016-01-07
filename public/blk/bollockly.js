define(["nodestore", "evileval"], function(store, evileval){
    var startcode = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="draw" x="29" y="1"><statement name="code"><block type="clear"><next><block type="transformation_sandbox"><statement name="transformations"><block type="translate"><value name="x"><block type="math_number"><field name="NUM">200</field></block></value><value name="y"><block type="math_number"><field name="NUM">200</field></block></value><next><block type="rotate"><value name="angle"><block type="variables_get"><field name="VAR">angle</field></block></value><next><block type="rectangle"><value name="x"><block type="math_number"><field name="NUM">-50</field></block></value><value name="y"><block type="math_number"><field name="NUM">-50</field></block></value><value name="width"><block type="math_number"><field name="NUM">100</field></block></value><value name="height"><block type="math_number"><field name="NUM">100</field></block></value><next><block type="variables_set"><field name="VAR">angle</field><value name="VALUE"><block type="math_arithmetic"><field name="OP">ADD</field><value name="A"><block type="variables_get"><field name="VAR">angle</field></block></value><value name="B"><block type="math_number"><field name="NUM">1</field></block></value></block></value></block></next></block></next></block></next></block></statement></block></next></block></statement></block><block type="setup" x="91" y="387"><statement name="code"><block type="variables_set"><field name="VAR">angle</field><value name="VALUE"><block type="math_number"><field name="NUM">0</field></block></value></block></statement></block></xml>';

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
            var animationName = prompt("enter animation name");
            if(!animationName){
                store
            }
            localStorage.setItem('data',Blockly.Xml.domToText(dom));
        };

        window.saveToNode = function(){
            var dom = Blockly.Xml.workspaceToDom(workspace);
            var serialized = Blockly.Xml.domToText(dom); 
            console.log(store);
        };
        
        window.load = function () {
            if(localStorage.data!=null){
                var xml = Blockly.Xml.textToDom(localStorage.data);
                Blockly.mainWorkspace.clear();
                Blockly.Xml.domToWorkspace( Blockly.mainWorkspace, xml );
                console.log("restored");
            }
        };
        var runAnim = function(anim){
            var ctx = document.getElementById("canvas").getContext("2d");
            try {
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
        window.execute  = function (){
            var dom = Blockly.Xml.workspaceToDom(workspace);
            Blockly.JavaScript.addReservedWords('code');
            var code = "define(function(){\n";
            code += Blockly.JavaScript.workspaceToCode(workspace);
            code += "\nvar xmlSource = '";
            code += Blockly.Xml.domToText(dom) + "';\n";
            code += "return { setup:setup, draw:draw, source: { code: xmlSource, lang: 'blockly' } };\n";
            code += "});\n";
            console.log(code);
            var uri = evileval.toDataUri(code);
            evileval.loadJsAnim(uri).then(function(anim){
                runAnim(anim);
            });
        };
        
    }
    return loadBlockly;
});
