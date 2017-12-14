define(["bibs/noise","paper","bibs/imageDataUtils", "bibs/shapes"], 
function(noise, paper, idu, shapes){
    const squaresPerSide = 5,
          squares = [];
    let      color = null;
    const xy = index => [Math.floor(index / squaresPerSide),
                        index % squaresPerSide];
    const indexForXY = ([x,y]) => x * squaresPerSide + y;
    const neighboringBorder = (x,y) => {
        if(x == 0){ return 'west';}                        
        if(y == 0){ return 'north';}                        
        if(x == squaresPerSide - 1){ return 'east';}                        
        if(y == squaresPerSide - 1){ return 'south';}
        return null;
    };
    const intersectsBorder = (x,y, square, canvasSize) => {
        let border = neighboringBorder(x,y);
        if(!border){
            return null;
        }
        if(border == 'west' && square.bounds.left < 0){
            return {border: border, size: square.bounds.left};
        }                        
        if(border == 'north' && square.bounds.top < 0){
            return {border: border, size: square.bounds.top};
        } 
        if(border == 'east' && square.bounds.right > canvasSize){
            return {border: border, size: canvasSize - square.bounds.right};
        }
        if(border == 'south' && square.bounds.bottom > canvasSize){
            return {border: border, size: canvasSize - square.bounds.bottom};
        }
        return null;
    };
    const colorIfIntersectsBorder = (x,y, square, borderColors, canvasSize) => {
        let border = neighboringBorder(x,y);
        if(border == 'west' && square.bounds.left < 0){
            return borderColors[border];
        }                        
        if(border == 'north' && square.bounds.top < 0){
            return borderColors[border];
        } 
        if(border == 'east' && square.bounds.right > canvasSize){
            return borderColors[border];
        }
        if(border == 'south' && square.bounds.bottom > canvasSize){
            return borderColors[border];
        }
        return null;
    };
    const neighborsXYs = (x,y) => {
        return [[x+1, y], [x, y+1], [x-1, y], [x, y-1]]
            .filter(([x,y]) => {
            let ok = x >= 0 && x < squaresPerSide ;
            return ok &&  y >= 0 && y < squaresPerSide;
        }) ;
        
    }; 
    let i = 0,
        j=42;

    
    return {
        setup: function (context){
            const p = new paper.PaperScope();
            p.setup(context.canvas);
            const stepSize = context.canvas.width / squaresPerSide,
                  squareSize = 29,
                  centeringOffset = new p.Point(1,1)
                      .multiply((stepSize - squareSize)/2);
            
            for (var x = 0; x < squaresPerSide; x++) {
                for (var y = 0; y < squaresPerSide; y++) {
                    const topLeft = new p.Point(x,y)
                              .multiply(stepSize)
                              .add(centeringOffset),
                          square = p.Path.Rectangle({
                              point:topLeft, 
                              size: new p.Size(squareSize,squareSize)}) ;
                    squares.push(square);
                }
            }

        },
        draw: function (context, borders){

            let intersectionSizes = {east:0, west:0, north:0, south:0};
            squares.forEach((square,index) =>{
                const [x,y] = xy(index) ,
                      rotNoise = noise.simplex2(x / 10 + i, y / 10 + i),
                      sideNoise = noise.simplex2(x / 10 + j, y / 10 + j),
                      rotation = rotNoise * 180 * 0.3,
                      //                  scaling = .8,
                      scaling = sideNoise* 0.49 + 1,
                      relScaling = scaling / (square.oldScaling || 1),
                      relRotation = rotation - square.oldRotation || 0 ; 
                //     side = scale * 0.9 * Math.abs(sideNoise * 0.6+0.9);
                square.rotate(relRotation);
                square.oldRotation = rotation;
                square.scale(relScaling);
                square.oldScaling = scaling;
                let intersection = intersectsBorder(x,y,
                                                    square,
                                                    context.canvas.width);
                if(intersection){
                    intersectionSizes[intersection.border] += intersection.size;
                }
                square.fillColor = color;
            });
            const biggestBorder = Object.keys(intersectionSizes)
            .reduce((bb, border) =>{
                const currentSize = intersectionSizes[border];
                if(!bb.border || bb.size < currentSize){
                    bb.border = border;
                    bb.size = currentSize;
                }
                return bb;
            }, {});
            if(biggestBorder.border){
              let colorArray  = idu.averageColor(borders[biggestBorder.border]);
              color = `rgb(${colorArray.join(',')})`
            }else{
                color = 'white';
            }
            
            i += 0.003;
            j += 0.004;
            
        }
    };
});
