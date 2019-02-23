define(["bibs/imageDataUtils", "bibs/shapeGrid","bibs/wanderingPoint"], 
function( idu, ShapeGrid,wp){ 
    return {
        setup: function (context){
            const elementsPerSide = 10;
            this.grid = new ShapeGrid(context, {elementsPerSide});
            this.step = 0;
            this.direction = [1,0]
        },
        draw: function (context, borders){
                        const g = this.grid;
            const previous = this.previousPotato;
            const potato = this.next(previous, this.direction);
            potato.fillColor =
                this.chooseColor(borders, potato, previous);
            const shouldChangeDirection = this.step % (g.elementsPerSide -1) == 0;
            if(shouldChangeDirection){
                this.direction.reverse();
            }
            this.previousPotato = potato;
            this.step++;
        },
        chooseColor: function(borders, potato, previousPotato){
            const g = this.grid;
            const xy = g.coordinates(potato);
            const borderName = g.neighboringBorder(...xy);
            const topOrLeft = xy[0] == 0 ||  xy[1] == 0;
            if( !topOrLeft){
                return previousPotato && previousPotato.fillColor;
            }
            let avg = idu.averageColor(borders[borderName]);
            return `rgba(${avg.join(',')})`;
        },
        next: function(current, direction){
            const g = this.grid;
            if(!current){
                return this.grid.getElementByXY(0,0);
            }
            const xy = g.coordinates(current);
            const nextXy = xy.map(
                (c,i) => Math.abs((c+direction[i]) % g.elementsPerSide));
            return g.getElementByXY(...nextXy);
        }
    };
});
