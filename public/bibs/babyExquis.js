define(["bibs/canvasBuffer", "bibs/imageDataUtils"],function(canvasBuffer, idu){

    var createExquisBuffers = function(context, cols, rows){
        var ex = {buffers: [],
                  cols: cols,
                  rows: rows,
                  width: Math.round (context.canvas.width / cols),
                  height: Math.round (context.canvas.height / rows)};
        for(var r = 0; r < rows; r++){
            ex.buffers[r] = [];
            for(var c = 0; c < cols; c++){
                ex.buffers[r][c] = canvasBuffer.makeBuffer(ex.width, ex.height);
            }
        }
        return ex;
    };

    var makeBorders = function(context, borders, ex, c, r){
        var left = c == 0,
            top = r == 0,
            right = c == ex.cols - 1,
            bottom = r == ex.rows - 1,
            pWidth = ex.width,
            pHeight = ex.height,
            x = c * pWidth,
            y = r * pHeight,
            bb = {},
            buffer;
        if(top){
            bb.north = idu.cropLine(context, borders.north, x, pWidth);
        }else{
            buffer = ex.buffers[r-1][c];
            bb.north = buffer.context.getImageData(0, pHeight-1, pWidth, 1);
        }
        if(left){
            bb.west =  idu.cropLine(context, borders.west, y, pHeight);
        }else{
            buffer = ex.buffers[r][c-1];
            bb.west = buffer.context.getImageData(pWidth-1, 0, 1, pHeight);
        }
        if(bottom){
            bb.south = idu.cropLine(context, borders.south, x, pWidth);
        }else{
            buffer = ex.buffers[r+1][c];
            bb.south = buffer.context.getImageData(0, 0, pWidth, 1);
        }
        if(right){
            bb.east =  idu.cropLine(context, borders.east, y, pHeight);
        }else{
            buffer = ex.buffers[r][c+1];
            bb.east = buffer.context.getImageData(0, 0, 1, pHeight);
        }
        return bb;
    };

    var doDraw = function(context, ex, borders, draw){
        ex.buffers.forEach(function(row, r){
            row.forEach(function(buffer, c){
                var bBorders = makeBorders(context, borders, ex, c, r);
                draw(buffer.context, bBorders, c, r);
                context.save();
                context.translate(c * ex.width, r * ex.height);
                buffer.copyFromBuffer(context);
                context.restore();
            });
        });
    };
    
    return {create: createExquisBuffers, doDraw: doDraw};

});
