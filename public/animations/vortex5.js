define(["bibs/canvasBuffer"], function(canvasBuffer){ return {
    setup: function(context){
        this.toRadians =  Math.PI / 180; 
        
        this.rotation = 0 ;
        this.buffer = canvasBuffer.makeBuffer(context.canvas.width,
                                              context.canvas.height);
        this.delta = -1;                                      
    },
    
    draw: function(context, borders){
        
        //copy borders on canvas
        context.putImageData(borders.west, 0, 0);
        context.putImageData(borders.east, context.canvas.width -1, 0);
        context.putImageData(borders.north, 0, 0);
        context.putImageData(borders.south, 0, context.canvas.height -1 );
        
        this.buffer.copyToBuffer(context, {x:0, y:0});
        context.save();
        context.translate(25, 85);
        for(var i = 0; i<4 ; i++){

            context.save();
            context.rotate(this.rotation* this.toRadians + Math.PI*i/2);
        context.translate(0, 3);
            this.buffer.copyFromBuffer(context);
            context.restore();
        }
        context.restore();

        this.rotation += this.delta;


    }
};});
