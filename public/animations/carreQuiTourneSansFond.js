define({
        setup: function({context}){
            this.rotation = 0;
        },
        draw: function({context, borders}){
            context.fillStyle = "rgba(200,255,0,0)";

            context.clearRect(0, 0, context.canvas.width, context.canvas.height);

            context.save();
            context.translate(75, 75);
            context.rotate(this.rotation);
            context.fillStyle = "rgb(200,0,255)";
            context.fillRect(-70, -90, 140, 100);
            context.restore();
            
            this.rotation -= Math.PI / 180;
        }});
