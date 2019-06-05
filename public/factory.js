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

    return {
        makeCanvas,
        createCellDiv,
    };
});