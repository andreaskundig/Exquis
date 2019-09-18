define({
	setup: function({context}){
		this.toRadians = function(degrees){
			return  degrees * Math.PI / 180; 
		};
		this.rotation = 0;
		this.halfWidth = context.canvas.width / 2;
		this.halfHeight = context.canvas.height / 2;
	},
	draw: function({context, borders}){
		context.fillStyle = "rgb(150,10,20)";
		context.fillRect(0, 0, context.canvas.width, context.canvas.height);

		context.save();
		context.translate(this.halfWidth, this.halfHeight);
		context.scale(Math.cos(this.rotation * 0.1 ) * 4, Math.sin(this.rotation * 0.1) * 4  );
		context.rotate(this.toRadians(this.rotation)); 

		this.rotation = (this.rotation + .05 ) % 360;
//this.rotation += this.rotation * 0.05 *(Math.random()-.75);

        context.fillStyle = "rgb(0,30,150)";
        context.fillRect(-25, -25, 50, 50);

        context.restore();
}});
