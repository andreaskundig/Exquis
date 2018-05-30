define(['csshelper', 'tabs', 'ui', 'paramController' ], function(csshelper, tabs, ui, paramController){
    
    var rootDom = document.getElementById('control-panel'),
        editorController,
        theCell,
        store,
        refreshActiveTab = tabs({tabsRoot: 'control-panel', tabs:[
            {name: "Animations", 
             initHandler: null,
             clickHandler: function(activeContentDiv){
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
             }},
            {name: "Parameters", 
             initHandler: null,
             clickHandler: function(activeContentDiv){
                 paramController.refreshController(activeContentDiv, theCell, editorController);
             }}
        ]});
    
    var show = function(cell){
        theCell = cell;
        //TODO create editor view if we have an editorController:
        // For this we need the parentId of the editor for source.lang
        // if(editorController){
        //     theCell.canvasAnim.getSourceCode().then(function(source){
        //         // console.log('lang', source.lang);
        //         return editorController.provideViewForLang(source.lang, parentId);
        //     });
        // } 
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
            canvasAnim.loadAnim(fileUri);
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
