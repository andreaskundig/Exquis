define({
    addClass : function(element, className){
        if(element.className.match("\\b"+className+"\\b")) return;
	element.className += " "+className;
    },
    removeClass : function(element, className){
	element.className = element.className.replace(RegExp(" *"+className), "");
    }
}); 
