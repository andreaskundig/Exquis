define(["bibs/noise","paper","bibs/imageDataUtils", "bibs/shapes"], 
function(noise, paper, idu, shapes){
    const squaresPerSide = 5;
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
    const colorIfIntersectsBorder = (x, y, square, borderColors, canvasSize) => {
        let border = neighboringBorder(x, y);
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

    return {
        setup: function (context){
            this.squares = [];
            this.calculatedColors = [];
            this.i = 0;
            this.j = 42;
            
            const p = new paper.PaperScope();
            p.setup(context.canvas);
            const stepSize = context.canvas.width / squaresPerSide,
                  squareSize = 39,
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
                    this.squares.push(square);
                }
            }

        },
        draw: function (context, borders){

            let colors = Object.keys(borders).reduce((acc, dir) => {
                let avg = idu.averageColor(borders[dir]);
                acc[dir] = `rgb(${avg.join(',')})`;
                return acc;
             } ,{});
            let sizes = [],
                coloredSquares = [];
            this.squares.forEach((square,index) =>{
                const [x,y] = xy(index) ,
                      rotNoise = noise.simplex2(x / 10 + this.i, y / 10 + this.i),
                      sideNoise = noise.simplex2(x / 10 + this.j, y / 10 + this.j),
                      rotation = rotNoise * 180 * 0.3,
                      scaling = sideNoise* 1.1 + 1.5,
                      relScaling = scaling / (square.oldScaling || 1),
                      relRotation = rotation - square.oldRotation || 0 ; 
                square.rotate(relRotation);
                square.oldRotation = rotation;
                square.scale(relScaling);
                square.oldScaling = scaling;
                sizes.push(scaling);
                let borderColor = colorIfIntersectsBorder(x, y, 
                                                      square, colors, 
                                                      context.canvas.width),
                    newColor = borderColor || this.calculatedColors[index];
                square.fillColor = newColor;
                coloredSquares.push([square, borderColor]);
         });
            sizes.forEach((size,index) =>{
                const [x,y] = xy(index);
                if(!coloredSquares[index][1]){
                    const sq = coloredSquares[index][0],
                    neighbors = neighborsXYs(x,y)
                    .map(indexForXY)
                    .filter(i => sizes[i] > size)
                    .sort((a,b) => sizes[b] - sizes[a])
                    .map(i => this.squares[i]);
                    for(let i = 0; i < neighbors.length; i++){
                        const neighbor = neighbors[i];
                        if(sq.intersects(neighbor)){
                            this.calculatedColors[index] = neighbor.fillColor;
                            break;
                        }
                    }
                }
            });

            this.i += 0.002;
            this.j -= 0.003;
            
        }
    };
});
