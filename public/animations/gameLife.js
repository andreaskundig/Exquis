define(["bibs/gameOfLife"], function(gameLife){
    return {setup: function(context){
                var width = context.canvas.width / 2;
                var height = context.canvas.height / 2;
                //var gameLife = lib.gameLife; 
                //var start = glider_1.concat(glider_2, glider_3, glider_4, glider_5)
                var start = gameLife.makeGliderNoise(width/3, height/3, 20);
                //console.log(start)
                this.evolve = gameLife.generateEvolver(width, height, start);

                this.cells = [];
            },
            draw: function(context, borders){
                // paste current image one pixel down

                // east

                context.fillStyle = "rgba(255, 255, 255, 0.1)";
                context.fillRect(0, 0, context.canvas.width, context.canvas.height);

                this.cells = this.evolve();


                context.fillStyle = "rgb(0, 0, 0)";

                var scale = 6;
                this.cells.forEach(function(cell){
                    context.fillRect(cell.x *scale, cell.y *scale, scale, scale);

                });
            }
           };
});
