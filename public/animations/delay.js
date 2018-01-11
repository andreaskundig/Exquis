define({
setup: function(context){
this.start = new Date();
this.frameCount = 0;},
draw: function(context, borders){
this.frameCount++;
var now = new Date();
var elapsed = now - this.start;
var motherPeriodDuration = Math.random()*1000;
var motherPeriodCount = Math.floor((elapsed) / motherPeriodDuration);
var timeSinceMotherPeriod = elapsed - motherPeriodCount * motherPeriodDuration ;
var nbPeriodsWithinSecond = 10;
var period = Math.floor(nbPeriodsWithinSecond * Math.pow(timeSinceMotherPeriod / motherPeriodDuration, 2));
var nbLinesToCopy = nbPeriodsWithinSecond - period; //1 3, 2 2, 3 1

if(motherPeriodCount % 2 == 0){
    //if(Math.random() > 0.5){
    // paste current image one pixel down
    var currentImage = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
    context.putImageData(currentImage, nbLinesToCopy, 0);
    // add new line
    for(var i = 0; i< nbLinesToCopy; i++){
        context.putImageData(borders.west, i, 0);
    }
}else{

    // north

    var currentImage = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
    context.putImageData(currentImage, 0, nbLinesToCopy);
    // add new line
    for(var i = 0; i< nbLinesToCopy; i++){
        context.putImageData(borders.north, 0, i);
    }
}}});
