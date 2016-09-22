define(["nodestore", "evileval"], function(store, evileval){
    var startcode ='<xml xmlns="http://www.w3.org/1999/xhtml"><block type="drawAnimation" x="33" y="27"><statement name="code"><block type="clear"><next><block type="transformation_sandbox"><statement name="transformations"><block type="translate"><value name="x"><block type="math_number"><field name="NUM">100</field></block></value><value name="y"><block type="math_number"><field name="NUM">100</field></block></value><next><block type="rotate"><value name="angle"><block type="variables_get"><field name="VAR">angle</field></block></value><next><block type="draw"><value name="shape"><block type="rectangle"><value name="position"><block type="point"><value name="x"><block type="math_number"><field name="NUM">-50</field></block></value><value name="y"><block type="math_number"><field name="NUM">-50</field></block></value></block></value><value name="dimension"><block type="dimension"><value name="width"><block type="math_number"><field name="NUM">100</field></block></value><value name="height"><block type="math_number"><field name="NUM">100</field></block></value></block></value></block></value><next><block type="variables_set"><field name="VAR">angle</field><value name="VALUE"><block type="math_arithmetic"><field name="OP">ADD</field><value name="A"><block type="variables_get"><field name="VAR">angle</field></block></value><value name="B"><block type="math_number"><field name="NUM">1</field></block></value></block></value></block></next></block></next></block></next></block></statement></block></next></block></statement></block><block type="setupAnimation" x="35" y="383"><statement name="code"><block type="variables_set"><field name="VAR">angle</field><value name="VALUE"><block type="math_number"><field name="NUM">0</field></block></value></block></statement></block></xml>';

    var workspace;
    var setXmlCode = function(xmlCode){
        var xml = Blockly.Xml.textToDom(xmlCode);
        Blockly.Xml.domToWorkspace( Blockly.mainWorkspace, xml );
    };

    
    workspace = Blockly.inject('blocklyDiv',
                               {toolbox: document.getElementById('toolbox')});

    window.save  = function (){
        var code = extractAnimationCodeString(),
            canvasAnim = {
                animationName: "blocklyAnimation",
                codeCacheUri: evileval.toDataUri(code)
            };

        store.saveAnimation(canvasAnim);
        //localStorage.setItem('data',Blockly.Xml.domToText(dom));
    };

    window.saveToNode = function(){
        var dom = Blockly.Xml.workspaceToDom(workspace);
        var serialized = Blockly.Xml.domToText(dom); 
        console.log(store);
    };
    
    window.load = function () {

        var uri = '/animations/blocklyAnimation.js';
        
        evileval.loadJsAnim(uri).then(function(anim){
            var xml = Blockly.Xml.textToDom(anim.source.code);
            Blockly.mainWorkspace.clear();
            Blockly.Xml.domToWorkspace( Blockly.mainWorkspace, xml);
        });
    };

    var extractAnimationCodeString = function(){
        var dom = Blockly.Xml.workspaceToDom(workspace);
        Blockly.JavaScript.addReservedWords('code');
        var code = "define(['bibs/canvasBuffer'], function(makeBuffer){\n";
        code += Blockly.JavaScript.workspaceToCode(workspace);
        code += "\nvar xmlSource = '";
        code += Blockly.Xml.domToText(dom) + "';\n";
        code += "return { setup: setupAnimation, draw: drawAnimation, source: { code: xmlSource, lang: 'blockly' } };\n";
        code += "});\n";
        // console.log(code);
        return code;
    };
    
    var addChangeListener = function(cb){
        workspace.addChangeListener(function(event){
            cb(extractAnimationCodeString());
        });
    };
    return {//TODO getSourceCode (?)
        addChangeListener: addChangeListener,
        setEditorContent: setXmlCode};
});
