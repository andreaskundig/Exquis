define(
{setup: function({context}){
     this.start = new Date(Math.random()*1000000);
     this.frameCount = 0;
},
 draw: function({context, borders}){
     this.frameCount++;
     var now = new Date();
     var elapsed = now - this.start;
     var motherPeriodDuration = 3000;
     var motherPeriodCount = Math.floor((elapsed) / motherPeriodDuration);
     var timeSinceMotherPeriod = elapsed - motherPeriodCount * motherPeriodDuration ;
     var nbPeriodsWithinSecond = 3;
     // period goes from 1 to nbPeriodsWithinSecond
     // period 1 lasts longer than period 2 etc.
     // the duration of the periods decrease quadratically
     var period = 1 + Math.floor(nbPeriodsWithinSecond * Math.pow(timeSinceMotherPeriod / motherPeriodDuration, 2));
     // skip no frame in period 1, all except every second one in period 2
     //  all except every third one in period 3
     var skipFrame = ! period == 1 || this.frameCount % period != 0;

     if(!skipFrame){
         if(motherPeriodCount % 2 == 0){
             //if(Math.random() > 0.5){
             // paste current image one pixel down
             var currentImage = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
             context.putImageData(currentImage, 1, 0);
             // add new line
             context.putImageData(borders.west, 0, 0);
         }else{

             // north

             var currentImage = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
             context.putImageData(currentImage, 0, 1);
             // add new line
             context.putImageData(borders.north, 0, 0);
         }
     }}
});
