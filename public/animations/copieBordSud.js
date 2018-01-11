define([], 
function(){
    return {
        draw: function (context, borders){
            // paste current image one pixel down
            var currentImage = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
            context.putImageData(currentImage, 0, -this.nbPixels);
            // add new line
            for(var i=0; i<this.nbPixels+1; i++){
                context.putImageData(borders.south, 0, context.canvas.height - i);    
            }
        },
        setup: function (context){
            this.nbPixels = 1;
        }};
});
