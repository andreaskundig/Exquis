define(["bibs/automaton", "bibs/stepper"], function(automaton, stepper){
    var aut; 
    var stp = stepper();
    return {
        setup: function(context){
            aut = automaton(75, context);
        },
/*
                    var ints = aut.colorIntensity(color);
                    extremeIntensity = extremeIntensity || color;
                    if(nextAlive){
                        if( ints < extremeIntensity){
                            extremeIntensity = ints;
                            nextColor = color;
                        }
                    }else{
                        if(ints > extremeIntensity){
                            extremeIntensity = ints;
                            nextColor = color;
                        }
                    }
                    var ints = aut.colorIntensity(color);
                    if(!minIntensity ||!maxIntensity){
                        minColor = color;
                        minIntensity = ints;
                        maxIntensity = ints;
                    }
                    if(ints < minIntensity){
                        minIntensity = ints;
                        minColor = color;
                    }
                    if(ints > maxIntensity){
                        maxIntensity = ints;
                        maxColor = color;
                    }
*/
        colorGameOfLife: function(neighborColors){
            var nextBlackOrWhiteCol = aut.gameOfLife(neighborColors); 
            var nextAlive = aut.isColorAlive(nextBlackOrWhiteCol);
            var maxIntensity, minIntensity, maxColor, minColor;
            neighborColors.forEach(function(rowArray, row){
                rowArray.forEach(function(color, col){
                    var ints = aut.colorIntensity(color);
                    if(!maxIntensity || ints > maxIntensity){
                        maxIntensity = ints;
                        maxColor = color;
                    }
                    if(!minIntensity || ints < minIntensity){
                        minIntensity = ints;
                        minColor = color;
                    }
                });
            });
            return nextAlive? minColor : maxColor;
        },
        draw: function(context, borders){
            if(stp.wantsPause()){
                return;
            }
            context.fillStyle = "rgba(255, 255, 255, 1)";
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
            aut.drawNext(borders, this.colorGameOfLife);
        }

    };

});
