define([], function(){

    var loadJsAnim = function(jsAnimPath){
        return new Promise(function(resolve, reject){
            require([jsAnimPath],
                    function(evaluatedAnimation){
                        resolve(Object.create(evaluatedAnimation));
                    },
                    function(err){
                        reject(err);
                    });
        });
    };
    
    var toDataUri = function(jsCode){
        return "data:text/javascript;base64," + btoa(jsCode);
    },

    dataUri2text = function(uri){
        return atob(uri.substr(28));
    };
	
    return {
        loadJsAnim: loadJsAnim , 
        toDataUri: toDataUri,
        dataUri2text: dataUri2text
    };

});
