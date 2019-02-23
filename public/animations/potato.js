define(["bibs/imageDataUtils", "bibs/shapeGrid","bibs/wanderingPoint"], 
function( idu, ShapeGrid,wp){
    return {
        setup: function (context){
            const elementsPerSide = 10;
            this.grid = new ShapeGrid(context, {elementsPerSide});
        },
        draw: function (context, borders){
            const previous = this.previousPotato;
            const potato = this.next(previous);
            potato.fillColor =
                this.chooseColor(borders, potato, previous);
            this.previousPotato = potato;
        },
        chooseColor: function(borders, potato, previousPotato){
            const g = this.grid;
            const xy = g.coordinates(potato);
            const borderName = g.neighboringBorder(...xy);
            if(!borderName){
                return previousPotato && previousPotato.fillColor;
            }
            let avg = idu.averageColor(borders[borderName]);
            return `rgba(${avg.join(',')})`;
        },
        next: function(current){
            const g = this.grid;
            if(!current){
                return this.grid.getElementByXY(0,0);
            }
            const xy = g.coordinates(current);
            const neighbors = g.neighborsXYs(...xy);
            const ni = Math.floor(Math.random()*neighbors.length);
            return g.getElementByXY(...neighbors[ni]);
        }
    };
});
