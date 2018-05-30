define(['ui', 'net'], function(ui, net){
    var _view,
        _store,
        _controller;
    
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
                    _store.saveAnimation(currentCanvasAnim, fileName);
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

    var updateWithCanvasAnim = function(canvasAnim, parentId){
        currentCanvasAnim = canvasAnim;
        console.log(canvasAnim.animationName); 
        return canvasAnim.getSourceCode().then(function(source){
            // console.log('lang', source.lang);
            return provideViewForLang(source.lang, parentId)
                .then(function(view){
                    view.setEditorContent(canvasAnim.animationName, source);
                    view.show();
                });
        });
    };

    var displayInvalidity = function(err, canvasAnim){
        if(currentCanvasAnim === canvasAnim){
            //console.log(err);
            if(err){
                _view.displayCodeValidity(false);
            }else{
                _view.displayCodeValidity(true);
            }
        }
    };

    var updateCurrentView = function(newView){
        if(_view && _view !== newView){
            _view.hide();
        }
        _view = newView;
    };
    
    var provideViewForLang = function(lang, parentId){
        if(views[lang].editor){
            var newView = views[lang].editor;
            updateCurrentView(newView);
            return Promise.resolve(newView);
        }
        return new Promise(function(resolve, reject){
            require([views[lang].libName], function(makeView){
                makeView(_controller, parentId).then(function(newView){
                    updateCurrentView(newView);
                    views[lang].editor = newView;
                    _controller.displayInvalidity = displayInvalidity;
                    resolve(newView);
                });
            });
        });
    };
    
    var views = { javascript: { libName: 'editorViewAce', editor: null },
                  blockly: {libName: 'editorViewBlockly', editor: null } };
    return function(exquis, store){
        _controller = {
            assController: makeAssemblageController(exquis),
            animController: makeAnimationController(),
            textAreaController: makeTextAreaController(),
            updateWithCanvasAnim: updateWithCanvasAnim,
            provideViewForLang: provideViewForLang,
            displayInvalidity: (err, canvasAnim) => { if(err) { console.error(err); }}
        };
        _store = store;
        return _controller;
    };

});
