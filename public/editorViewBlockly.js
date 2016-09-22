define([], function(){
    var makeEditorView = function(controller){
        var assController = controller.assController,
            animController = controller.animController,
            textAreaController = controller.textAreaController;

        var makeTextContentSetter = function(domElement){
            return function(name){
                domElement.textContent = name;
            };
        };

	var makeAssemblageButtons = function(displayAssemblageName){
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
        
        var makeAnimationButtons = function(displayAnimationName) {

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
        
	var editorDom = document.getElementById("editor"),
            displayAssemblageName = makeTextContentSetter(document.getElementById("assemblage_name")),
            displayAnimationName = makeTextContentSetter(document.getElementById("filename_display")),
            animationEditor = document.getElementById("animation_editor"),
            displayCodeValidity = makeDisplayCodeValidity(animationEditor); 
        makeAnimationButtons(displayAnimationName);
        makeAssemblageButtons(displayAssemblageName);
        displayAssemblageName(assController.getAssemblageName());

        var injectBlocklyIframe = function(id){
            return new Promise(function(resolve, reject){
                var editorContainer = document.getElementById("animation_editor"),
                    iframe = document.createElement('iframe');

                iframe.id = id;
                iframe.src = '/blockly-editor.html';
                iframe.onload = function() {
                    iframe.contentWindow.require( ["blockly-editor"], function(ed) {
                        resolve(ed);
                    });
                };

                // TODO the ace editor sets listeners for the buttons.
                // this is not the job of the editor, move it somewhere else...
                // addAnimationButtonListeners(displayAnimationName);
                // addAssemblageButtonListeners(displayAssemblageName);
                if(editorContainer.firstChild){
                    editorContainer.removeChild(editorContainer.firstChild);
                }
                editorContainer.appendChild(iframe);
            });
        };

	var setEditorContent = function(animationName, animSource){
            document.getElementById('blockly-editor')
                .contentWindow
                .require( ["blockly-editor"], function(ed) {
                    ed.setEditorContent(animSource.code);
                });
            displayAnimationName(animationName);
            displayCodeValidity(true);
        };
	
	var theView = {
	    setEditorContent: setEditorContent,
            show: function(){
                editorDom.className = "editor_full_width";
            },
            hide: function(){
                editorDom.className = "invisible";
            },
            displayCodeValidity: displayCodeValidity
        };
        
        return injectBlocklyIframe('blockly-editor').then(function(ed){
            ed.addChangeListener(function(animCode){
                textAreaController.onCodeChange(animCode);
            });
            return theView;
        });
    };

    return makeEditorView;
});
