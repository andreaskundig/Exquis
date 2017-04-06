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
    
    var injectHtml = function(id, editorParent){
        var editorContainer = editorParent.querySelector(".animation_editor"),
            editorHtml = '<div id="'+id+'"></div>';
        editorContainer.insertAdjacentHTML('beforeend', editorHtml);
    };
    
    var makeDisplayCodeValidity = function(element){
        return function(valid){
            element.className = valid ? "code_valid" : "code_invalid";
        };
    };

    var makeDisplayCodeValidityForAce = function(aceEditor){
        return function(valid){
            aceEditor.setStyle( valid ? "code_valid" : "code_invalid");
            aceEditor.unsetStyle( !valid ? "code_valid" : "code_invalid");
        };
    };

    var addAceListener = function(aceEditor, displayCodeValidity, textAreaController){
        displayCodeValidity(true);
        
        aceEditor.getSession().on('change', function(e) {
            textAreaController.onCodeChange(aceEditor.getValue())
                .then(function(){
                    displayCodeValidity(true);  
                }, function(err){
                    console.log(err);
                    displayCodeValidity(false);
                });
        });
    };

    var insertAceJavascript = function(){
        var scriptContainer = document.getElementsByTagName('head')[0],
            scriptUrl = '/lib/ace/ace.js';
        return new Promise(function(resolve, reject){
            var scriptTag = document.createElement('script');
            scriptTag.src = scriptUrl;
            scriptTag.type = "text/javascript";
            scriptTag.charset = "utf-8";
            scriptTag.onload = function(){
                require(['ace/ace'], function(ace){
                    resolve(ace);
                });
            };
            scriptContainer.appendChild(scriptTag);
        });
    };
   
    var makeEditorView = function(controller, parentId){
        var editorParent = document.getElementById(parentId), 
            buttonRow = makeButtonRow(controller),
            editor = makeEditorDiv(buttonRow);
        editorParent.appendChild(editor); 
        var editorId = 'the_ace_editor'; 
        injectHtml(editorId, editorParent);
        
        var aceEditor,
            displayCodeValidity;
        return insertAceJavascript().then(function(ace){
            aceEditor = ace.edit(editorId);//"animation_editor"),
            displayCodeValidity = makeDisplayCodeValidityForAce(aceEditor); 
            addAceListener(aceEditor, displayCodeValidity, controller.textAreaController);
            buttonRow.displayAssemblageName(controller.assController.getAssemblageName());

            aceEditor.setTheme("ace/theme/katzenmilch");
            aceEditor.getSession().setMode("ace/mode/javascript");
            aceEditor.renderer.setShowGutter(false);
            aceEditor.setFontSize("14px");
            var setEditorContent = function(animationName, animSource){
                aceEditor.setValue(animSource.code);
                aceEditor.getSession().selection.clearSelection();
                
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
            return theView;
        });

    };

    return makeEditorView;
});
