define(['ui', 'net'], function(ui, net){
   
    var makeAssemblageController = function(exquis, store){
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
                store.saveAssemblage(exquis.assName, exquis.assemblage());
            },
            saveAs: function(){
                return ui.buildPrompt("enter file name")
                .then(function(fileName){
                    if(fileName == null){
                        throw "filename is null";
                    }
                    store.saveAssemblage(fileName, exquis.assemblage());
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

    return function(exquis, store){
        return makeAssemblageController(exquis, store);
    };

});
