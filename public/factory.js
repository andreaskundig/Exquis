define([], function(){

    const map2d = function (array2d, func) {
        var result = [];

        for (var row = 0; row < array2d.length; row++) {
            result.push([]);
            var cols = array2d[row];
            for (var col = 0; col < cols.length; col++) {
                result[row][col] = func(cols[col], row, col);
            };
        };

        return result;
    };

    const forEach2d = function (array2d, func) {
        array2d.forEach(function (cols, row) {
            cols.forEach(function (el, col) {
                func(el, row, col);
            });
        });
    };
    
    const makeCanvas = function(row, col, height, width, parent){
        var canvas = document.createElement('canvas');
        canvas.id = "canvas-" + row + "-" + col;
        //canvas.className = "cell";
        //canvas.style.position = "absolute";
        canvas.width = width;
        canvas.height = height;
        //canvas.style.top = (height * row)+"px";
        //canvas.style.left = (width * col)+"px";

        if(parent){
            parent.appendChild(canvas);
        }
        return canvas;
    };
    
    const createCellDiv = function(className, row, col, height, width){
        var cellDiv = document.createElement('div');
        cellDiv.id = className + "-" + row + "-" + col;
        cellDiv.className = className;
        cellDiv.style.top = (height * row)+"px";
        cellDiv.style.left = (width * col)+"px";
        cellDiv.style.height = height+"px";
        cellDiv.style.width = width+"px";
        
        let parent = document.getElementById("dashboard");
        if(parent){
            parent.appendChild(cellDiv);
        }
        return cellDiv;
    };
  
    const makeCell = function(row, col, height, width, parent){
        var canvas = makeCanvas(row, col, height, width, parent), 
            context = canvas.getContext("2d"), 
            cell = {row, col};
        //canvas.style.gridRow = row + ' / 1';
        //canvas.style.gridColumn = col + ' / 1';
        cell.context = context;
        return cell;
    };

    const makeCanvasAnimation = function(context){
        return {
            creation: Date.now(),
            currentCode: null,
            cellWidth: context.canvas.width,
            cellHeight: context.canvas.height,
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

                const env = {
                    context,
                    borders,
                    animationState: this.animationState
                };

                // this.currentCode.draw(context, borders, this.animationState);
                this.currentCode.draw(env);
            },

            getParams : function(){
                return this.currentCode.params;
            },

            setAnimation: function(animationCloneToSetup, uri, animationName){
                if(this.currentCode && this.currentCode.tearDown){
                    this.currentCode.tearDown(context);
                }
                this.animationCloneToSetup = animationCloneToSetup;
                this.animationName = animationName;
                this.originalUrl = uri;
                this.setup = function(){
                    // force reset matrix
                    context.setTransform(1, 0, 0, 1, 0, 0);
                    // because using paper.js resizes the canvas
                    // dependending on screen dpi 
                    context.canvas.width = this.cellWidth;
                    context.canvas.height = this.cellHeight;

                    // console.log('animationState', this.animationState);
                    this.animationState = this.animationState || {};
                    if(this.animationCloneToSetup.setup){
                        const env = {context, animationState: this.animationState};
                        this.animationCloneToSetup.setup(env);
                    }
                    this.currentCode = this.animationCloneToSetup;
                };

                this.setup();
            }
            
        };
    };

    const makeCells = (rowCount, colCount, cellHeight, cellWidth, parent) => {
        if(parent){
            parent.innerHTML = "";
        }

        const cells = [];
        //parent.style.position = 'relative';
        parent.style.width= `${colCount * cellWidth}px`;
        parent.style.lineHeight= 0;
        for(let rowIndex = 0; rowIndex < rowCount; rowIndex++){
            let row = [];
            cells.push(row);
            for(let colIndex = 0; colIndex < colCount; colIndex++){
                var cell = makeCell(rowIndex, colIndex, cellHeight, cellWidth, parent);
                cell.canvasAnim = makeCanvasAnimation(cell.context);
                row.push(cell);
            }
        }
        return cells;
    };

    const relativeCoordinates = {
        north : {row: -1, col: 0, opposite: "south"},
        south : {row: 1, col: 0, opposite: "north"},
        west : {row: 0, col: -1, opposite: "east"},
        east : {row: 0, col: 1, opposite: "west"}
    };

    var draw = async function (cells, displayInvalidity) {

        var allBorders = cells.map( row => row.map(cell => cell.canvasAnim.borders()));

        forEach2d(cells, async (cell, rowIndex, colIndex) => {
            var neighborBorders = {},
                canvasAnim = cell.canvasAnim;
            ["north", "south", "east", "west"].forEach(function (side) {
                var offset = relativeCoordinates[side];
                var nRows = cells.length;
                var siderow = (rowIndex + offset.row + nRows) % nRows;
                var nCols = cells[rowIndex].length;
                var sidecol = (colIndex + offset.col + nCols) % nCols;
                var opp = offset.opposite;
                if (!allBorders[siderow][sidecol]) {
                    // TODO decide what to do in case of no neighbour
                    console.log(rowIndex, colIndex, siderow, sidecol);
                }
                neighborBorders[side] = allBorders[siderow][sidecol][opp];
            });

            try {
                if (canvasAnim.evaluateCode) {
                    await canvasAnim.evaluateCode();
                    delete (canvasAnim.evaluateCode);
                    displayInvalidity && displayInvalidity(null, cell.canvasAnim);
                }

                canvasAnim.draw(neighborBorders);
            } catch (e) {
                displayInvalidity && displayInvalidity(e, cell.canvasAnim);
            }
        });
    };

    return {
        makeCanvas,
        createCellDiv,
        makeCell,
        makeCells,
        makeCanvasAnimation,
        map2d,
        forEach2d,
        draw
    };
});