define(function(){

    var makeBuffer = function(){
        var w, h;
        if(arguments.length == 0){
            w = 150;
            h = 150;
        }else if(arguments.length == 1){
            w = arguments[0].width;
            h = arguments[0].height;
        }else{
            w = arguments[0];
            h = arguments[1];
        }
        var buffer = document.createElement('canvas');
        buffer.width = w;
        buffer.height = h;
        var bufferCtx = buffer.getContext("2d");
        
        return {
            width: function() { return buffer.width; },
            height: function() { return buffer.height; },
            context: bufferCtx,
            copyToBuffer: function(sourceCtx, sourcePoint, sourceDimension){
                // Copy a rectangle the size of the buffer from sourcePoint.
                // This function does not react to translate, rotate etc..
                var x = Math.round(sourcePoint.x);
                var y = Math.round(sourcePoint.y);
                if(sourceDimension){
                     buffer.width = sourceDimension.width ;
                     buffer.height = sourceDimension.height ;
                }
                var imageData = sourceCtx.getImageData(x, y, buffer.width, buffer.height);
                bufferCtx.putImageData(imageData, 0, 0);
                return this;
            },
            pasteInto: function(destinationCtx, compositeOperation){
                const oldOp = destinationCtx.globalCompositeOperation;
                destinationCtx.globalCompositeOperation = compositeOperation || oldOp;

                // use drawImage because it allows to scale,
                // translate and rotate destinationCtx
                destinationCtx.drawImage(buffer, 0, 0, buffer.width, buffer.height);
                destinationCtx.globalCompositeOperation = oldOp;
                return this;
            },
            setTransparency: function(alpha){
                var imageData = bufferCtx.getImageData(0, 0, buffer.width, buffer.height);
                for (var i = 0, n = imageData.data.length; i < n; i += 4) {
                    imageData.data[i+3] = alpha;
                }
                bufferCtx.putImageData(imageData,0,0);
                return this;
            }
        };
    };

    return makeBuffer;
});
