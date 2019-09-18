define(["bibs/noise","paper","bibs/imageDataUtils", "bibs/shapes",
"bibs/shapeGrid"], 
function(noise, paper, idu, shapes, ShapeGrid){

    const colorIfIntersectsBorder = (border, square, borderColors, canvasSize) => {
        let ok =    border == 'west' && square.bounds.left < 0;
        ok = ok || (border == 'north' && square.bounds.top < 0);
        ok = ok || (border == 'east' && square.bounds.right > canvasSize);
        ok = ok || (border == 'south' && square.bounds.bottom > canvasSize);
        return ok ?  borderColors[border] : null;
    };
    
    const findBiggerIntersectingNeighbor = (square,x,y,g) => {
        return g.neighbors(x,y)
                .filter(neighbor => neighbor.scaling.x > square.scaling.x)
                .sort((a,b) => b.scaling.x - a.scaling.x)
                .find(n => square.intersects(n));
    };

    const computeScale = (x,y,noise,shape) => {
        shape.count = isNaN(shape.count) ? 0: shape.count + 1;
        const previousScaling = shape.scaling.x;
        if(shape.count % 200 > 0){
            return previousScaling;
        }
            var sign = x % 2  ? -1 : 1;
            var sign2 = y % 2  ? -1 : 1;
            var r = (0.5 - Math.random()) * .05;
            return previousScaling +    sign *  sign2 * r
    }
    const computeRotation = (x,y,seed) => {
        return seed+ x *-15 - y *Math.sin(seed/100) *10 +6;  
    }
    
    
    const createShape = (paper, topLeft, width) => {
      const side = 150/4;
      const shapeSize = new paper.Size(side * 0.65,side*1.5).multiply(1.2);
      const shapeTopLeft = topLeft.add(side/2).subtract(shapeSize.divide(2));
      return paper.Path.Rectangle({
          point:shapeTopLeft,
          fillColor: 'white',
          size: shapeSize,
          applyMatrix: false
      }) ;
    };
    
    
    return {
        setup: function({context}){
            this.calculatedColors = [];
            this.grid = new ShapeGrid(context, {createShape});
            this.rotationSeed = 0;
            this.scaleNoise = 1;

        },
        
        draw: function({context, borders}){
            let colors = Object.keys(borders).reduce((acc, dir) => {
                let avg = idu.averageColor(borders[dir]);
                acc[dir] = avg[3] == 0 ? null : `rgba(${avg.join(',')})`;
                return acc;
             } ,{});
            
            const g = this.grid;
            g.forEach((square,x,y,index) =>{
                const scaling = computeScale(x,y,this.scaleNoise,square);
                square.rotation = computeRotation(x,y,this.rotationSeed) ;
                square.scaling = [scaling,scaling];
             });
             
             g.forEach((square,x,y,index) => {
                const neighboringBorder = g.neighboringBorder(x, y);
                const borderColor = colorIfIntersectsBorder(neighboringBorder,
                                                      square, colors, 
                                                      context.canvas.width);
                const newColor = borderColor || this.calculatedColors[index];
                square.fillColor = newColor || square.fillColor;
                if(!borderColor){
                    const neighbor = findBiggerIntersectingNeighbor(square,x,y,g);
                    if(neighbor){
                        this.calculatedColors[index] = neighbor.fillColor;
                    }
                }
            });
            this.rotationSeed += 0.61;
            this.scaleNoise += 0.02;
        }
    };
});
