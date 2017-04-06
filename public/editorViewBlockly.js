define(['editorButtonRow'], function(makeButtonRow){
    
    var makeEditorDiv = function(buttonRow){
        var editorDiv = document.createElement('div');
        editorDiv.style.width = '100%';
        editorDiv.className = 'invisible';
        editorDiv.appendChild(buttonRow.div);
        editorDiv.insertAdjacentHTML('beforeend',
                                     '<div class="animation_editor"></div>');
        return editorDiv;
    };
    
    var injectBlocklyIframe = function(id, editorParent){
        return new Promise(function(resolve, reject){
            var editorContainer = editorParent.querySelector(".animation_editor"),
                iframe = document.createElement('iframe');

            iframe.id = id;
            iframe.src = '/blockly-editor.html';
            iframe.onload = function() {
                iframe.contentWindow.require( ["blockly-editor"], function(ed) {
                    resolve(ed);
                });
            };

            editorContainer.appendChild(iframe);
        });
    };
    
    var makeDisplayCodeValidity = function(){
        return function(valid){
            console.log('blockly code is valid:', valid);
        };
    };
    
    var makeEditorView = function(controller, parentId){
        
        var editorParent = document.getElementById(parentId), 
            buttonRow = makeButtonRow(controller),
            editor = makeEditorDiv(buttonRow),
            displayCodeValidity = makeDisplayCodeValidity() ; 
        editorParent.appendChild(editor);
        buttonRow.displayAssemblageName(controller.assController.getAssemblageName());

	var setEditorContent = function(animationName, animSource){
            document.getElementById('blockly-editor')
                .contentWindow
                .require( ["blockly-editor"], function(ed) {
                    ed.setEditorContent(animSource.code);
                });
            buttonRow.displayAnimationName(animationName);
            displayCodeValidity(true);
        };
	
	var theView = {
	    setEditorContent: setEditorContent,
            show: function(){
                editor.classList.remove("invisible");
            },
            hide: function(){
                editor.classList.add("invisible");
            },
            displayCodeValidity: displayCodeValidity
        };
        
        return injectBlocklyIframe('blockly-editor', editor).then(function(ed){
            ed.addChangeListener(function(animCode){
                controller.textAreaController.onCodeChange(animCode);
            });
            return theView;
        });
    };

    return makeEditorView;
});
