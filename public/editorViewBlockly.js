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

        var injectHtml = function(){

            // 1 inject editor

            var editorContainer = document.getElementById("animation_editor"),
                editorHtml = [
                    '<div id="blockly_editor">',
                    '<div id="blocklyDiv" style="height: 570px; width: 800px;',
                    'position:absolute; top: 0px; left:0px"></div>',
                    '<xml id="toolbox" style="display: none">',
                    '<category name="standard">',
                    '<block type="controls_if"></block>',
                    '<block type="controls_repeat_ext"></block>',
                    '<block type="logic_compare"></block>',
                    '<block type="math_number"></block>',
                    '<block type="math_arithmetic"></block>',
                    '<block type="variables_set"></block>',
                    '<block type="variables_get"></block>',
                    '<block type="colour_picker"></block>',
                    '<block type="colour_random"></block>',
                    '<block type="text"></block>',
                    '</category>',
                    '<category name="exquis">',
                    '<block type="rotate"></block>',
                    '<block type="translate"></block>',
                    '<block type="fillcolour"></block>',
                    '<block type="clear"></block>',
                    '<block type="draw"></block>',
                    '<block type="rectangle"></block>',
                    '<block type="point"></block>',
                    '<block type="dimension"></block>',
                    '<block type="blankImage"></block>',
                    '<block type="border"></block>',
                    '<block type="takeSnapshot"></block>',
                    '<block type="drawImage"></block>',
                    '<block type="drawAnimation"></block>',
                    '<block type="setupAnimation"></block>',
                    '<block type="transformation_sandbox"></block>',
                    '</category>',
                    '</xml>',
                    '</div>'
                ].join('\n');

            editorContainer.innerHTML = editorHtml;

            // 2 inject scripts
            var scriptsContainer = document.getElementsByTagName('head')[0],
                scriptsHtml = [
                '<script src="/lib/blockly/blockly_compressed.js"></script>',
                '<script src="/lib/blockly/blocks_compressed.js"></script>',
                '<script src="/lib/blockly/msg/js/en.js"></script>',
                '<script src="/lib/blockly/javascript_compressed.js"></script>',
                '<script src="blk/draw.js"></script>',
                '<script src="blk/image.js"></script>',
                '<script src="blk/rotate.js"></script>',
                '<script src="blk/translate.js"></script>',
                '<script src="blk/clear.js"></script>',
                '<script src="blk/drawAnimation.js"></script>',
                '<script src="blk/setupAnimation.js"></script>',
                '<script src="blk/transformationSandbox.js"></script>'
            ].join('\n');
            scriptsContainer.insertAdjacentHTML('beforeend', scriptsHtml);
        };


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
