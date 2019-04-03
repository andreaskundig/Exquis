var main = async function(net, exquisInit, makeEditorController, store, iter2d){
    window.onerror = function(message, url, lineNumber){
        //console.log(message +" "+ url +" "+ lineNumber);
    };
    var assemblageName = net.getAssemblageNameFromUrlOrDefaultWithUrlChange();
    var animationNames = await net.loadAssemblage(assemblageName);
    var animUris2DArray = iter2d.map2dArray(animationNames, net.makeAnimationPath);
    var exquis = exquisInit(assemblageName, animUris2DArray, makeEditorController, store,
                            {cellWidth: 150, cellHeight: 150} );
    // this is only for debugging in the console
    window.x = exquis;
};

require(["net", "exquis", "editorController", "nodestore", "iter2d", "lib/domReady!"], (...a) => {
    main(...a)
});
