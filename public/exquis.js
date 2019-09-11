"use strict";

define([ "csshelper", "evileval", "net", "menubar", "controlPanel", "assemblageController", "factory"], function(
    csshelper, evileval, net, menubar, makeControlPanel, makeAssemblageController, factory){

    const addCellUItoCell = function(cell){
        const {row, col}  = cell;
        const {height, width} = cell.context.canvas;
        cell.ui = makeCellUi(row, col, height, width);
    }

    const addHintToCell = function(cell){
        const {row, col}  = cell;
        const {height, width} = cell.context.canvas;

        cell.hint = factory.createCellDiv("hint", row, col, height, width);
        cell.hint.style.border = '1px solid rgba(200, 200, 200, 0.5)';
        cell.hint.style.width = (width - 2) + "px";
        cell.hint.style.height = (height - 2) + "px";
    }

    const addCodeHandling = canvasAnim => {
         return Object.assign(canvasAnim,{

            //TODO add the following functions in a further step
            // maybe as a subclass :O
            // then export the makeCanvasAnim function for use in observablehq
            addCodeStringToEvaluate: function(codeString){
                this.evaluateCode = function(){
                    return new Promise((resolve, reject) => {
                        var codeAsUri = evileval.toDataUri(codeString);
                        evileval.loadJsAnim(codeAsUri)
                            .then((evaluatedAnimationClone) => {
                                const animationName =
                                  net.extractAnimationNameFromUri(this.originalUrl);
                                this.setAnimation(evaluatedAnimationClone,
                                                  this.originalUrl, animationName);
                                this.codeCacheUri = codeAsUri;
                                resolve();
                            })
                            .catch( function(err){
                                console.log(err);
                                reject(err);
                            });
                    });
                };
            },
            
            loadAnim: function(url){
                return evileval.loadJsAnim(url).then(
                    function(evaluatedAnimationClone){
                        this.animationState = {};
                    // console.log('created animationState', this.animationState);
                    
                        const animationName =
                           net.extractAnimationNameFromUri(url);
                        this.setAnimation(evaluatedAnimationClone, url, animationName);
                        this.codeCacheUri = null;
                        return this;
                    }.bind(this));
            },

            getSourceCode: function(){
                if(this.currentCode.source){
                    // if the source code is not javascript
                    // it is stored in the attribute source
                    // of the current animation.
                    return Promise.resolve(this.currentCode.source);
                }
                return this.getSourceCodeString().then(function(scs){
                    return {code: scs, lang: 'javascript'};
                });
            },
            
            getSourceCodeString: function(){
                if (this.codeCacheUri){
                    // the code is in the cache
                    return new Promise(function(resolve, reject){
                        var animCodeString = evileval.dataUri2text(this.codeCacheUri);
                        resolve(animCodeString);
                    }.bind(this));
                }else{
                    // get the code from the internets
                    return net.HTTPget(this.originalUrl)
                        .then(function(animCodeString){
                            var url = this.originalUrl;
                            this.animationName =
                                net.extractAnimationNameFromUri(url);
                            return animCodeString;
                        }.bind(this));
                }
            }
         })
    };

    var makeCellUi = function(row, col, height, width){
        var cellUi = factory.createCellDiv("cellUi", row, col, height, width);
        return cellUi;
    };

    var addControlPanelIconHandler = function(cell, controlPanel){
        
        cell.ui.addEventListener('click', function(){
            csshelper.addClassForSelector('invisible','.hint');
            cell.hint.classList.remove('invisible');
            controlPanel.show(cell);
        });
    };

    var addEditor = function(exquis, controlPanel, editorController){
        exquis.editorController = editorController;
        controlPanel.addEditor(editorController);
    };
    
    var hideHints = function(){
        csshelper.addClassForSelector('invisible','.cellUi, .hint');
    };
    
    var showHints = function(){
        csshelper.removeClassForSelector('invisible','.cellUi, .hint');
    };
    
    var init = function (assName, animUris, makeEditorController, store, 
        {cellWidth=150, cellHeight=150}) {
        const exquis = {};
        const controlPanel = makeControlPanel(store);
        exquis.assName = assName;

        const dashboardWidth = animUris[0].length * cellWidth;
        const assemblageController = makeAssemblageController(exquis, store);

        menubar.init(dashboardWidth);
        menubar.addCloseListener(hideHints);
        menubar.addCloseListener(function(){
            controlPanel.hide();
        });
        menubar.addOpenListener(showHints);
        menubar.addAssemblageLoadListener(assemblageController.load);
        menubar.addAssemblageSaveAsListener(assemblageController.saveAs);
        
        var possiblyHideControlPanel = function(event){
            if (event.target.tagName === "HTML"){
                csshelper.removeClassForSelector('invisible','.hint');
                controlPanel.hide();
            }
        };
        document.addEventListener('click', possiblyHideControlPanel, true);
       
        const colCount = animUris.length;
        const rowCount = animUris[0].length;
        
        let parent = document.getElementById("dashboard");
        exquis.cells = factory.makeCells( colCount, rowCount, cellHeight, cellWidth, parent);

        factory.forEach2d(animUris, (animUri, rowIndex, colIndex) => {
            const cell = exquis.cells[rowIndex][colIndex];
            addHintToCell(cell);
            addCellUItoCell(cell);
            addControlPanelIconHandler(cell, controlPanel);
            addCodeHandling(cell.canvasAnim);
            cell.canvasAnim.loadAnim(animUri);
        });
        
        exquis.assemblage = function(){
            var animationNames = factory.map2d(
                this.cells, 
                function(cell, row, col){
                    return cell.canvasAnim.animationName;
                });
            return animationNames;
        };

        var editorController = makeEditorController(exquis, store);
        addEditor(exquis, controlPanel, editorController);

        var render = async function(){
            await factory.draw(exquis.cells, exquis.editorController.displayInvalidity);
            requestAnimationFrame(render);
        };
        render();

        return exquis;
    };


    return init;
    
});
