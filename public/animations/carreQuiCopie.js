define(["bibs/wanderingPoint","bibs/imageDataUtils"], function(wp,idu){return {
    setup: function (context){
        var limit = [-155 , 155 ];
        this.w = wp.makeWanderer([limit, limit]);
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

            // console.log('switch', switched[0], 
            // this.copyHorizontal, this.copyDirection);
        }
        var x = Math.round(this.w.coordinates[0]);
        var y = Math.round(this.w.coordinates[1]);
        context.fillStyle = "rgb(255,190,255)";
        const recSize = 150;
        const canSize = context.canvas.width;
        const copySpeed = 10;
        //context.fillRect(x + 50, y +50, recSize-50, recSize-50);
        let visible = -recSize + copySpeed < x &&
                x < canSize - copySpeed &&
                -recSize + copySpeed < y &&
                y < canSize - copySpeed;
        // console.log(x,y,x + recSize, y+recSize);
        if(visible){
            const rec = idu.rectangle(Math.max(x,0),
                                      Math.max(y,0),
                                      Math.min(x + canSize, canSize),
                                      Math.min(y+ canSize, canSize));
            try{
            idu.pushLine(context, borders, rec,
                         this.copyHorizontal, this.copyDirection * 2);
            }catch(e){
            console.log('visible', Math.max(x,0),
                                      Math.max(y,0),
                                      Math.min(x + canSize, canSize),
                        Math.min(y + canSize, canSize));
                console.error(e);
            }
        }
        

        
    }
};});
