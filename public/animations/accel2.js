define({
setup: function({context}){
this.start = new Date();
this.frameCount = 0;},
draw: function({context, borders}){
this.frameCount++;
var now = new Date();
var elapsed = now - this.start;
var motherPeriodDuration = 2000;
var motherPeriodCount = Math.floor((elapsed) / motherPeriodDuration);
var timeSinceMotherPeriod = elapsed - motherPeriodCount * motherPeriodDuration ;
var currentImage = context.getImageData(0, 0, context.canvas.width, context.canvas.height);

if(motherPeriodCount % 2 == 0){
    //if(Math.random() > 0.5){
    // paste current image one pixel west
    context.putImageData(currentImage, 1, 0);
    // add new line
    context.putImageData(borders.west, 0, 0);
}else if(motherPeriodCount % 2 == 1){

    // north
    context.putImageData(currentImage, 0, 1);
    // add new line
    context.putImageData(borders.north, 0, 0);
}}});
