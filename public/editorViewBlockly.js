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

        
	var editor = document.getElementById("editor"),
            displayAssemblageName = makeTextContentSetter(document.getElementById("assemblage_name")),
            displayAnimationName = makeTextContentSetter(document.getElementById("filename_display")),
            animationEditor = document.getElementById("animation_editor"),
            displayCodeValidity = makeDisplayCodeValidity(animationEditor); 
        makeAnimationButtons(displayAnimationName);
        makeAssemblageButtons(displayAssemblageName);
        displayAssemblageName(assController.getAssemblageName());


        // aceEditor.setTheme("ace/theme/katzenmilch");
        // aceEditor.getSession().setMode("ace/mode/javascript");
        // aceEditor.renderer.setShowGutter(false);
        // aceEditor.setFontSize("14px");

	var setEditorContent = function(animationName, animSource){
            animationEditor.innerHtml = animSource.code;
            displayAnimationName(animationName);
            displayCodeValidity(true);
        };
	
	var theView = {
	    setEditorContent: setEditorContent,
	    show: function(){
                alert('show blockly editor');
		//editor.className = "";
	    },
	    hide: function(){
		// unselect edition
		//editor.className = "invisible";
	    },
            displayCodeValidity: displayCodeValidity
        };
        return theView;
    };

    return makeEditorView;
});
