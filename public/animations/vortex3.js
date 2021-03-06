define(["bibs/canvasBuffer"], function(canvasBuffer){ return {
    setup: function({context}){
        this.toRadians =  Math.PI / 180; 
        this.rotation = 179.5 ;
        this.buffer = canvasBuffer.makeBuffer(context.canvas.width,
                                              context.canvas.height);
    },
    
    draw: function({context, borders}){
        //copy borders on canvas
        context.putImageData(borders.west, 0, 0);
        context.putImageData(borders.east, context.canvas.width -1, 0);
        context.putImageData(borders.north, 0, 0);
        context.putImageData(borders.south, 0, context.canvas.height -1 );
        
        this.buffer.copyToBuffer(context, {x:0, y:0});

        context.save();
        context.translate(150, 150);
        context.scale(.999,.99)
        context.rotate(this.rotation* this.toRadians);
        this.buffer.pasteInto(context);
        context.restore();
    }};
                                                    });
