define(["bibs/wanderingPoint","bibs/imageDataUtils"], function(wp,idu){return {
    setup: function({context}){
        this.size = 35;
        this.limit = [0 , context.canvas.width - this.size];
        this.w = wp.makeWanderer([this.limit, this.limit],[-101,65],[0,0],1);
    },
    draw: function({context, borders}){

        for(let i=0; i<5;i++){
           this.w.move();
           var x = this.w.coordinates[0];
           var y = this.w.coordinates[1];
           //console.log(x,y)
           //context.fillStyle = "rgb(255,190,255)";
           const lim = this.limit;
           if(this.w.collisions){
              context.fillStyle = this.borderColor(this.w.collisions[0], borders);
           }
           context.fillRect(x, y, this.size, this.size);
        }
    },
    borderColor:  function(collision, borders){
        let borderName, from;
        if(this.limit.includes(collision[0])){
            borderName = collision[0] === 0 ? 'west' : 'east';
            from = Math.round(collision[1]) * 4;
        }else{
            borderName = collision[1] === 0 ? 'north' : 'south';
            from = Math.round(collision[0]) * 4;
        }
        const border = borders[borderName];
        const to = Math.min(from + Math.round(this.size) * 4, 
                   border.data.length -1);
        const avg = idu.averageColor(border, from , to);
        //console.log(from, to,border.data.length , avg+'')
		return `rgba(${avg.join(',')})`
        
    }
};});
