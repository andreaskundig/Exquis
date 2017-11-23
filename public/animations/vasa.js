define(["bibs/noise","paper","bibs/imageDataUtils"], function(noise, paper,idu){
    const squaresPerSide = 5,
          squares = [],
          xy= index => [Math.floor(index / squaresPerSide),
                        index % squaresPerSide];
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
                              size: new p.Size(squareSize,squareSize),
                              fillColor: 'blue'}) ;
                    squares.push(square);
                }
            }

        },
        draw: function (context, borders){

            let colors = Object.keys(borders).reduce((acc, dir) => {
                acc[dir] = idu.averageColor(borders[dir]);
                return acc;
             } ,{});
            let sizes = [],
                coloredSquares = [];
            squares.forEach((square,index) =>{
                const [x,y] = xy(index) ,
                      rotNoise = noise.simplex2(x / 10 + i, y / 10 + i),
                      sideNoise = noise.simplex2(x / 10 + j, y / 10 + j),
                      rotation = rotNoise * 180 * 0.3,
                      //                  scaling = .8,
                      scaling = sideNoise* 0.5 + 1,
                      relScaling = scaling / (square.oldScaling || 1),
                      relRotation = rotation - square.oldRotation || 0 ; 
                //     side = scale * 0.9 * Math.abs(sideNoise * 0.6+0.9);
                square.rotate(relRotation);
                square.oldRotation = rotation;
                square.scale(relScaling);
                square.oldScaling = scaling;
                sizes.push(scaling);
                let newColor = false;
                //are we close to a border
                //which one
                // compare bounds to check intersection
                //if intersection, take new color from average color
                // else take color from calculatedColors
                // set color of square
                coloredSquares.push([square, scaling, newColor]);
                //            console.log(square.scaling,sideNoise);
            });
            sizes.forEach((size,index) =>{
                const [x,y] = xy(index);
                //return if square already has a color
                // else take biggest intersecting neighbor's color
                // keep same color
                // put color in calculatedColor
            });

            i += 0.003;
            j += 0.004;
        }
    };
});
