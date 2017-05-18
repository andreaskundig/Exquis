define([], function(){
    var dataUriPrefix = "data:text/javascript;base64,";
    
    var loadJsAnim = function(jsAnimPath){
        return new Promise(function(resolve, reject){
            // Our animation format takes the requirejs module as an object.
            // If we call require for an animation that was already loaded
            // requirejs returns the same animation object that it loaded the first time.
            // If the animation stores some state in a closure,
            // and is displayed several times on exquis,
            // every displayed animation has access to the shared state,
            // creating unwanted side effects, particularly with blockly.
            // To avoid this we add a random parameter to the url.
            // Another way to avoid this would be to change our module format
            // to return a function that creates an animation
            // instead of just an object, but this would make the code uglier.
            if(!jsAnimPath.startsWith(dataUriPrefix)){
                jsAnimPath += "?buster=" + (Date.now() + Math.round(10000000000 * Math.random()));
            }
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
        return dataUriPrefix + btoa(jsCode);
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
