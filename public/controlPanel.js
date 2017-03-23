define(['csshelper', 'tabs', 'ui' ], function(csshelper, tabs, ui){

    var rootDom = document.getElementById('control-panel'),
        editorController,
        theCell,
        store,
        refreshActiveTab = tabs({tabsRoot: 'control-panel', tabs:[
            {name: "Animations", 
             initHandler: null,
             clickHandler: function(activeContentDiv){
                 console.log('anims content div', activeContentDiv);
                 var chooseAnimation = makeChooseAnimation(theCell.canvasAnim, store);
                 chooseAnimation(activeContentDiv);
             }},
            {name: "Editor", 
             initHandler: null,
             clickHandler: function(activeContentDiv){
                 var parentId = activeContentDiv.id;
                 if (editorController) {
                     editorController.updateWithCanvasAnim(theCell.canvasAnim, parentId);
                 }
             }
        }]});
    
    var show = function(cell){
        theCell = cell;
        csshelper.removeClass(rootDom, 'invisible');
        refreshActiveTab();
    };

    var hide = function(){
        csshelper.addClass(rootDom, 'invisible');
    };
    
    var addEditor = function(zeEditorController){
        editorController = zeEditorController;
    };

    //TODO use this in animation tab
    var makeChooseAnimation = function(canvasAnim, store){
        var loadAnimation = function(animationName){
            if (!animationName){
                return;
            }
            var fileUri = store.animationNameToUri(animationName);
            canvasAnim.loadAnim(fileUri)
                .then(function(canvasAnim){
                    return canvasAnim.getSourceCode();
                }).then(function(source){
                    if(canvasAnim.updateListener){
                        canvasAnim.updateListener(canvasAnim.animationName, 
                                                  source);
                    }
                }).catch(function(e){
                    console.log(e);
                });;
        };
        
        var chooseAnimation = function(parent){
            store.loadAnimationList().then(function(fileUris){
                var names = fileUris.map(store.uriToAnimationName);
                ui.createList(parent, names, loadAnimation, canvasAnim.animationName);
            });
        };
        return chooseAnimation;
    };
    var makeControlPanel = function(zeStore){
        store = zeStore;
        return {
            hide: hide,
            show: show,
            addEditor: addEditor
        };
    };
    
    return makeControlPanel;
});
