define(["bibs/noise", "bibs/imageDataUtils"], function(noise, idu){
return {draw: function (context, borders){
            // paste current image one pixel down
            //context.clearRect(0, 0, 150, 150);
            // east
            var scale = 50;

            for (var x = 0; x < context.canvas.width / scale; x++) {
                for (var y = 0; y < context.canvas.height / scale; y++) {
                    // noise.simplex2 and noise.perlin2 return values between -1 and 1.
                    var value = noise.simplex2(x / 10 + this.i, y / 10 + this.i);
                    var rec = idu.rectangle(x * scale, y * scale, scale, scale) ;
                    var horizontal = value < -0.5 || value > 0.5; 
                    var direction = value < 0 ? -1 : 1;
                    idu.pushLine(context, borders, rec, horizontal, 7*direction);
                }
            }

            this.i += 0.01;
        },
        setup: function (context){
            this.i = 0;
        }};
});