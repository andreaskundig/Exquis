define(['csshelper'], function(csshelper){

    var rootDiv = document.getElementById('menubar'),
        menubarOpen = document.getElementById('menubar-open'),
        menubarClose = document.getElementById('menubar-close');
    

    menubarOpen.addEventListener('click', function(e){
        // 1 switch visibility with menubarClose
        csshelper.removeClass(menubarClose, 'invisible');
        csshelper.addClass(menubarOpen, 'invisible');
    });
    
    menubarClose.addEventListener('click', function(e){
        // 1 switch visibility with menubarClose
        csshelper.removeClass(menubarOpen, 'invisible');
        csshelper.addClass(menubarClose, 'invisible');
    });
    
    var init = function(dashboardWidth){
        rootDiv.style.width = dashboardWidth + "px";
        rootDiv.style.textAlign = 'left';
        
        csshelper.addClass(menubarClose, 'invisible');
    };

    var addOpenListener = function(listener){
        menubarOpen.addEventListener('click', listener);
    };
    
    var addCloseListener = function(listener){
        menubarClose.addEventListener('click', listener);
    };

    return {
        init: init,
        addOpenListener: addOpenListener,
        addCloseListener: addCloseListener
    };
});
