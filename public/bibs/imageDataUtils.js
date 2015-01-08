define({
    vec2d: function(x, y){
        return {x: x, y: y};
    },
    vec2dAdd:function(a, b){
        return this.vec2d(a.x + b.x, a.y + b.y);
    },
    vec2dSubstract:function(a, b){
        return this.vec2d(a.x - b.x, a.y - b.y);
    },
    scaleVec: function(vec, scale){
        return this.vec2d(vec.x * scale, vec.y *scale);
    },
    rotateVec: function(vec, radians){
        //https://en.wikipedia.org/wiki/Rotation_matrix
        var r = [[Math.cos(radians), -Math.sin(radians)],
                 [Math.sin(radians), Math.cos(radians)]];
        return this.vec2d( vec.x * r[0][0] + vec.y * r[0][1],
                           vec.x * r[1][0] + vec.y * r[1][1]) ;
    },
    rotateVec90cw: function(vec){
        return { x: -vec.y, y: vec.x };
    },
    rotateVec90ccw: function(vec){
        return { x: vec.y, y: -vec.x };
    },
    rectangularPixelFlow: function(startPnt,
                                   copyDirection,
                                   breadth,
                                   depth,
                                   copyDepth)
    {

     /*
     Input: 
        --> directionVec

                       copyDepth
                        ----- 
        ---------------------o startPoint             
             depth           |            
                             |           
                     breadth |          
                             |


     Output:

      toPoint   fromRectangle
        o     o---------------
                 width       |
                             |
                      height |
                             |

     */
        copyDepth = copyDepth ? copyDepth : 1;
        var that = this,
            fromRectangle = that.makeRectangle(startPnt, 
                                               copyDirection,
                                               breadth,
                                               depth - copyDepth),
            fromFromRectangleToPoint = that.scaleVec(copyDirection, copyDepth),
            toPoint = that.vec2dAdd(fromRectangle, fromFromRectangleToPoint);
        return {fromRectangle: fromRectangle, toPoint: toPoint};
    },

    /*
       Input:

         <- directionVec (length 1, multiple of 90%)

           depth
         o--------------o startPnt
         (secondPnt)    |
                        | breadth
                        |
                        o (thirdPnt)

        Output: {x: , y: , width: , height: }
    */
    makeRectangle: function(startPnt, directionVec, breadth, depth){
        var that = this,
            depthVec = that.scaleVec(directionVec, depth),
            secondPnt = that.vec2dAdd(startPnt, depthVec),
            perpendicularVec = that.rotateVec(directionVec, -Math.PI/2),
            breadthVec = that.scaleVec(perpendicularVec, breadth),
            thirdPnt = that.vec2dAdd(startPnt, breadthVec),
            recStart = that.vec2d(Math.min(secondPnt.x, thirdPnt.x),
                                  Math.min(secondPnt.y, thirdPnt.y)),
            recEnd = that.vec2d(Math.max(secondPnt.x, thirdPnt.x),
                                Math.max(secondPnt.y, thirdPnt.y)),
            rectangle = {x: recStart.x,
                         y: recStart.y,
                         width: recEnd.x - recStart.x,
                         height: recEnd.y - recStart.y};
        return rectangle;
    },
    
    // return average color in form [r, g, b, 1]
    averageColor: function(imageData){
        var pixels = imageData.data,
            totals = [0,0,0],
            avgArray;
        
        for(var i = 0; i < pixels.length; i += 4){
            totals[0] += pixels[i];
            totals[1] += pixels[i+1];
            totals[2] += pixels[i+2];
        }
        avgArray = totals.map(function(total){ return Math.round(total/pixels.length*4);});
        avgArray[3] = 1;
        return avgArray;
    },
    
    // TODO: fix for vertical 
    sliceImageData: function(context, imageData, start, length){
        var horizontal = imageData.height == 1,
            startIndex = start * 4,
            endIndex = (start + length) * 4, 
            result = horizontal ? context.createImageData(length, 1) : context.createImageData(1, length),
            slicedData = imageData.data.subarray(startIndex, endIndex);
        result.data.set(slicedData);
        return result;
       },

    copyContextPixels: function(context, fromRectangle, toPoint){
        var currentImage = context.getImageData(fromRectangle.x, 
                                                  fromRectangle.y, 
                                                  fromRectangle.width, 
                                                  fromRectangle.height);
          context.putImageData(currentImage, toPoint.x, toPoint.y);
    },


    array2CSSColor: function(colorArray){
        var alpha = colorArray.length < 4 ? 1 : colorArray[3];
        return "rgba(" + colorArray[0] + "," + colorArray[1] + "," + colorArray[2] + "," + alpha + ")";
    }
});
