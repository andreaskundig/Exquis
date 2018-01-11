define(["bibs/canvasBuffer"], function(canvasBuffer){ return {
    setup: function(context){
        this.TO_RADIANS = Math.PI/180;
        this.buffer = canvasBuffer.makeBuffer(context.canvas.width,
                                              context.canvas.height);
        this.axis = {x: 0, y: 20};
        this.rotation = 0;
        this.framecount=0;
    },
    draw: function(context, borders, lib){
        //copy borders on canvas
        context.putImageData(borders.west, 0, 0);
        context.putImageData(borders.east, context.canvas.width -1, 0);
        context.putImageData(borders.north, 0, 0);
        context.putImageData(borders.south, 0, context.canvas.height -1 );

        //copy canvas to buffer
        this.buffer.copyToBuffer(context, {x:0, y:0});
        
        //copy from buffer to rotated canvas
        context.save();
        context.translate(this.axis.x, this.axis.y);
        context.rotate(this.rotation * this.TO_RADIANS);
        context.translate(-this.axis.x, -this.axis.y);
        this.buffer.pasteInto(context);
        context.restore();
        
        // change rotation for next loop        
        this.framecount++;
        this.rotation = Math.sin(this.framecount/50) *2;//-5;//(this.rotation - 0.5) % 360;

    }
}});
