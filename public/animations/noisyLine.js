define(["bibs/noise"], function(noise){
return {draw: function (context, borders){
            this.frameCount += 1;
            if( this.frameCount % 2 == 0) {
	        context.fillStyle = "rgba( 255, 255, 255, 0.35)";
	        context.fillRect( 0, 0, this.width, this.height);

	        this.xstart += 0.01;
	        this.ystart += 0.01;

	        this.xstartNoise += 0.01;
	        this.ystartNoise += 0.01;

	        this.xstart += (noise.perlin2( this.xstartNoise, 0) * 0.5) - 0.25;
	        this.ystart += (noise.perlin2( this.ystartNoise, 0) * 0.5) - 0.25;

	        var xnoise = this.xstart;
	        var ynoise = this.ystart;

	        for( var y = 0; y <= this.height; y += 15) {
	            ynoise += 0.1;
	            xnoise = this.xstart;

	            for( var x = 0; x <= this.width; x+= 15) {
	                xnoise += 0.1;
	                this.drawLine( x, y, noise.perlin2( xnoise, ynoise));
	            };
	        };
            };
        },
        setup: function (context){
            this.frameCount = 0;

            this.xstartNoise = Math.floor( Math.random() * 20);
            this.ystartNoise = Math.floor( Math.random() * 20);

            this.xstart = Math.floor( Math.random() * 10);
            this.ystart = Math.floor( Math.random() * 10);

            this.width = context.canvas.width;
            this.height = context.canvas.height;

            this.radians360 = Math.PI * 2;

            this.drawLine = function( x, y, noiseFactor) {
	        context.save();
	        context.translate( x, y);
	        context.rotate( noiseFactor * this.radians360);
	        context.beginPath();
	        context.moveTo( 0, 0);
	        context.lineTo( 20, 0);
	        context.strokeStyle = "rgba( 0, 0, 0, 0.58)";
	        context.stroke();
	        context.restore();
            };
        }};
});
