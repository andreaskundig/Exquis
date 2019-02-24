define(["bibs/imageDataUtils"],function(idu){
    return {

	setup: function(context){
	    this.step = 0;
	    this.sweeps = 5;
	    this.increments = 15;
	    this.swSize = context.canvas.width / this.sweeps;
	    this.incSize = Math.ceil(context.canvas.width / this.increments);
	    this.borderNames = ['north', 'east', 'south','west']
	},
	draw: function(context, borders){
		const incI = Math.floor(this.step % this.increments);
		const swI = Math.floor(this.step / this.increments) % this.sweeps;
		const bordI = Math.floor(this.step / this.increments / this.sweeps) % 4
		const border = this.borderNames[bordI];//'south';
        if(incI == 0){
    		context.fillStyle = this.getColor(swI,this.swSize,borders[border]);
        }
        const r = this.makeRectangle(incI, swI, border);
		context.fillRect(r.x, r.y, r.w, r.h);

        this.step++;
	},
	makeRectangle: function(incIndex,  sweepIndex, border){
	    const incSize = this.incSize;
	    const sweepSize = this.swSize;
	    const totalSize = this.sweeps * sweepSize;
	    const incCoord = incIndex * incSize;
	    const sweepCoord = sweepIndex * sweepSize ;
	    switch(border){
	        case 'north':
	            return {x: sweepCoord, w: sweepSize, y: incCoord, h: incSize};
	        case 'west':
	            return {x: incCoord, w: incSize, y: sweepCoord, h: sweepSize};
	        case 'east':
	            return {x: totalSize - incSize - incCoord, w: incSize, 
	                    y: sweepCoord, h: sweepSize};
	        case 'south':
	            return {x: sweepCoord, w: sweepSize, 
	                    y:  totalSize - incSize - incCoord, h: incSize};
	    }
	    
	},
	getColor: function(index, size, imageData){
        const px = size * 4;
        const avg = idu.averageColor(imageData, index * px, (index + 1) * px);
		return `rgba(${avg.join(',')})`;
	}
}});
