define(['csshelper', 'tabs' ], function(csshelper, tabs){

    var rootDom = document.getElementById('control-panel'),
        editorController,
        theCell,
        animationTools = tabs({tabsRoot: 'control-panel', tabs:[
            {name: "Animations", 
             initHandler: null,
             clickHandler: function(activeContent){
                 alert(activeContent);
             }},
            {name: "Editor", 
             initHandler: null,
             clickHandler: function(activeContent){
                 if (editorController) {
                     editorController.updateWithCanvasAnim(theCell.canvasAnim);
                 }
             }
        }]});
    
    var show = function(cell){
        theCell = cell;
        csshelper.removeClass(rootDom, 'invisible');
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
