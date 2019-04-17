define(["bibs/wanderingPoint","bibs/imageDataUtils"], function(wp,idu){return {
    setup: function (context){
        // setup wandering point
        const limit = [-context.canvas.width -5, context.canvas.height + 5];
        const direction = [1, .9];
        const startPoint = [0, context.canvas.width];
        const speed = 15;
        this.w = wp.makeWanderer([limit, limit],direction,startPoint,speed);
        this.copyHorizontal = true;
        this.copyDirection = Math.sign(this.w.direction[0]);
    },
    draw: function (context, borders){
        const dirBefore = this.w.direction.slice();
        this.w.move();
        const switched = this.w.direction.reduce((sw,d,i)=>{
            if(d != dirBefore[i]){ sw.push(i); }
            return sw;
        },[]);
        if(switched.length>0){
            const copyIndex = switched[0];
            this.copyHorizontal = copyIndex === 0;
            this.copyDirection = Math.sign(this.w.direction[copyIndex]);
        }
        var x = Math.round(this.w.coordinates[0]);
        var y = Math.round(this.w.coordinates[1]);
        context.fillStyle = "rgb(255,190,255)";
        const recSize = context.canvas.width;
        const canSize = context.canvas.width;
        const copySpeed = 6;
        let visible = -recSize + copySpeed < x &&
                x < canSize - copySpeed &&
                -recSize + copySpeed < y &&
                y < canSize - copySpeed;
        if(visible){
            const rec = idu.rectangle(Math.max(x,0),
                                      Math.max(y,0),
                                      Math.min(x + canSize, canSize),
                                      Math.min(y+ canSize, canSize));
            idu.pushLine(context, borders, rec,
                         this.copyHorizontal, 
                         this.copyDirection * copySpeed);
        }
        

        
    }
};});
