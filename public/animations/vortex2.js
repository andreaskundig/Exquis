define(["bibs/canvasBuffer"], function(canvasBuffer){ return {
    setup: function(context){
        this.toRadians =  Math.PI / 180; 
        
        this.rotation = 0 ;
        this.buffer = canvasBuffer(context.canvas.width,
                                              context.canvas.height);
        this.delta = 0.5;                                      
    },
    
    draw: function(context, borders){
        
        //copy borders on canvas
        context.putImageData(borders.west, 0, 0);
        context.putImageData(borders.east, context.canvas.width -1, 0);
        context.putImageData(borders.north, 0, 0);
        context.putImageData(borders.south, 0, context.canvas.height -1 );
        
        this.buffer.copyToBuffer(context, {x:0, y:0});
        
        var normRotation = this.rotation % 360 ;
        var axis = normRotation < 180? [150,0] : [0,150];
        var fastZone = 60;
        var acceleration = 4; //TODO sinus acceleration
        if ( 0< normRotation && normRotation < fastZone
            || 180-fastZone< normRotation && normRotation < 180+fastZone
            || 360-fastZone< normRotation && normRotation < 360){
            this.rotation += acceleration;
        }
//console.log(normRotation);
        context.save();
        context.translate(axis[0], axis[1]);
        context.rotate(this.rotation* this.toRadians);
        this.buffer.copyFromBuffer(context);
        context.restore();

        this.rotation += this.delta;

    }
};});
