define(["bibs/canvasBuffer","bibs/wanderingPoint"], 
function(canvasBuffer,wp){ return {
    setup: function(context){
        this.toRadians =  Math.PI / 180; 
        
        this.rotation = 70 ;
        this.buffer = canvasBuffer(context.canvas.width,
                                              context.canvas.height);
        var limit = [-200 , 340];
        this.w = wp.makeWanderer([limit],[3],[370],0.5);
                                              
                                   
    },
    
    draw: function(context, borders){
        
        //copy borders on canvas
        context.putImageData(borders.west, 0, 0);
        context.putImageData(borders.east, context.canvas.width -1, 0);
        context.putImageData(borders.north, 0, 0);
        context.putImageData(borders.south, 0, context.canvas.height -1 );
        
        this.buffer.copyToBuffer(context, {x:0, y:0});
        
                this.w.move();
        var x = this.w.coordinates[0];
        var y = 40;

        context.save();
        context.translate(x, y);
        for(var i = 0; i<4 ; i++){

            context.save();
            context.rotate(this.rotation* this.toRadians + Math.PI*i/2);
            context.translate(0, 3);
            this.buffer.copyFromBuffer(context);
            context.restore();
        }
        context.restore();
        
    }
};});