define(function(){
    var changeClassForSelector =  function(add, className, selector){
        const elements = document.querySelectorAll(selector);
        for(let i=0; i<elements.length; i++){
            let el = elements[i]; 
            if(add){
                el.classList.add(className);
            }else{
                el.classList.remove(className);
            };
        };
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
