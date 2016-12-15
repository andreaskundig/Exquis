define([], function(){
    var makeEditorHtml = function(){
        return ['<div class="invisible" id="editor">',
                '    <div id="assemblage">',
                '        <h2 id="assemblage_name"></h2> ',
                '        <div id="assemblage-buttons">',
                '            <button id="assemblage_load_button" class="btn" type="button">load</button>',
                '            <button id="assemblage_save_button" class="btn" type="button">save</button>',
                '            <button id="assemblage_save_as_button" class="btn" type="button">save as</button>',
                '        </div>',
                '    </div>',
                '    <div >',
                '        <h3 id="filename_display"></h3> ',
                '        <div id="editor-buttons">',
                '            <button id="animation_save_button" class="btn" type="button">save</button>',
                '            <button id="animation_save_as_button" class="btn" type="button">save as</button>',
                '        </div>',
                '        <div id="animation_editor">',
                '        </div>',
                '    </div>',
                '</div>'].join('\n');
    };
    
    var makeTextContentSetter = function(domElement){
        return function(name){
            domElement.textContent = name;
        };
    };

    var addAssemblageButtonListeners = function(displayAssemblageName, assController){
        var assemblageLoadButton = document.getElementById("assemblage_load_button"),
            assemblageSaveButton = document.getElementById("assemblage_save_button"),
            assemblageSaveAsButton = document.getElementById("assemblage_save_as_button");

        var assemblageSaveAs = function(){
            assController.saveAs().then(displayAssemblageName);
        };

        assemblageLoadButton.addEventListener('click', assController.load, true);
        assemblageSaveButton.addEventListener('click', assController.save, true);
        assemblageSaveAsButton.addEventListener('click', assemblageSaveAs, true);
    };
    
    var addAnimationButtonListeners = function(displayAnimationName, animController) {

        var animSaveButton = document.getElementById("animation_save_button"),
            animSaveAsButton = document.getElementById("animation_save_as_button");

        
        animSaveButton.addEventListener('click', animController.save, true);

        var animSaveAs = function(){
            animController.saveAs().then(displayAnimationName);
        };
        animSaveAsButton.addEventListener('click', animSaveAs, true);
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

    var injectHtml = function(id){
        var editorContainer = document.getElementById("animation_editor"),
            editorHtml = '<div id="'+id+'"></div>';

        if(editorContainer.firstChild){
            editorContainer.removeChild(editorContainer.firstChild);
        }
        editorContainer.insertAdjacentHTML('beforeend', editorHtml);
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

        var editorParent = document.getElementById(parentId);
        //TODO only if it's empty? or maybe this function is called only once?
        editorParent.innerHtml = makeEditorHtml(); 
        var editor = editorParent.querySelector("#editor"),
            displayAssemblageName = makeTextContentSetter(editorParent.querySelector("#assemblage_name")),
            displayAnimationName = makeTextContentSetter(editorParent.querySelector("#filename_display"));
        var editorId = 'the_ace_editor'; 
        injectHtml(editorId);
        
        var aceEditor,
            displayCodeValidity; 
        return insertAceJavascript().then(function(ace){
            aceEditor = ace.edit(editorId);//"animation_editor"),
            displayCodeValidity = makeDisplayCodeValidityForAce(aceEditor); 
            addAceListener(aceEditor, displayCodeValidity, controller.textAreaController);
            addAnimationButtonListeners(displayAnimationName, controller.animController);
            addAssemblageButtonListeners(displayAssemblageName, controller.assController);
            displayAssemblageName(controller.assController.getAssemblageName());

            aceEditor.setTheme("ace/theme/katzenmilch");
            aceEditor.getSession().setMode("ace/mode/javascript");
            aceEditor.renderer.setShowGutter(false);
            aceEditor.setFontSize("14px");
            var setEditorContent = function(animationName, animSource){
                aceEditor.setValue(animSource.code);
                aceEditor.getSession().selection.clearSelection();
                
                displayAnimationName(animationName);
                displayCodeValidity(true);
            };
            
            var theView = {
                setEditorContent: setEditorContent,
                show: function(){
                    editor.className = "";
                },
                hide: function(){
                    editor.className = "invisible";
                },
                displayCodeValidity: displayCodeValidity
            };
            return theView;
        });

    };

    return makeEditorView;
});
