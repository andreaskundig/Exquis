define(["bibs/imageDataUtils", "bibs/shapeGrid","bibs/wanderingPoint"], 
function( idu, ShapeGrid,wp){
    return {
        setup: function (context){
            const elementsPerSide = 10;
            this.grid = new ShapeGrid(context, {elementsPerSide});
            this.step = 0;
        },
        draw: function (context, borders){
            const previous = this.previousPotato;
            const potato = this.next(previous);
            potato.fillColor =
                this.chooseColor(borders, potato, previous);
            this.previousPotato = potato;
            this.step++;
        },
        chooseColor: function(borders, potato, previousPotato){
            const g = this.grid;
            const xy = g.coordinates(potato);
            const borderName = g.neighboringBorder(...xy);
            if(this.step % 5 || !borderName){
                return previousPotato && previousPotato.fillColor;
            }
            let avg = idu.averageColor(borders[borderName]);
            return `rgba(${avg.join(',')})`;
        },
        next: function(current){
            const g = this.grid;
            if(!current){
                //return this.grid.getElementByXY(0,0);
                return this.first(g.elementsPerSide);
            }
            const xy = g.coordinates(current);
            const neighbors = g.neighborsXYs(...xy);
            const ni = Math.floor(Math.random()*neighbors.length);
            return g.getElementByXY(...neighbors[ni]);
        },
        first: function (count){
            const g = this.grid;
            const startCoordinates =
                  [Math.round(Math.random()) * (count-1),
                   Math.round(Math.random() * (count-1))];
            if(Math.random()>0.5){ startCoordinates.reverse(); }
            return g.getElementByXY(...startCoordinates);
        }
    };
});
