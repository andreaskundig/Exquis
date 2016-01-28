"use strict";
/**
An implementation of the store using node as a server.
Different implementations of the store would save the animation in different places.
The original url of the animation is independent of the store
because we want exquis to be able to just display animations from any url.
The store needs to know where to save an animation based on its url.
Currently the original url is replaced by a data uri when it is first edited,
because it's only used to load the code. We need to keep it in order to save it.
*/
define(["net", "evileval"], function(net, evileval){
    var saveAnimation = function(canvasAnim, fileName){
        if (!canvasAnim.codeCacheUri){
            // promise that always fails
            return Promise.reject('no code to save');
        }
        var JSString = evileval.dataUri2text(canvasAnim.codeCacheUri),
            dirName = "animations",
            name = (fileName || canvasAnim.animationName) + ".js";
        return saveFile(dirName, name, JSString);
    };

    var saveAssemblage = function(assName, assemblage){
        var JSONString = JSON.stringify(assemblage),
            dirName = "assemblages",
            name = assName + ".json";
            
        return saveFile(dirName, name, JSONString);
    };
    
    var saveFile = function(dirName, fileName, content){
        var path = "/" + dirName + "/" + fileName,
            headers = { "Content-type": "application/x-www-form-urlencoded" };
        return net.HTTPpost(path, headers, content);
    };
    
    var animationNameToUri = function(animationName){
        return "/animations/"+animationName + ".js";
    };
    
    var uriToAnimationName = function(uri){
        var match = uri.match(/([^\/]+)\.js/);
        return match ? match[1] : uri;
    };
    
    var loadAnimationList = function(){
        return net.HTTPgetJSON("/animations/").then(function(files){
            return files.filter(function(f){
                return f.match(/\.js$/);
            }).map(function(storeFileUri){
                return "/animations/" + storeFileUri; 
            });
	});
    };

    return {loadAnimationList: loadAnimationList,
            saveAssemblage: saveAssemblage,
            saveAnimation: saveAnimation,
            uriToAnimationName: uriToAnimationName,
            animationNameToUri: animationNameToUri };
});
