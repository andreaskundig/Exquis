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
            displayAnimationName = makeTextContentSetter(buttonRowDiv.querySelector(".filename_display")),
            enableAnimationSave = (enable) => {
                [...buttonRowDiv.querySelectorAll('.editor-buttons button')].forEach( b => b.disabled = !enable);
            };
        addAnimationButtonListeners(displayAnimationName,
                                    controller.animController,
                                    buttonRowDiv);
        addAssemblageButtonListeners(displayAssemblageName,
                                     controller.assController,
                                     buttonRowDiv);
        return {div: buttonRowDiv,
                displayAssemblageName: displayAssemblageName,
                displayAnimationName: displayAnimationName,
                enableAnimationSave: enableAnimationSave};
    };
    
    return makeButtonRow;
});
