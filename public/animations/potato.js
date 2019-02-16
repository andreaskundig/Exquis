define(["bibs/noise","paper","bibs/imageDataUtils", "bibs/shapes",
"bibs/shapeGrid","bibs/wanderingPoint"], 
function(noise, paper, idu, shapes, ShapeGrid,wp){
    const elementsPerSide = 15;
    
    const chooseColor = (x,y,g, borders) => {
        const borderName = g.neighboringBorder(x,y);
        if(!borderName){
            return null;
        }
        let avg = idu.averageColor(borders[borderName]);
        return `rgba(${avg.join(',')})`;
    }
    
    return {
        setup: function (context){
            this.grid = new ShapeGrid(context, {elementsPerSide});
            this.rotationSeed = 0;
            const startCoordinates = [Math.random() > 0.5 ? 0 : elementsPerSide - 1,
                                      Math.floor(Math.random()*elementsPerSide)];
            if(Math.random()>0.5){ startCoordinates.reverse(); }
            const pc = {x: startCoordinates[0], y: startCoordinates[1]};
            this.potatoCoordinates = pc;
            this.potato = this.grid.getElementByXY(pc.x, pc.y);
            
        },
        
        draw: function (context, borders){
            const g = this.grid;
            const p = this.potatoCoordinates;
            const color = chooseColor(p.x, p.y, g, borders) || this.previousPotato.fillColor;
            this.potato.fillColor = color;
            
            const npc = this.nextPotatoCoordinates(p,g);
            this.potatoCoordinates = npc;
            this.previousPotato = this.potato
            this.potato = g.getElementByXY(npc.x, npc.y);

           
            this.rotationSeed += 0.61;
        },
        nextPotatoCoordinates: (previousCoordinates,g) => {
            const p = previousCoordinates
            const neighbors = g.neighborsXYs(p.x, p.y);
            const ni = Math.floor(Math.random()*neighbors.length);
            return { x: neighbors[ni][0],y: neighbors[ni][1]};
        }
    };
});
