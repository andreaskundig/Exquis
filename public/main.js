var main = function(net, exquisInit, makeEditorView, makeEditorController, store, iter2d){
    window.onerror = function(message, url, lineNumber){
        //console.log(message +" "+ url +" "+ lineNumber);
    };
    var assemblageName = net.getAssemblageNameFromUrlOrDefaultWithUrlChange();
    net.loadAssemblage(assemblageName)
        .then(function(animationNames){
            var animUris2DArray = iter2d.map2dArray(animationNames,
                                                    net.makeAnimationPath);
            var exquis =  exquisInit(assemblageName, animUris2DArray,
                                     makeEditorView, makeEditorController,
                                     store);
            // this is only for debugging in the console
            window.x = exquis;
        });
};

require(["net", "exquis", "editorView", "editorController", "nodestore", "iter2d", "lib/domReady!"], main);
