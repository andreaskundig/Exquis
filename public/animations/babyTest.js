define(["bibs/babyExquis", "bibs/stepper"], function(babyExquis, stepper){
    return {
        setup: function(context){
            this.ex = babyExquis.create(context, 3, 5);
        
            this.babyDraw =  function(context, borders, x, y){
                var border;
                for(var i = 0; i< 5; i++){
                    border = borders[ x % 2 == 0 ? "south" : "north"];
                    context.putImageData(border, 0, i);
                    context.putImageData(border, 0, 
                                         this.ex.height - i - 1);
                }

                for(var j = 0; j< 5; j++){
                    border = borders[ y % 2 == 0 ? "west" : "east"];
                    context.putImageData(border, j, 0);
                    context.putImageData(border, this.ex.width - j - 1, 0);
                }
            }.bind(this);

            this.stp = stepper();
        },
        draw: function(context, borders){
            if(this.stp.wantsPause()){
                return;
            }
            babyExquis.doDraw(context, this.ex, borders, this.babyDraw);
        }

    };

});
