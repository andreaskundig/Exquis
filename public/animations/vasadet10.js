define(["bibs/noise","paper","bibs/imageDataUtils", "bibs/shapes",
"bibs/shapeGrid","bibs/wanderingPoint"], 
function(noise, paper, idu, shapes, ShapeGrid,wp){
    const elementsPerSide = 10;
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
    
    var limit = [0 , elementsPerSide -1 ];
    var limits = [limit, limit];
    var direction = [8, 5];
    var startPoint = [Math.round(elementsPerSide*Math.random()), 
                      Math.round(elementsPerSide*Math.random())];
    var speed = .02  ;
    const w = wp.makeWanderer(limits, direction, startPoint, speed);

    const computeScale = (x,y) => {
        const center = w.coordinates
        const distanceFromCenter = Math.abs( x + y - center[0] - center[1]);
        return 1 + distanceFromCenter/40;
    }
    const computeRotation = (x,y,touchesBorder, seed) => {
        if(touchesBorder){
            return 0;
        }
        return (seed- x *1.5 - y  *1.0 );  
    }
    
    const xSideScale = .5;
    const ySideScale = 1.6;
    const createShape = (paper, topLeft, width) => {
      const side = 150/elementsPerSide;
      const shapeSize = new paper.Size(side * xSideScale,side*ySideScale);
      const shapeTopLeft = topLeft.add(side/2).subtract(shapeSize.divide(2));
      return paper.Path.Rectangle({
          point:shapeTopLeft,
          fillColor: 'white',
          size: shapeSize,
          applyMatrix: false
      }) ;
    };
    
    return {
        setup: function (context){
            this.calculatedColors = [];
            this.grid = new ShapeGrid(context, {
                createShape, 
                elementsPerSide
            });
            this.rotationSeed = 0;
            const scale = elementsPerSide/(elementsPerSide-2);

            this.grid.scale(scale * Math.max(1,xSideScale), 
                            scale * Math.max(1,ySideScale));
        },
        
        draw: function (context, borders){
            w.move();
            let colors = Object.keys(borders).reduce((acc, dir) => {
                let avg = idu.averageColor(borders[dir]);
                acc[dir] = avg[3] == 0 ? null : `rgba(${avg.join(',')})`;
                return acc;
             } ,{});
            
            const g = this.grid;
            g.forEach((square,x,y,index) =>{
                const scaling = computeScale(x,y);
                const touchesBorder = g.xyTouchesBorder(x,y);
                square.rotation = computeRotation(x,y,touchesBorder, 
                                                  this.rotationSeed) ;
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
        }
    };
});
