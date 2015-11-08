define(["bibs/wanderingPoint"], function(wp){ return {
        setup: function (context){
            var limit = [0 , 255 ];
            var limits = [limit, limit, limit];
            var direction = [8, 5, 1];
            var startPoint = [Math.round(255*Math.random()), 
                              Math.round(255*Math.random()),
                              Math.round(255*Math.random())];
            var speed = 3  ;
            this.w = wp.makeWanderer(limits, direction, startPoint, speed);
        },
        draw: function (context, borders){
            this.w.move();
            var red = Math.round(this.w.coordinates[0]);
            var green = Math.round(this.w.coordinates[1]);
            var blue = Math.round(this.w.coordinates[2]);
            context.fillStyle = "rgb("+ red +","+ green +","+blue +")";
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        }
    }
});
