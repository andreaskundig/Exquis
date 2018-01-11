define(
{
    setup: function(context){
    },
    draw: function(context, borders){

        // paste current image one pixel down

        // east

        var currentImage = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        context.putImageData(currentImage, -1, 0);
        // add new line
        context.putImageData(borders.east, context.canvas.width - 1, 0);
    }
});
