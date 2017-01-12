define([], function(){
    var makeButtonRow = function(controller){
        var makeButtonRowDiv = function(){
            //TODO make all ids unique by prefixing them with parent id,
            // or even better, use classes instead, or firstchild etc..
            var div = document.createElement('div');
            div.innerHTML = [
                '<div id="assemblage">',
                '    <h2 class="assemblage_name"></h2> ',
                '    <div id="assemblage-buttons">',
                '        <button class="assemblage_load_button btn" type="button">load</button>',
                '        <button class="assemblage_save_button btn" type="button">save</button>',
                '        <button class="assemblage_save_as_button btn" type="button">save as</button>',
                '    </div>',
                '</div>',
                '<div >',
                '    <h3 class="filename_display"></h3> ',
                '    <div id="editor-buttons">',
                '        <button class="animation_save_button btn" type="button">save</button>',
                '        <button class="animation_save_as_button btn" type="button">save as</button>',
                '    </div>',
                '</div>'].join('\n');
            return div;
        };
        
        var addAssemblageButtonListeners = function(displayAssemblageName, assController, editorParent){
            var assemblageLoadButton = editorParent.querySelector(".assemblage_load_button"),
                assemblageSaveButton = editorParent.querySelector(".assemblage_save_button"),
                assemblageSaveAsButton = editorParent.querySelector(".assemblage_save_as_button");

            var assemblageSaveAs = function(){
                assController.saveAs().then(displayAssemblageName);
            };

            assemblageLoadButton.addEventListener('click', assController.load, true);
            assemblageSaveButton.addEventListener('click', assController.save, true);
            assemblageSaveAsButton.addEventListener('click', assemblageSaveAs, true);
        };
        
        var addAnimationButtonListeners = function(displayAnimationName, animController, editorParent) {

            var animSaveButton = editorParent.querySelector(".animation_save_button"),
                animSaveAsButton = editorParent.querySelector(".animation_save_as_button");

            
            animSaveButton.addEventListener('click', animController.save, true);

            var animSaveAs = function(){
                animController.saveAs().then(displayAnimationName);
            };
            animSaveAsButton.addEventListener('click', animSaveAs, true);
        };

        var makeTextContentSetter = function(domElement){
            return function(name){
                domElement.textContent = name;
            };
        };

        var buttonRowDiv = makeButtonRowDiv(),
            displayAssemblageName = makeTextContentSetter(buttonRowDiv.querySelector(".assemblage_name")),
            displayAnimationName = makeTextContentSetter(buttonRowDiv.querySelector(".filename_display"));
        addAnimationButtonListeners(displayAnimationName,
                                    controller.animController,
                                    buttonRowDiv);
        addAssemblageButtonListeners(displayAssemblageName,
                                     controller.assController,
                                     buttonRowDiv);
        return {div: buttonRowDiv,
                displayAssemblageName: displayAssemblageName,
                displayAnimationName: displayAnimationName};
    };


    var makeEditorDiv = function(buttonRow){
        var editorDiv = document.createElement('div');
        editorDiv.className = 'invisible editor';
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
                
                displayAnimationName(animationName);
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
