define(["bibs/noise","paper","bibs/imageDataUtils", "bibs/shapes"], 
function(noise, paper, idu, shapes){
    const squaresPerSide = 5;
    const xy = index => [Math.floor(index / squaresPerSide),
                        index % squaresPerSide];

    return {
        setup: function (context){ 
            this.squares = [];
            this.i = 0;
            this.j = 42;
            const p = new paper.PaperScope();
            p.setup(context.canvas); 
            const pr = p.view.pixelRatio;
            const [ocx, ocy] = [p.view.center.x, p.view.center.y];

            const stepSize = p.view.size.width / squaresPerSide,
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
                              fillColor: 'black',
                              size: new p.Size(squareSize,squareSize)}) ;
                    this.squares.push(square);
                } 
            } 

        },
        draw: function (context, borders){
            this.squares.forEach((square,index) =>{
                const [x,y] = xy(index),
                      rotNoise = noise.simplex2(x/10 + this.i, y/10 + this.i),
                      sideNoise = noise.simplex2(x/10 + this.j, y/10 + this.j),
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
            });
            
            this.i += 0.003;
            this.j += 0.004;
            
        },
        tearDown: function(context){
            console.log("youpie");
        }
    };
});
