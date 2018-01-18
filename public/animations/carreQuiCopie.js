define(["bibs/imageDataUtils","bibs/wanderingPoint"], function(idu,wp){return {
    setup: function (context){
        var limit = [0 , 100 ];
        this.w = wp.makeWanderer([limit, limit]);
        context.fillStyle = "rgb(165,255,255)";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    },
    draw: function (context, borders){
        this.w.move();
        var x = this.w.coordinates[0];
        var y = Math.round(this.w.coordinates[1]);
        context.fillStyle = "rgb(255,190,25)";
        //context.fillRect(x, y, 150, 150);
        const y2 = 75;
        const rec1 = idu.rectangle(0, 0, 150,y2);
        const rec2 = idu.rectangle(0, y2, 150, 150 - y2);
        const rec3 = idu.rectangle(x, y, 50, 50 );

                      // closure that binds the arguments context and borders
       const push = function(rec, horiz, speed, filter){
                  idu.pushLine(context, borders, rec, horiz, speed, filter);
              };

              // aliases to make arguments more readable
        const horizontal = y>75;
        const speed = x>75? 1 : -1; 
        
        push(rec1,  true, 1);
        push(rec2,  true, -1);
        push(rec3,  false, speed);

    }
};});
