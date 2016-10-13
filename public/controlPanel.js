define(['csshelper', 'iter2d' ], function(csshelper){

    var rootDom = document.getElementById('control-panel'),
        editorController;
    
    var show = function(cell){
        csshelper.removeClass(rootDom, 'invisible');

        if(editorController){
            editorController.updateWithCanvasAnim(cell.canvasAnim);
        }
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
