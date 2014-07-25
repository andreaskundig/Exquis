define([], function(){

    var evalAnimation = function(exquis, codeString, canvasAnim, onLoadCallback){
        var jsAnimPath = toDataUri(codeString);
        loadJsAnimOnCanvasAnimP(jsAnimPath, canvasAnim, canvasAnim.animationName).then(onLoadCallback);
    },
        
    loadJsAnimOnCanvasAnimP = function(jsAnimPath, canvasAnim, animationName){
        return new Promise(function(resolve, reject){
            require([jsAnimPath],
                    function(animation){
                        var animationClone = Object.create(animation);
                        canvasAnim.uri = jsAnimPath;
                        canvasAnim.animationName = animationName;
                        canvasAnim.animationToSetup = animationClone;
	                if(canvasAnim.hasOwnProperty("setup")){
                            canvasAnim.setup();
                        }
                        resolve(canvasAnim);
                    },
                   function(err){
                       reject(err);
                   });
        });
    },
        
    toDataUri = function(jsCode){
        return "data:text/javascript;base64," + btoa(jsCode);
    },

    dataUri2text = function(uri){
        return atob(uri.substr(28));
    },
        
    // this is only used by the json2js script for converting legacy animations
    stringifyJSON = function (jsonAnim){
        var string = "define({libs:" + jsonAnim.libs + ",\n";
        string += "setup: function(context, lib){\n"+ jsonAnim.setup +"},\n";
        string += "draw: function(context, borders, lib){\n"+ jsonAnim.draw +"}});";
        return string; 
    };
	
    return {
        loadJsAnimOnCanvasAnimP:loadJsAnimOnCanvasAnimP,
        evalAnimation: evalAnimation,
        toDataUri: toDataUri,
        dataUri2text: dataUri2text,
        stringifyJSON: stringifyJSON  
    };

});
