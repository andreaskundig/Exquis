"use strict";

define(["iter2d", "csshelper", "evileval", "net", "ui"], function(iter2d, csshelper, evileval, net, ui){
            

    var makeCell = function(row, col, height, width){
        var canvas = makeCanvas(row, col, height, width), 
            context = canvas.getContext("2d"), 
            cell = {};
        cell.context = context;
        cell.hint = createCellDiv("hint", row, col, height, width);
        cell.ui = makeCellUi(row, col, height, width);
        return cell;
    };

    var addCellUiListeners = function(cellUi, canvasAnim, store){
        var childNodes = cellUi.childNodes;
        cellUi.addEventListener("mouseover", function(e){
            for(var i = 0; i < childNodes.length; i++){
                childNodes[i].style.visibility = "visible";
            };
        });
        cellUi.addEventListener("mouseout", function(e){
            for(var i = 0; i < childNodes.length; i++){
                childNodes[i].style.visibility = "hidden";
            };
        });
        addLoadAnimationHandler(cellUi.id, canvasAnim, store); 
    };

    var makeCanvasAnimation = function(context){
        return {
            updateListener:null,
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

                // force reset matrix/
                context.setTransform(1, 0, 0, 1, 0, 0);
                this.currentCode.draw(context, borders);
            },

            toDataUri : function(jsCode){
                return "data:text/javascript;base64," + btoa(jsCode);
            },
            
            addCodeStringToEvaluate: function(codeString){
                return new Promise(function(resolve, reject){
                    this.evaluateCode = function(){
                        var codeAsUri = this.toDataUri(codeString);
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

            setAnimation: function(codeToSetup, uri){
                this.codeToSetup = codeToSetup;
                this.animationName = net.extractAnimationNameFromUri(uri),
                this.originalUrl = uri;
                this.setup = function(){
                    // force reset matrix
                    context.setTransform(1, 0, 0, 1, 0, 0);
                    this.codeToSetup.setup(context);
                    this.currentCode = this.codeToSetup;
                };

                this.setup();
            },
            
            getSourceCode: function(){
                if(this.currentCode.source){
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
                    return net.HTTPget(this.originalUrl).then(function(animCodeString){
                        this.animationName = net.extractAnimationNameFromUri(this.originalUrl);
                        this.addCodeStringToEvaluate(animCodeString);
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
        icon.style.visibility = "hidden";
        icon.style.cursor = "pointer"; 
        icon.className = classNames;
        if(id){
            icon.id = id;
        }
        return icon;
    };
    
    var loadIconSuffix = "-load-icon"; 
    var makeCellUi = function(row, col, height, width){
        var cellUi = createCellDiv("cellUi", row, col, height, width);
        var loadAnimationIcon = makeIcon("fa fa-folder-open-o fa-lg",
                                         cellUi.id + loadIconSuffix);
        cellUi.appendChild(loadAnimationIcon);
        return cellUi;
    };

    var addLoadAnimationHandler = function(cellUiId, canvasAnim, store){
        var loadAnimationIcon = document.getElementById(cellUiId + loadIconSuffix);
        loadAnimationIcon.addEventListener('click', function(){
            store.loadAnimationList().then(function(fileUris){
                var names = fileUris.map(store.uriToAnimationName);
                return ui.populateNamePicker("choose animation", names);
            }).then(function(animationName){
                if (animationName){
                    var fileUri = store.animationNameToUri(animationName);
                    return canvasAnim.loadAnim(fileUri);
                }else{
                    throw "no animation name";
                }
            }).then(function(canvasAnim){
                return canvasAnim.getSourceCode().then(function(scs){
                    return {code: scs, lang: 'javascript'};
                });
            }).then(function(source){
                if(canvasAnim.updateListener){
                    canvasAnim.updateListener(canvasAnim.animationName, 
                                              source);
                }
            }).catch(function(e){
                console.log(e);
            });

        });
    };
    
    var addHintListeners = function(cells){
        var showGridHint = function(show){
            iter2d.forEach2dArray(cells, function(cell, row,col){
                (show ? csshelper.addClass : csshelper.removeClass)(cell.hint, "visible-grid");
            });
        };

        var onDashboardOver = function(e){  showGridHint(true);};
        var onDashboardOut = function(e){ showGridHint(false);};

        document.getElementById("dashboard").addEventListener("mouseover", onDashboardOver, false);
        document.getElementById("dashboard").addEventListener("mouseout", onDashboardOut, false);

    };


    var currentCell;
    var addEditor = function(exquis, editorController){
        exquis.editorController = editorController;
        
        iter2d.forEach2dArray(exquis.cells, function(cell){
            var edit = function(){ 
                if (currentCell) { csshelper.removeClass(currentCell.hint, "visible-cell"); }
                currentCell = cell;
                exquis.currentCell = currentCell; //only for debugging
                csshelper.addClass(currentCell.hint, "visible-cell");
                exquis.editorController.updateWithCanvasAnim(cell.canvasAnim);
            };

            var editIcon = makeIcon("fa fa-pencil-square-o fa-lg", cell.ui.id + "-edit-icon");
            editIcon.addEventListener('click', edit, false);
            cell.ui.appendChild(editIcon);
        });
        
        var possiblyHideEditor = function(event){
            if (event.target.tagName === "HTML"){
                // unselect edition
                exquis.editorController.hide();
                if (currentCell) { csshelper.removeClass(currentCell.hint, "visible-cell"); }
            }
        };
        document.addEventListener('click', possiblyHideEditor, true);
    };

    var init = function (assName, animUris, makeEditorController, store) {
        var container = document.getElementById("container"),
            exquis = {};
        exquis.assName = assName;

        var cellWidth = 150,
            cellHeight = 150,
            dashboardWidth = animUris[0].length * cellWidth,
            dashboardHeight = animUris.length * cellHeight,
            dashboard = document.getElementById('dashboard');

        dashboard.style.width = dashboardWidth + 'px';
        dashboard.style.height = dashboardHeight + 'px';
        
        exquis.cells = iter2d.map2dArray(animUris,function(animUri,row,col){
            var cell = makeCell(row, col, cellHeight, cellWidth);

            cell.canvasAnim = makeCanvasAnimation(cell.context);
            addCellUiListeners(cell.ui, cell.canvasAnim, store);
            cell.canvasAnim.loadAnim(animUri);
            return cell;
        });
        
        addHintListeners(exquis.cells);
        
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

                if(canvasAnim.evaluateCode){
		           canvasAnim.evaluateCode();
		           delete(canvasAnim.evaluateCode);
                }

                try{
                    canvasAnim.draw(neighborBorders);
                }catch(e){
                    exquis.editorController.displayInvalidity(e, cell.canvasAnim);
                }
            });
        };

        var editorController = makeEditorController(exquis, store);
        addEditor(exquis, editorController);

        var render = function(){
            draw();
            requestAnimationFrame(render);
        };
        render();

        return exquis;
    };


    return init;
    
});
