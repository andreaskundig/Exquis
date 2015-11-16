define(["bibs/gameOfLifeWithBorders", "bibs/stepper"], function(gol, stepper){
    return {
        setup: function(context){
            this.life = gol.create();
            this.life.init(50, 150);
            stepper.init();
        },
        draw: function(context, borders){
            if(stepper.wantsPause()){
                return;
            }
            context.fillStyle = "rgba(255, 255, 255, 1)";
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
            this.life.evolve(borders);
            //console.log(life.attr.cells);
            var max = this.life.attr.cells.length - 1 ;
            var life = this.life;
            this.life.attr.cells.forEach(function(row,x){
                if(x==0||x==max){ return;}
                row.forEach(function(color,y){
                    if(y==0||y==max){ return;}
                    var rgb = "rgb("+color[0]+","+color[1]+","+color[2]+")";
                    context.fillStyle = rgb;
                    var s = life.attr.squareSize;
                    context.fillRect((x-1)*s, (y-1)*s, s, s);
                });
            });
        }

    };

});
