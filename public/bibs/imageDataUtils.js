define({
    direction: function(horizontal) {
        return horizontal ? this.vec2d(1, 0): this.vec2d(0, 1);
    },
    vec2d: function(x, y){
        return {x: x, y: y};
    },
    vec2dAdd:function(a, b){
        return this.vec2d(a.x + b.x, a.y + b.y);
    },
    vec2dScale: function(vec, scale){
        return this.vec2d(vec.x * scale, vec.y *scale);
    },
    vec2dAddScaled: function(vec, vecToScale, scale){
        var scaled = this.vec2dScale(vecToScale, scale);
        return this.vec2dAdd(vec, scaled);
    },
    rectangle: function(x, y, width, height){
        return {x: x, y: y, width: width, height: height} ;
    },
    /** 
     Input:

       rectangle: 
         x--------------------
         |                    |
         |                    |
         |                    |
          --------------------

       horizontal: true
       speed: 4

     Output:

       out.changeRectangle
         x----
         |    |
         |    |
         |    |
          ---- 


       out.copyRectangle: 
         x---------------
         |               |
         |               |
         |               |
          ---------------

       out.toPoint
              x 

     */
    pixelTranslateParams: function(rectangle, horizontal, speed){
        var paralDirection = this.direction(horizontal),
            perpDirection = this.direction(!horizontal),
            paralSize = horizontal ? rectangle.width : rectangle.height,
            perpSize =  horizontal ? rectangle.height : rectangle.width,
            changeSize = Math.abs(speed),
            copySize = paralSize - changeSize,
            /*
             horizontal example:
             
             changeSize  ----           
             copySize    ---------------
                         x----x----------x----
                  point0 |  point1     point2 |
                         |                    |
                         |                    |
                         |  point3     point4 | point5
                          ----x-----------x---x 
             */
            point0 = this.vec2d(rectangle.x, rectangle.y),
            point1 = this.vec2dAddScaled(point0, paralDirection, changeSize),
            point2 = this.vec2dAddScaled(point0, paralDirection, copySize),
            point3 = this.vec2dAddScaled(point1, perpDirection, perpSize),
            point4 = this.vec2dAddScaled(point2, perpDirection, perpSize),
            point5 = this.vec2dAddScaled(point4, paralDirection, changeSize),

            changePointA = point0,
            changePointB = point3,
            copyPointA   = point0,
            copyPointB   = point4,
            pastePoint   = point1;

        if(speed < 0){
            changePointA = point2;
            changePointB = point5;
            copyPointA   = point1;
            copyPointB   = point5;
            pastePoint   = point0;
        }
        return {changeRectangle: {x: changePointA.x,
                                  y: changePointA.y,
                                  width: changePointB.x - changePointA.x,
                                  height: changePointB.y - changePointA.y},
                copyRectangle: {x: copyPointA.x,
                                y: copyPointA.y,
                                width: copyPointB.x - copyPointA.x,
                                height: copyPointB.y - copyPointA.y},
                pastePoint: pastePoint};
    },
    /* return average color in form [r, g, b, 1] */
    /* TODO ignore colors with alpha == 0*/
    averageColor: function(imageData, pixelStart, pixelEnd){
        var pixels = imageData.data,
            totals = [0,0,0,0],
            start = pixelStart || 0,
            end = pixelEnd || pixels.length,
            avgArray,
            totalWeight = 0;
        
        for(var i = start; i < end; i += 4){
            let weight = pixels[i + 3];
            totalWeight += weight;
                for (var j = 0; j < 4; j++) {
                    totals[j] += pixels[i + j] * weight;
                }
        }
        avgArray = totals.map(function(total){
            return totalWeight == 0 ?  0 : Math.round(total/totalWeight);
        });
        return avgArray;
    },
    colorDistance: function(color1, color2){
        if(!color1 || !color2){ return 0;}
        var squaresSum = color1.slice(0,3).reduce(function(sumsq,_,i){
            return sumsq + Math.pow(color2[i]-color1[i],2);
        },0);
        return Math.sqrt(squaresSum);
    },
    array2CSSColor: function(colorArray){
        var alpha = colorArray.length < 4 ? 1 : colorArray[3];
        return "rgba(" + colorArray[0] + "," + colorArray[1] + ","
            + colorArray[2] + "," + alpha + ")";
    },
    avgColorFilter: function(context, imageData){
        var avgColor = this.averageColor(imageData),
            result = context.createImageData(imageData);
        for(var i = 0; i < imageData.data.length; i += 4){
            result.data.set(avgColor, i);
        }
        return result;
    },
    cropLine: function(context, imageData, start, length){
        var horizontal = imageData.height == 1,
            startIndex = start * 4,
            endIndex = (start + length) * 4, 
            slicedData = imageData.data.subarray(startIndex, endIndex),
            result;
        if(horizontal){
            result = context.createImageData(length, 1);
        }else{
            result = context.createImageData(1, length);
        }
        result.data.set(slicedData);
        return result;
    },
    copyContextPixels: function(context, fromRectangle, toPoint){
        if(['x','y','width','height'].find(k => isNaN(fromRectangle[k]))){
            console.error('fromRectangle', fromRectangle);
            return;
        }
        var currentImage = context.getImageData(fromRectangle.x, 
                                                fromRectangle.y, 
                                                fromRectangle.width, 
                                                fromRectangle.height);
        context.putImageData(currentImage, toPoint.x, toPoint.y);
    },
    drawLineInRec: function(context, linePixels, chgRec, horizontal){
        var size = horizontal ? chgRec.width : chgRec.height,
            d= [0,0];
        for(var i=0; i<size; i++){
            d[horizontal? 0 : 1] = i;
            context.putImageData(linePixels, chgRec.x + d[0], chgRec.y + d[1]);
        }
    },
    pushPixels: function(ctx, srcPixels, rectangle, horiz, speed, filter){
        var opts = this.pixelTranslateParams(rectangle, horiz, speed),
            linePixels = srcPixels;
        if(filter){
            linePixels = filter.call(this, ctx, srcPixels); 
        }
        this.drawLineInRec(ctx, linePixels, opts.changeRectangle, horiz);
        this.copyContextPixels(ctx, opts.copyRectangle, opts.pastePoint);
    },
    pushLine: function(ctx, borders, rec, horiz, speed, filter){
        rec = rec || this.rectangle(0, 0, ctx.canvas.width, ctx.canvas.height);
        var positiveDir = speed > 0,
            pixels = this.linePixels(ctx, borders, rec, horiz, positiveDir);
        this.pushPixels(ctx, pixels, rec, horiz, speed, filter);
    },
    linePixels: function(ctx, borders, rec, horiz, positiveDir){
        var fromWest  =  horiz &&  positiveDir,
            fromEast  =  horiz && !positiveDir,
            fromNorth = !horiz &&  positiveDir,
            fromSouth = !horiz && !positiveDir,
            touchesWest  = rec.x <= 0,
            touchesEast  = rec.x + rec.width >= ctx.canvas.width,
            touchesNorth = rec.y <= 0,
            touchesSouth = rec.y + rec.height >= ctx.canvas.height;

        if(      fromEast  &&  touchesEast){
            return this.cropLine(ctx, borders.east, rec.y, rec.height);

        }else if(fromEast  && !touchesEast){
            return ctx.getImageData(rec.x + rec.width, rec.y, 1, rec.height);

        }else if(fromWest  &&  touchesWest){
            return this.cropLine(ctx, borders.west, rec.y, rec.height);

        }else if(fromWest  && !touchesWest){
            return ctx.getImageData(rec.x - 1 , rec.y, 1, rec.height);

        }else if(fromNorth &&  touchesNorth){
            return this.cropLine(ctx, borders.north, rec.x, rec.width);

        }else if(fromNorth && !touchesNorth){
            return ctx.getImageData(rec.x, rec.y - 1, rec.width, 1);

        }else if(fromSouth &&  touchesSouth){
            return this.cropLine(ctx, borders.south, rec.x, rec.width);

        }else if(fromSouth && !touchesSouth){
            return ctx.getImageData(rec.x, rec.y + rec.height , rec.width, 1);

        }
        return null;
    },
    drawGraph: function(context, value, opts){
        context.fillStyle = 'white';

        context.fillRect(opts.x + opts.width, opts.y ,1, opts.height);
        context.fillStyle = 'black';
        let scaledValue = (opts.maxValue - value) * opts.height / opts.maxValue;
        context.fillRect(opts.x + opts.width , opts.y + scaledValue, 1, 1);

        let middleLeft = this.rectangle(opts.x, opts.y, opts.width, opts.height),
            horizontal = true;
        this.pushLine(context, null, middleLeft, horizontal, -1);
    }
});
