define([], function(){

    const makeCanvas = function(row, col, height, width){
        var canvas = document.createElement('canvas');
        canvas.id = "canvas-" + row + "-" + col;
        canvas.className = "cell";
        canvas.width = width;
        canvas.height = height;
        canvas.style.top = (height * row)+"px";
        canvas.style.left = (width * col)+"px";

        let parent = document.getElementById("dashboard");
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
  
    const makeCell = function(row, col, height, width){
        var canvas = makeCanvas(row, col, height, width), 
            context = canvas.getContext("2d"), 
            cell = {row, col};
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

                this.currentCode.draw(context, borders, this.animationState);
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
                    this.animationCloneToSetup.setup(context, this.animationState);
                    this.currentCode = this.animationCloneToSetup;
                };

                this.setup();
            }
            
        };
    };

    const makeCells = (rowCount, colCount, cellHeight, cellWidth) => {
        const cells = [];
        for(let colIndex = 0; colIndex < colCount; colIndex++){
            let col = [];
            cells.push(col);
            for(let rowIndex = 0; rowIndex < rowCount; rowIndex++){
                var cell = makeCell(rowIndex, colIndex, cellHeight, cellWidth);
                cell.canvasAnim = makeCanvasAnimation(cell.context);
                col.push(cell);
            }
        }
        return cells;
    };

    return {
        makeCanvas,
        createCellDiv,
        makeCell,
        makeCells,
        makeCanvasAnimation
    };
});