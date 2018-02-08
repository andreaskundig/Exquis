define(["bibs/wanderingPoint"], function(wp){return {
    setup: function (context){
        var limit = [-155 , 155 ];
        this.w = wp.makeWanderer([limit, limit]);
    },
    draw: function (context, borders){
        context.fillStyle = "rgb(165,255,255)";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        const dirBefore = this.w.direction.slice();
        this.w.move();
        
        const switched = this.w.direction.reduce((sw,d,i)=>{
            if(d != dirBefore[i]){ sw.push(i); }
            return sw;
        },[]);
        if(switched.length>0){
            console.log('switch', switched[0], 
            Math.sign(this.w.direction[switched[0]]));
        }
        var x = this.w.coordinates[0];
        var y = this.w.coordinates[1];
        context.fillStyle = "rgb(255,190,255)";
        context.fillRect(x, y, 150, 150);
        
    }
};});
