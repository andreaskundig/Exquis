"use strict";

define(["net",
        "iter2d",
        "editorView",
        "editorController",
        "csshelper",
        "evileval"], function(net, iter2d, editorView, editorController, csshelper, evileval){
            

    var makeCell = function(row, col, height, width, jsonAnim, exquis){
        var canvas = makeCanvas(row, col, height, width), 
            context = canvas.getContext("2d"), 
            cell = {};

        cell.canvasAnim = makeCanvasAnimation(context, jsonAnim, exquis);
        cell.hint = makeHint(row, col, height, width);

        return cell;
    };

    var makeCanvasAnimation = function(context, jsonAnimation, exquis){

        var isJsAnim = true; 
        var canvasAnim = {
            animation : jsonAnimation.animation.js,// {},
            animationName: jsonAnimation.name,

            borders : function(){
               return {
                    north: context.getImageData(0, 0, context.canvas.width, 1),
                    south: context.getImageData(0, context.canvas.height - 1, context.canvas.width, 1),
                    east: context.getImageData(context.canvas.width - 1, 0, 1 , context.canvas.height),
                    west: context.getImageData(0, 0, 1, context.canvas.height - 1)
                };
            },

            draw : function(borders){
                // force reset matrix
                context.setTransform(1, 0, 0, 1, 0, 0);
                if(this.animation.draw){
                    this.animation.draw(context, borders, this.lib);
                }
            },

            setup : function(){
                // force reset matrix
                context.setTransform(1, 0, 0, 1, 0, 0);
                this.animation.setup(context, this.lib);
            }
        };
        canvasAnim.setup();
        return canvasAnim;

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

    var makeHint = function(row, col, height, width){
        var gridHint = document.createElement('div');
        gridHint.id = "hint-" + row + "-" + col;
        gridHint.className = "hint";
        gridHint.style.top = (height * row)+"px";
        gridHint.style.left = (width * col)+"px";

        document.getElementById('dashboard').appendChild(gridHint);
        return gridHint;
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


    var init = function (exquis, assName, jsonAnimations) {
        var container = document.getElementById("container");

        exquis.assName = assName;
        
        exquis.editorView = editorView(editorController(exquis));

        exquis.cells = iter2d.map2dArray(jsonAnimations,function(jsonAnim,row,col){
            var height = 150,
                width = 150,
                cell = makeCell(row, col, height, width, jsonAnim, exquis),
                edit = function(){ 
                    if (exquis.targetCell) { csshelper.removeClass(exquis.targetCell.hint, "visible-cell"); }
                    exquis.targetCell = cell;
                    csshelper.addClass(exquis.targetCell.hint, "visible-cell");
                    //TODO: editCanvasAnim should be in editorController
                    exquis.editorView.editCanvasAnim(
			cell.canvasAnim.animation.libsString,
			cell.canvasAnim.animation.setupString,
			cell.canvasAnim.animation.drawString,
			cell.canvasAnim.animationName,
			cell.canvasAnim.animation);
                };
            cell.hint.addEventListener('click', edit, false);
            return  cell;
        });

        exquis.animate = function(animation){
            exquis.loadingCanvasAnim.animation = animation;
	    evileval.addLibsToCanvasAnim(exquis.loadingCanvasAnim, animation.libs, function(){
		exquis.loadingCanvasAnim.setup();
	    });
        };
        
        addHintListeners(exquis.cells);
        
        exquis.assemblage = function(){
            var animationNames = iter2d.map2dArray(this.cells, function(cell, row, col){
                return cell.canvasAnim.animationName;
            });

            return animationNames;
        };

        var toggleEditorView = function(event){
            if (event.target.tagName === "HTML"){
                // unselect edition
                exquis.editorView.hide();
                if (exquis.targetCell) { csshelper.removeClass(exquis.targetCell.hint, "visible-cell"); }
            }else{
                exquis.editorView.show();
            }
        };

        
        document.addEventListener('click', toggleEditorView, true);

        var draw = function(){

            var allBorders = iter2d.map2dArray(exquis.cells,function(cell){ 
                return cell.canvasAnim.borders();
            });
            iter2d.forEach2dArray(exquis.cells,function(cell, row, col){
                var neighbouringBorders = {},
                    cells = exquis.cells,
                    canvasAnim = cell.canvasAnim;
                ["north", "south", "east", "west"].forEach(function(side){
                    var offset = relativeCoordinates[side];
                    var siderow = (row + offset.row + cells.length) % cells.length;
                    var sidecol = (col + offset.col + cells[0].length) % cells[0].length;
                    neighbouringBorders[side] = allBorders[siderow][sidecol][offset.opposite];
                    
                });

                if(canvasAnim.updateSetup){
		    canvasAnim.updateSetup();
		    delete(canvasAnim.updateSetup);
                }
                
                if(canvasAnim.updateDraw){
		    canvasAnim.updateDraw(neighbouringBorders);
		    delete(canvasAnim.updateDraw);
                }else{
		    canvasAnim.draw(neighbouringBorders);
                }
            });
        };

        setInterval(draw, 50);

    };


    return init;
    
});
