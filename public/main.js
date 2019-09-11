var main = async function(net, exquisInit, makeEditorController, store, factory){
    window.onerror = function(message, url, lineNumber){
        //console.log(message +" "+ url +" "+ lineNumber);
    };
    var assemblageName = net.getAssemblageNameFromUrlOrDefaultWithUrlChange();
    var animationNames = await net.loadAssemblage(assemblageName);
    var animUris2DArray = factory.map2d(animationNames, net.makeAnimationPath);
    var exquis = exquisInit(assemblageName, animUris2DArray, makeEditorController, store,
                            {cellWidth: 75, cellHeight: 75} );
    // this is only for debugging in the console
    window.x = exquis;
};

require(["net", "exquis", "editorController", "nodestore", "factory", "lib/domReady!"], (...a) => {
    main(...a)
});
