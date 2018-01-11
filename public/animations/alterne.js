define({
setup: function(context){
this.start = new Date();
this.frameCount = 0;},
draw: function(context, borders){
this.frameCount++;
var elapsed = new Date() - this.start;
var motherPeriodCount = Math.floor((elapsed) / 1700);

if(motherPeriodCount % 2 == 0){
    var currentImage = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
    context.putImageData(currentImage, 1, 0);
    // add new line
    context.putImageData(borders.west, 0, 0);
}else{
    var currentImage = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
    context.putImageData(currentImage, 0, 1);
    // add new line
    context.putImageData(borders.north, 0, 0);
}}});
