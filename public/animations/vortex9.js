define(["bibs/canvasBuffer","bibs/wanderingPoint"], 
function(canvasBuffer,wp){ return {
    setup: function(context){
        this.toRadians =  Math.PI / 180; 
        
        this.rotation = 0 ;
        this.buffer = canvasBuffer(context.canvas.width,
                                              context.canvas.height);
        var limit = [10 , 140];
        this.w = wp.makeWanderer([limit, limit]);
                                              
                                   
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
        var y = this.w.coordinates[1];

        context.save();
        context.translate(x, y);
        for(var i = 0; i<3 ; i++){

            context.save();
            context.rotate(this.rotation* this.toRadians + Math.PI*i*2/3);
            context.translate(0, 3);
            this.buffer.pasteInto(context);
            context.restore();
        }
        context.restore();

        this.rotation += 0.5 ;
    }
};});
