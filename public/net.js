"use strict";

define(["iter2d"], function(iter2d){
    
    var loadJsons = function(jsons, callback ){

        var results = {};
        var counter = 0;
        // TODO handle js and json
        var handleJson = function(result, path){
            var name =  /animations\/(\w+)\.json/.exec(path)[1];
            results[name] = result;
            counter ++;
            if (counter == jsons.length ){
                callback(results);
            }
        };
        for(var i=0; i<jsons.length; i++){
           loadJson(jsons[i], handleJson);
        }

    };

    var loadJsons2d = function(jsons, callback ){

        var results = [];
        var totalFileCount = 0;
        for(var i=0; i<jsons.length; i++){
          totalFileCount += jsons[i].length;
        }

        var loadedFileCount = 0;

        var handleJson = function(result, path, position){
                var name =  /animations\/(\w+)\.js(on)?/.exec(path)[1];
                
                if(results[position.row] === undefined){
                  results[position.row] = [];
                }

                results[position.row][position.col] = { animation: result,
                                                        name: name };
                loadedFileCount++;

                if (loadedFileCount === totalFileCount){
                    callback(results);
                }
        };

        for(var i=0; i<jsons.length; i++){
          var lastrow = i == (jsons.length - 1);
          for(var j=0; j<jsons[i].length; j++){
             var position = {row: i, col: j};
             loadJson(jsons[i][j], handleJson, position);
          }
        }

    };

    //TODO add an error handler callback
    var loadJson = function(path, callback, callbackRestArgs){
        console.log(path);
        if(path.match(/.js$/)){
            //TODO this line appears 3 times in this file goddammit
            var name =  /animations\/(\w+)\.js(on)?/.exec(path)[1];
            callback(name, path, callbackRestArgs);
            return;
        }
        
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState==4 && xmlhttp.status==200){
                var result = JSON.parse(xmlhttp.responseText);
                callback(result, path, callbackRestArgs);
            }
        };
        xmlhttp.open("GET", path, true);
        xmlhttp.send();
    };

    var saveAnimation = function(cell, callback, fileName){
        var JSONString = JSON.stringify({ libs: cell.animation.libsString,
					  setup: cell.animation.setupString,
                                          draw : cell.animation.drawString }),
            dirName = "animations",
            name = (fileName || cell.animationName) + ".json";

        saveFile(dirName, name, JSONString, callback);
    };

    var saveAssemblage = function(assName, assemblage, callback){
        var JSONString = JSON.stringify(assemblage),
            dirName = "assemblages",
            name = assName + ".json";
            
        saveFile(dirName, name, JSONString, callback);
    };
    
    var saveFile = function(dirName, fileName, content, callback){
        var path = "/" + dirName + "/" + fileName,
            params = encodeURIComponent(content), 
            ajax = new XMLHttpRequest();

        ajax.open("POST", path, true);
        ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        ajax.onreadystatechange = callback;
        ajax.send(params);
        
    };

    
    var makeAnimationFileName = function(animationName){
        var name = "/animations/"+animationName;
	return name.match(/.js$/) ? name : name + ".json";
    };

    var loadAssemblage = function(exquis, assName, handleJsonAnimations){
	var assemblagePath = "/assemblages/";
	
        if(!assName){
            assName =  "assemblageAvecSinus",
            history.pushState({},"...", "/assemblage/" + assName);
        }
	assemblagePath += assName + ".json";

        loadJson(assemblagePath, function(assemblage){
            
            var animationNames = iter2d.map2dArray(assemblage, makeAnimationFileName);

            loadJsons2d(animationNames, function(jsonAnimations){
                handleJsonAnimations(exquis, assName, jsonAnimations);
            });
            
        });
    };


    var loadAnimations = function(exquis, handleJsonAnimations){
	var name = window.location.pathname.substr("/assemblage/".length);
	loadAssemblage(exquis, name, handleJsonAnimations);
    };

    return {saveAnimation: saveAnimation,
	    loadAnimations: loadAnimations,
	    loadJson: loadJson,
	    makeJsonName: makeAnimationFileName,
            saveAssemblage: saveAssemblage};
    
});
