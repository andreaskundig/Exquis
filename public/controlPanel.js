define(['csshelper', 'iter2d' ], function(csshelper){

    var rootDom = document.getElementById('control-panel'),
        editorController;
    
    var show = function(cell){
        csshelper.removeClass(rootDom, 'invisible');

        if(editorController){
            editorController.updateWithCanvasAnim(cell.canvasAnim);
        }
    };

    var addEditor = function(zeEditorController){
        editorController = zeEditorController;
    };

    return {
        show: show,
        addEditor: addEditor
    };
});
