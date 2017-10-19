define(["bibs/noise","paper"], function(noise, p){
return {
    setup: function (context){
        this.ps = new paper.PaperScope();
        this.ps.setup(context.canvas);
        this.squares = [];
        this.squaresPerSide = 5;
        const stepSize = context.canvas.width / this.squaresPerSide,
              squareSize = 25,
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
                    // paste current image one pixel down
            context.clearRect(0, 0, 150, 150);
            
            // east
            var scale = 30;
            context.fillStyle = "black"

            for (var x = 0; x < context.canvas.width / scale; x++) {
                for (var y = 0; y < context.canvas.height / scale; y++) {
                    // noise.simplex2 and noise.perlin2 return values between -1 and 1.
                    var rotNoise = noise.simplex2(x / 10 + this.i, y / 10 + this.i),
                        sideNoise = noise.simplex2(x / 10 + this.j, y / 10 + this.j),
                        rotation = rotNoise * Math.PI * .3, 
                        side = scale * 0.9 * Math.abs(sideNoise * 0.6+0.9);
                        side = 25
                    context.save();
                    context.translate((x + 0.5) * scale, (y + 0.5) * scale);
                    context.rotate(rotation);
                    context.fillRect(-side / 2, -side / 2, side, side);
                    
                    context.restore();
                }
            }


        
        this.squares.forEach((square,index) =>{
            const y = index % this.squaresPerSide,
                  x = Math.floor(index / this.squaresPerSide),
                  rotNoise = noise.simplex2(x / 10 + this.i, y / 10 + this.i),
                  sideNoise = noise.simplex2(x / 10 + this.j, y / 10 + this.j),
                  rotation = rotNoise * 180 * 0.3,
                  relRotation = rotation - square.oldRotation||0 ; 
                   //     side = scale * 0.9 * Math.abs(sideNoise * 0.6+0.9);
            square.rotation = relRotation;// (rotation * 180 /Math.PI) - square.oldRotation || 0;          
            square.oldRotation = rotation;
        })
        //this.i += 0.01;
        //this.j += 0.003;

        this.ps.view.draw();
          //  return;

            this.i += 0.01;
            this.j += 0.003;
        }
}
});