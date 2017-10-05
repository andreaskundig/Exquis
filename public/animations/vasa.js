define(["bibs/noise"], function(noise){
return {draw: function (context, borders){
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
                        
                    context.save();
                    context.translate((x + 0.5) * scale, (y + 0.5) * scale);
                    context.rotate(rotation);
                    context.fillRect(-side / 2, -side / 2, side, side);
                    
                    context.restore();
                }
            }

            this.i += 0.01;
            this.j += 0.003;
        },
        setup: function (context){
            this.i = 0;
            this.j = 42;
        }};
});