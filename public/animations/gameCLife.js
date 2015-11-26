define(["bibs/gameOfLifeWithBorders", "bibs/stepper"], function(gameOfLife, stepper){
    return {
        setup: function(context){
            //var noSquares = 25;
            var noSquares = 27;
            this.life = gameOfLife(noSquares, context);
            //this.squareSize = this.life.squareSize;
            this.squareSize = 150 / (noSquares-2);
            this.stp = stepper();
            this.counter = 0;
        },
        draw: function(context, borders){
            if(this.stp.wantsPause() ||this.counter++ % 2 != 0){
                return;
            }
            context.fillStyle = "rgba(255, 255, 255, 1)";
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
            this.life.evolve(borders);
            var cells = this.life.cells;
            var rows = cells.length;
            //for(var y = 0; y < rows; y++){
            for(var y = 1; y < rows-1; y++){
                var row = cells[y] ;
                //for (var x = 0; x< row.length; x++){
                for (var x = 1; x< row.length -1; x++){
                    var color = row[x] ,
                        rgb = "rgb("+color[0]+","+color[1]+","+color[2]+")";
                    context.fillStyle = rgb;
                    var s = this.squareSize;
                    //context.fillRect((x)*s, (y)*s, s, s);
                    context.fillRect((x-1)*s, (y-1)*s, s, s);
                }
            }
        }

    };

});
