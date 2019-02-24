define(["bibs/imageDataUtils"],function(idu){
    return {

	setup: function(context){
	    this.step = 0;
	    this.sweeps = 5; 
	    this.increments = 7;
	    this.swSize = context.canvas.width / this.sweeps;
	    this.incSize = Math.ceil(context.canvas.width / this.increments);
	    this.borderNames = ['north', 'east']//, 'south','west']; 
	    this.bords = this.borderNames.length; 
	},
	draw: function(context, borders){
		const incI = this.step % this.increments;
		const bordI = Math.floor(this.step/this.increments ) % this.bords;
		const swI = Math.floor(this.step/this.increments/this.bords) % this.sweeps;
		const border = this.borderNames[bordI];//'south';
        const r = this.makeRectangle(incI, swI, border);
		//console.log(border)
        if(incI == 0){
		//console.log(swI);
    		context.fillStyle = this.getColor(swI,this.swSize,borders[border]);
        }
		context.fillRect(r.x, r.y, r.w, r.h);

        this.step++;
	},
	getColor: function(index, size, imageData){
        const px = Math.round(size * 4);
        //console.log(index, size, index * px, (index + 1) * px);
        const avg = idu.averageColor(imageData, index * px, (index + 1) * px);
		return `rgba(${avg.join(',')})`;
	},
	makeRectangle: function(incIndex,  sweepIndex, border){
	    const incSize = this.incSize;
	    const sweepSize = this.swSize;
	    const sweepIndexDesc = (this.sweeps - 1) - sweepIndex;
	    const incIndexDesc = (this.increments - 1) - incIndex;

	    const incCoord = incIndex * incSize;
	    const incCoordDesc = incIndexDesc * incSize;
	    const sweepCoord = sweepIndex * sweepSize ;
	    const sweepCoordDesc = sweepIndexDesc * sweepSize ;

	    switch(border){
	        case 'north':
	            return {x: sweepCoordDesc, w: sweepSize, y: incCoord, h: incSize};
	        case 'east':
	            return {x: incCoordDesc, w: incSize,y: sweepCoordDesc, h: sweepSize};
	        case 'west': 
	            return {x: incCoord, w: incSize, y: sweepCoord, h: sweepSize};
	        case 'south':
	            return {x: sweepCoord, w: sweepSize, y: incCoordDesc, h: incSize};
	    }
	    
	}
}});
