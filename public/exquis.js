"use strict";

define(["iter2d", "csshelper", "evileval", "net", "ui", "menubar", "controlPanel"], function(
    iter2d, csshelper, evileval, net, ui, menubar, makeControlPanel){

    var makeCell = function(row, col, height, width){
        var canvas = makeCanvas(row, col, height, width), 
            context = canvas.getContext("2d"), 
            cell = {};
        cell.context = context;
        cell.hint = createCellDiv("hint invisible", row, col, height, width);
        cell.hint.style.border = '1px solid rgba(200, 200, 200, 0.5)';
        cell.ui = makeCellUi(row, col, height, width);
        return cell;
    };

    var makeCanvasAnimation = function(context){
        return {
            creation: Date.now(),
            currentCode: null,
            context: context, //might be useful to debug
            borders : function(){
                return {
                    north: context.getImageData(0, 0, context.canvas.width, 1),
                    south: context.getImageData(0, context.canvas.height - 1,
                                                context.canvas.width, 1),
                    east: context.getImageData(context.canvas.width - 1, 0,
                                               1 , context.canvas.height),
                    west: context.getImageData(0, 0, 1, context.canvas.height)
                };
            },

            draw : function(borders){
                if(!this.currentCode || !this.currentCode.draw){
                    return;
                }

                this.currentCode.draw(context, borders);
            },

            addCodeStringToEvaluate: function(codeString){
                return new Promise(function(resolve, reject){
                    this.evaluateCode = function(){
                        var codeAsUri = evileval.toDataUri(codeString);
                        evileval.loadJsAnim(codeAsUri)
                            .then(function(evaluatedAnimationClone){
                                this.setAnimation(evaluatedAnimationClone,
                                                  this.originalUrl);
                                this.codeCacheUri = codeAsUri;
                                resolve();
                            }.bind(this))
                            .catch( function(err){
                                console.log(err);
                                reject(err);
                            });
                    };
                }.bind(this));
            },
            
            loadAnim: function(url){
                return evileval.loadJsAnim(url).then(
                    function(evaluatedAnimationClone){
                        this.setAnimation(evaluatedAnimationClone, url);
                        this.codeCacheUri = null;
                        return this;
                    }.bind(this));
            },

            setAnimation: function(animationCloneToSetup, uri){
                if(this.currentCode && this.currentCode.tearDown){
                    this.currentCode.tearDown(context);
                }
                this.animationCloneToSetup = animationCloneToSetup;
                this.animationName = net.extractAnimationNameFromUri(uri),
                this.originalUrl = uri;
                this.setup = function(){
                    // force reset matrix
                    context.setTransform(1, 0, 0, 1, 0, 0);
                    // because using paper.js resizes the canvas
                    // dependending on screen dpi 
                    context.canvas.width = 150;
                    context.canvas.height = 150;
                    this.animationCloneToSetup.setup(context);
                    this.currentCode = this.animationCloneToSetup;
                };

                this.setup();
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
        };
    };

    var relativeCoordinates = {
        north : {row: -1, col: 0, opposite: "south"},
        south : {row: 1, col: 0, opposite: "north"},
        west : {row: 0, col: -1, opposite: "east"},
        east : {row: 0, col: 1, opposite: "west"}
    };


    var makeCanvas = function(row, col, height, width){
        var canvas = document.createElement('canvas');
        canvas.id = "canvas-" + row + "-" + col;
        canvas.className = "cell";
        canvas.width = width;
        canvas.height = height;
        canvas.style.top = (height * row)+"px";
        canvas.style.left = (width * col)+"px";

        document.getElementById('dashboard').appendChild(canvas);
        return canvas;
    };

    var createCellDiv = function(className, row, col, height, width){
        var cellDiv = document.createElement('div');
        cellDiv.id = className + "-" + row + "-" + col;
        cellDiv.className = className;
        cellDiv.style.top = (height * row)+"px";
        cellDiv.style.left = (width * col)+"px";
        
        document.getElementById('dashboard').appendChild(cellDiv);
        return cellDiv;
    };

    var makeIcon = function(classNames, id){
        var icon = document.createElement('span');
        icon.style.cursor = "pointer"; 
        icon.className = classNames;
        if(id){
            icon.id = id;
        }
        return icon;
    };
    
    var controlPanelIconSuffix = "-control-panel-icon";
    var makeCellUi = function(row, col, height, width){
        var cellUi = createCellDiv("cellUi", row, col, height, width);


        var controlPanelIcon = makeIcon("fa fa-cog fa-lg",
                                        cellUi.id + controlPanelIconSuffix);
        cellUi.appendChild(controlPanelIcon);
        
        return cellUi;
    };

    var addControlPanelIconHandler = function(cell, controlPanel){
        var controlPanelIcon = document.getElementById(cell.ui.id + controlPanelIconSuffix);
        
        controlPanelIcon.addEventListener('click', function(){
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
    
    var init = function (assName, animUris, makeEditorController, store) {
        var container = document.getElementById("container"),
            exquis = {},
            controlPanel = makeControlPanel(store);
        exquis.assName = assName;

        var cellWidth = 150,
            cellHeight = 150,
            dashboardWidth = animUris[0].length * cellWidth,
            dashboard = document.getElementById('dashboard');

        menubar.init(dashboardWidth);
        menubar.addCloseListener(hideHints);
        menubar.addCloseListener(function(){
            controlPanel.hide();
        });
        menubar.addOpenListener(showHints);
        
        var possiblyHideControlPanel = function(event){
            if (event.target.tagName === "HTML"){
                csshelper.removeClassForSelector('invisible','.hint');
                controlPanel.hide();
            }
        };
        document.addEventListener('click', possiblyHideControlPanel, true);
        
        exquis.cells = iter2d.map2dArray(animUris,function(animUri,row,col){
            var cell = makeCell(row, col, cellHeight, cellWidth);

            cell.canvasAnim = makeCanvasAnimation(cell.context);
            addControlPanelIconHandler(cell, controlPanel);
            cell.canvasAnim.loadAnim(animUri);
            return cell;
        });
        
        // addHintListeners(exquis.cells);
        
        exquis.assemblage = function(){
            var animationNames = iter2d.map2dArray(
                this.cells, 
                function(cell, row, col){
                    return cell.canvasAnim.animationName;
                });
            return animationNames;
        };

        var draw = function(){

            var allBorders = iter2d.map2dArray(exquis.cells,function(cell){ 
                return cell.canvasAnim.borders();
            });
            iter2d.forEach2dArray(exquis.cells,function(cell, row, col){
                var neighborBorders = {},
                    cells = exquis.cells,
                    canvasAnim = cell.canvasAnim;
                ["north", "south", "east", "west"].forEach(function(side){
                    var offset = relativeCoordinates[side];
                    var nRows = cells.length; 
                    var siderow = (row + offset.row + nRows ) % nRows;
                    var nCols = cells[row].length;
                    var sidecol = (col + offset.col + nCols) % nCols;
                    var opp = offset.opposite;
                    if(!allBorders[siderow][sidecol]){
                        // TODO decide what to do in case of no neighbour
                        console.log(row, col, siderow, sidecol);
                    }
                    neighborBorders[side] = allBorders[siderow][sidecol][opp];
                });

                try{
                    if(canvasAnim.evaluateCode){
                        canvasAnim.evaluateCode();
                        delete(canvasAnim.evaluateCode);
                    }

                    canvasAnim.draw(neighborBorders);
                }catch(e){
                    if(exquis.editorController.displayInvalidity){
                        exquis.editorController
                            .displayInvalidity(e, cell.canvasAnim);
                    }else{
                        console.error(e);
                    }
                }
            });
        };

        var editorController = makeEditorController(exquis, store);
        addEditor(exquis, controlPanel, editorController);

        var render = function(){
            draw();
            requestAnimationFrame(render);
        };
        render();

        return exquis;
    };


    return init;
    
});
