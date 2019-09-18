define({
        draw: function({context, borders}){
            context.fillStyle = "rgb(100,250,0)";
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);

            context.save();
            context.translate(this.halfWidth, this.halfHeight);
            context.scale(3, 3);
            context.rotate(this.rotation* this.toRadians);

            this.rotation = this.rotation + 3;

            context.fillStyle = "rgb(250,20,255)";
            context.fillRect(-25, -25, 50, 50);
            
            context.restore();
            
            
            context.save();
            
            context.translate(this.halfWidth, this.halfHeight);
            context.scale(1, 1);
            context.rotate(this.rotationx* this.toRadians);

            this.rotationx = this.rotationx + 1;
            
            context.strokeStyle = "rgb(0,0,0)";
            context.lineWidth = 15;
            context.strokeRect(-75, -75, context.canvas.width, context.canvas.height);
            
            context.restore();
 
        },
        setup: function({context}){
            this.toRadians =  Math.PI / 180; 

            this.rotation = 0;
            this.rotationx = 0;
            this.halfWidth = context.canvas.width / 2;
            this.halfHeight = context.canvas.height / 2;
        }});
