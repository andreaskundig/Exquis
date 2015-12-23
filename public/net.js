"use strict";

define(["iter2d", "evileval"], function(iter2d, evileval){
    
    var extractAnimationNameFromUri = function(uri){
        var match = uri.match(/([^\/]+)\.js/);
        return match ? match[1] : uri;
    };

    var loadAssemblage = function(assName){
	var assemblagePath = "/assemblages/";
	
	assemblagePath += assName + ".json";
        return HTTPgetJSON(assemblagePath);
    };
    
   var makeAnimationPath = function (animName){
        if(/^https?:\/\//.exec(animName)){
            return animName;
        }
        return "/animations/" + animName + ".js";
    };
    
    var splitarray = function(input, spacing){
        var output = [];
        for (var i = 0; i < input.length; i += spacing){
            output[output.length] = input.slice(i, i + spacing);
        }
        return output;
    };

    var getAssemblageNameFromUrlOrDefaultWithUrlChange= function(){
	var name = window.location.pathname.substr("/assemblage/".length) || "assemblageAvecSinus";
        history.pushState({},"...", "/assemblage/" + name);
	return name;
    };
    
    var HTTPget = function(url) {
        // Return a new promise.
        return new Promise(function(resolve, reject) {
            // Do the usual XHR stuff
            var req = new XMLHttpRequest();
            req.open('GET', url);

            req.onload = function() {
                // This is called even on 404 etc
                // so check the status
                if (req.status == 200) {
                    // Resolve the promise with the response text
                    resolve(req.response);
                }
                else {
                    // Otherwise reject with the status text
                    // which will hopefully be a meaningful error
                    reject(Error(req.statusText));
                }
            };

            // Handle network errors
            req.onerror = function() {
                reject(Error("Network Error"));
            };

            // Make the request
            req.send();
        });
    };

    var HTTPgetJSON = function(url) {
        return HTTPget(url).then(JSON.parse);
    };

    return {
            getAssemblageNameFromUrlOrDefaultWithUrlChange: getAssemblageNameFromUrlOrDefaultWithUrlChange,
            loadAssemblage: loadAssemblage,
            makeAnimationPath: makeAnimationPath ,
            extractAnimationNameFromUri: extractAnimationNameFromUri, 
            HTTPgetJSON: HTTPgetJSON,
            HTTPget: HTTPget
           };
    
});
