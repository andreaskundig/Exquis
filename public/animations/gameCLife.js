define(["bibs/automaton", "bibs/stepper"], function(automaton, stepper){
    var aut; 
    var stp = stepper();
    return {
        setup: function(context){
            aut = automaton(75, context);
        },
        colorGameOfLife: function(neighborColors){
            var nextBlackOrWhiteCol = aut.gameOfLife(neighborColors); 
            var nextAlive = aut.isColorAlive(nextBlackOrWhiteCol);
            var extremeIntensity, extremeColor;
            neighborColors.forEach(function(rowArray, row){
                rowArray.forEach(function(color, col){
                    var intensity = aut.colorIntensity(color);
                    var isExtreme = !extremeIntensity;
                    if(nextAlive){
                        isExtreme = isExtreme || intensity < extremeIntensity;
                    }else{
                        isExtreme = isExtreme || intensity > extremeIntensity;
                    }
                    if(isExtreme){
                        extremeIntensity = intensity;
                        extremeColor = color;
                    }
                });
            });
            return extremeColor;
        },
        draw: function(context, borders){
            if(stp.wantsPause()){
                return;
            }
            context.fillStyle = "rgba(255, 255, 255, 1)";
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
            //aut.drawNext(borders, aut.gameOfLife);
            aut.drawNext(borders, this.colorGameOfLife);
        }

    };

});
