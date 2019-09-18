define(["bibs/imageDataUtils"], 
function(imageDataUtils){
    return {
        draw: function({context, borders}){
            var averages = [imageDataUtils.averageColor(borders.north),
                            imageDataUtils.averageColor(borders.east),
                            imageDataUtils.averageColor(borders.south),
                            imageDataUtils.averageColor(borders.west)];
            var average = averages.reduce(function(res, next){
                                              return res.map(function(c, index){
                                                                 return c + next[index] / 4;
                                                             });
                                          }, [0, 0, 0, 0]);                
            
            context.fillStyle = imageDataUtils.array2CSSColor(average);
            context.fillRect(0, 0, borders.north.width, borders.east.height+1);

            //copy image one pixel south
            //var currentImage = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
            //context.putImageData(currentImage, 0, 1);
            
        },
        setup: function({context}){
        }
    };
});
