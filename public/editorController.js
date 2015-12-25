define(['ui', 'net', 'evileval'], function(ui, net, evileval){
    var _view;
    var _store;
    
    var makeAssemblageController = function(exquis){
        var controller = {
            load: function(){
              var pickAssemblage = function(chosenAssemblage){
                  document.location = "/assemblage/" + chosenAssemblage;
              };

              net.HTTPgetJSON("/assemblages/").then(function(files){
                files = files.filter(function(f){
                    return f.match(/\.json$/);
                }).map(function(f){
                    return f.replace(/\.json$/, "");
                });
                ui.populateNamePicker("choose assemblage", files).then(pickAssemblage);		
            });
          },
            save: function(){
                _store.saveAssemblage(exquis.assName, exquis.assemblage());
            },
            saveAs: function(){
                return ui.buildPrompt("enter file name")
                .then(function(fileName){
                    if(fileName == null){
                        throw "filename is null";
                    }
                    _store.saveAssemblage(fileName, exquis.assemblage());
                    exquis.assName = fileName;
                    history.pushState({},"...", fileName);
                    return exquis.assName;
                });
            },
            getAssemblageName: function(){
                return exquis.assName;
            }
        };
        return controller;
    };

    var currentCanvasAnim;
    var makeAnimationController = function(){

        var controller = {
            save: function(){
		_store.saveAnimation(currentCanvasAnim);
            },
	    saveAs: function(){
                return ui.buildPrompt("enter file name")
                .then(function(fileName){
                    if(fileName == null){
                        throw "filename is null";
                    }
                    _store.saveAnimation(currentCanvasAnim, null, fileName);
                    currentCanvasAnim.animationName = fileName;
                    return fileName;
                });
            }
        };

        return controller;
    };

    var makeTextAreaController = function(){
        var controller = {
            onCodeChange: function(codeString){
                return currentCanvasAnim.addCodeStringToEvaluate(codeString);
            }
        };
        return controller;
    };

    var updateWithCanvasAnim = function(canvasAnim){
        if(currentCanvasAnim){
            currentCanvasAnim.updateListener = null;
        }
        currentCanvasAnim = canvasAnim;
        currentCanvasAnim.updateListener = _view.setEditorContent;
        
        canvasAnim.getSourceCodeString().then(function(codeString){
            _view.setEditorContent(canvasAnim.animationName, codeString);
        });
    };

    var displayInvalidity = function(err, canvasAnim){
        if(currentCanvasAnim === canvasAnim){
            console.log(err);
            _view.displayCodeValidity(false);
        }
    };
    
    return function(exquis, makeEditorView, store){
        var controller = {
            assController: makeAssemblageController(exquis),
            animController: makeAnimationController(),
            textAreaController: makeTextAreaController(),
            updateWithCanvasAnim: updateWithCanvasAnim
        };
        _view = makeEditorView(controller);
        _store = store;
        controller.hide = _view.hide;
        controller.show = _view.show;
        controller.displayInvalidity = displayInvalidity;
        return controller;
    };

});
