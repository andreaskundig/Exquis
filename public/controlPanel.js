define(['csshelper', 'tabs' ], function(csshelper, tabs){

    var rootDom = document.getElementById('control-panel'),
        editorController,
        theCell,
        refreshActiveTab = tabs({tabsRoot: 'control-panel', tabs:[
            {name: "Animations", 
             initHandler: null,
             clickHandler: function(activeContentDiv){
                 console.log('anims content div', activeContentDiv);
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

    return {
        hide: hide,
        show: show,
        addEditor: addEditor
    };
});
