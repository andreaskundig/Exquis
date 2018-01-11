define({
setup: function(context){
    this.TO_RADIANS = Math.PI/180; 
 
    this.buffer = document.createElement('canvas');
    this.buffer.width = context.canvas.width;
    this.buffer.height = context.canvas.height;
    this.bufferCtx = this.buffer.getContext("2d");
  
    this.rotation = 1;
    this.framecount=0;
    
},
draw: function(context, borders, lib){
    this.framecount++;
    //put west border on the left etc..
    context.putImageData(borders.west, 0, 0);
    context.putImageData(borders.east, context.canvas.width -1, 0);
    context.putImageData(borders.north, 0, 0);
    context.putImageData(borders.south, 0, context.canvas.height -1 );
    this.bufferCtx.drawImage(context.canvas, 0, 0, 
        context.canvas.width, context.canvas.height);

    context.save();

    var axisX = context.canvas.width/2,
        axisY = context.canvas.height/2;      
    context.translate(axisX, axisY);
    context.rotate(this.rotation * this.TO_RADIANS);

    context.drawImage(this.buffer, -axisX, -axisY, 
        context.canvas.width, 
        context.canvas.height);
    context.restore();
    
}});
