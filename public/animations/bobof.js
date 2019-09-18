define({
        draw: function({context, borders}){
            context.fillStyle = "rgb(100,250,0)";
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
bobo
            context.save();
            context.translate(this.halfWidth, this.halfHeight);
            context.scale(3, 3);
            context.rotate(this.rotation* this.toRadians);

            this.rotation = this.rotation + 1;

            context.fillStyle = "rgb(150,20,200)";
            context.fillRect(-25, -25, 50, 50);

            context.restore();
        },
        setup: function({context}){
            this.toRadians =  Math.PI / 180; 

            this.rotation = 0;
            this.halfWidth = context.canvas.width / 2;
            this.halfHeight = context.canvas.height / 2;
        }});
