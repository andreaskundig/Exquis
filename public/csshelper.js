define(function(){
    var changeClassForSelector =  function(add, className, selector){
        document.querySelectorAll(selector).forEach(
            function(el){
                if(add){
                    el.classList.add('invisible');
                }else{
                    el.classList.remove('invisible');
                };
            });
    };
    
    return {
        addClass : function(element, className){
            element.classList.add(className);
        },
        removeClass : function(element, className){
            element.classList.remove(className);
        },
        addClassForSelector : function(className, selector){
            changeClassForSelector(true, className, selector);
        },
        removeClassForSelector : function(className, selector){
            changeClassForSelector(false, className, selector);
        }
    };
}); 
