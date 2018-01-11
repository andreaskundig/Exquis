define(
{
    setup: function(context){
    },
    draw: function(context, borders){
        // paste current image one pixel down

        // east

        var currentImage = context.getImageData(0, 0, context.canvas.width, 
                                                context.canvas.height);
        context.putImageData(currentImage, -1, -1);

        // add new line
        context.putImageData(borders.east, context.canvas.width - 1, 0);

        // south
        context.putImageData(borders.south, 0, context.canvas.height - 1);}
});
