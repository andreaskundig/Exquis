define([], function(){
    var makeButtonRow = function(controller){
        var makeButtonRowDiv = function(){
            //TODO make all ids unique by prefixing them with parent id,
            // or even better, use classes instead, or firstchild etc..
            var div = document.createElement('div');
            div.innerHTML = [
                '<div >',
                '    <h3 class="filename_display"></h3> ',
                '    <div class="editor-buttons">',
                '        <button class="animation_save_button btn" type="button">save</button>',
                '        <button class="animation_save_as_button btn" type="button">save as</button>',
                '    </div>',
                '</div>'].join('\n');
            return div;
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
            displayAnimationName = makeTextContentSetter(buttonRowDiv.querySelector(".filename_display")),
            enableAnimationSave = (enable) => {
                [...buttonRowDiv.querySelectorAll('.editor-buttons button')].forEach( b => {
                    b.disabled = !enable;
                });
            };
        addAnimationButtonListeners(displayAnimationName,
                                    controller.animController,
                                    buttonRowDiv);
        return {div: buttonRowDiv,
                displayAnimationName: displayAnimationName,
                enableAnimationSave: enableAnimationSave};
    };
    
    return makeButtonRow;
});
