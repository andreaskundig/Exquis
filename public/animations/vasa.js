define(["bibs/noise","paper"], function(noise, p){
return {
    setup: function (context){
        this.ps = new paper.PaperScope();
        this.ps.setup(context.canvas);
        this.squares = [];
        this.squaresPerSide = 5;
        const stepSize = context.canvas.width / this.squaresPerSide,
              squareSize = 29,
              centeringOffset = new p.Point(1,1)
                           .multiply((stepSize - squareSize)/2);
        
        for (var x = 0; x < this.squaresPerSide; x++) {
            for (var y = 0; y < this.squaresPerSide; y++) {
                const topLeft = new p.Point(x,y)
                                     .multiply(stepSize)
                                     .add(centeringOffset),
                      square = p.Path.Rectangle({
                                 point:topLeft, 
                                 size: new p.Size(squareSize,squareSize),
                                 fillColor: 'blue'}) ;
                this.squares.push(square);
            }
        }

        this.i = 0;
        this.j = 42;
    },
    draw: function (context, borders){

            // east
        var scale = 30;

        this.squares.forEach((square,index) =>{
            const y = index % this.squaresPerSide,
                  x = Math.floor(index / this.squaresPerSide),
                  rotNoise = noise.simplex2(x / 10 + this.i, y / 10 + this.i),
                  sideNoise = noise.simplex2(x / 10 + this.j, y / 10 + this.j),
                  rotation = rotNoise * 180 * 0.3,
//                  scaling = .8,
                  scaling = sideNoise* 0.5 + 1,
                  relScaling = scaling / (square.oldScaling || 1),
                  relRotation = rotation - square.oldRotation || 0 ; 
                   //     side = scale * 0.9 * Math.abs(sideNoise * 0.6+0.9);
            square.rotate(relRotation);
            square.oldRotation = rotation;
            square.scale(relScaling)
            square.oldScaling = scaling;
//            console.log(square.scaling,sideNoise);
        })

            this.i += 0.003;
            this.j += 0.004;
    }
}
});