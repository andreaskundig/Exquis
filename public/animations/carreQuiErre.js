define(["bibs/wanderingPoint"], function(wp){return {
    setup: function (context){
        var limit = [-context.canvas.width - 5 , context.canvas.width + 5 ];
        this.w = wp.makeWanderer([limit, limit]);
    },
    draw: function (context, borders){
        context.fillStyle = "rgb(165,255,255)";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        this.w.move();
        var x = this.w.coordinates[0];
        var y = this.w.coordinates[1];
        context.fillStyle = "rgb(255,190,255)";
        context.fillRect(x, y, context.canvas.width, context.canvas.height);
        
    }
};});
