define(['csshelper'], function(csshelper){

    var rootDiv = document.getElementById('menubar'),
        menubarOpen = document.getElementById('menubar-open'),
        menubarClose = document.getElementById('menubar-close'),
        menubarDetails = document.getElementById('menubar-details'),
        menubarAssemblageLoad = document.getElementById('menubar-assemblage-load'),
        menubarAssemblageSaveAs = document.getElementById('menubar-assemblage-save-as');

    menubarOpen.addEventListener('click', function(e){
        // 1 switch visibility with menubarClose
        menubarDetails.classList.remove('invisible');
        menubarOpen.classList.add('invisible');
    });
    
    menubarClose.addEventListener('click', function(e){
        // 1 switch visibility with menubarOpen
        menubarOpen.classList.remove('invisible');
        menubarDetails.classList.add('invisible');
    });
    
    var init = function(dashboardWidth){
        rootDiv.style.width = dashboardWidth + "px";
        rootDiv.style.textAlign = 'left';

        menubarOpen.classList.add('invisible');
    };

    var addOpenListener = function(listener){
        menubarOpen.addEventListener('click', listener);
    };
    
    var addCloseListener = function(listener){
        menubarClose.addEventListener('click', listener);
    };

    var addAssemblageLoadListener = function(listener){
        menubarAssemblageLoad.addEventListener('click', listener);
    };

    var addAssemblageSaveAsListener = function(listener){
        menubarAssemblageSaveAs.addEventListener('click', listener);
    };
    
    return {
        init: init,
        addOpenListener: addOpenListener,
        addCloseListener: addCloseListener,
        addAssemblageLoadListener: addAssemblageLoadListener,
        addAssemblageSaveAsListener: addAssemblageSaveAsListener
    };
});
