define(function(){
    var norm = function(vector){
        var sumOfSquares = 0;
        vector.forEach(function(el){ sumOfSquares += el * el; });
        return Math.sqrt(sumOfSquares);
    };

    var normalize = function(vector){
        var length = norm(vector);
        return vector.map(function(el){ return el / length; });
    };

    var movePoint = function(startPoint, direction, speed, fractionToTravel){
        return startPoint.map(function(coord, index){
            return coord + direction[index] * speed * fractionToTravel ;
        });
    };

    var measureCompletion = function(startPoint, nextPointUnconstrained, limits)
    {
        var possibleImpacts = nextPointUnconstrained.map(
            function(coord,dimension){
                var newCoord = coord;
                if(coord < limits[dimension][0]){
                    newCoord = limits[dimension][0];
                }else if(coord > limits[dimension][1]){
                    newCoord = limits[dimension][1];
                }
                var toTravel = coord - startPoint[dimension];
                var travelled = newCoord - startPoint[dimension];
                var fraction = toTravel != 0 ? travelled / toTravel : 1;
            return [fraction, dimension];
        });
        var closestPossibleImpact = possibleImpacts.sort()[0];
        return {percentage: closestPossibleImpact[0],
                limitingDimension: closestPossibleImpact[1] };
    };

    var next = function(limits, direction, startPoint, speed){
        var totalTravelledPercentage = 0;
        var nextPoint = null;
        direction = direction.slice();

        while (totalTravelledPercentage < 0.999999){
            if(nextPoint){
                // we've been through the loop once
                // so we must have hit a wall that stopped us
                // from having totalTravelledPercentage == 1
                direction[completion.limitingDimension] *= -1;
                startPoint = nextPoint;
            }
            var remainingDist = 1 - totalTravelledPercentage;
            var nextUnconstrained = movePoint(startPoint, direction, speed,
                                              remainingDist);
            var completion = measureCompletion(startPoint, nextUnconstrained, 
                                               limits);
            var additionalDist = remainingDist * completion.percentage;
            nextPoint = movePoint(startPoint, direction, speed, additionalDist);
            totalTravelledPercentage += additionalDist;
        };

        return {point: nextPoint, direction: direction};
    };

    var makeWanderer = function(limits, direction, startPoint, speed){
        //defaults
        if(!limits){
            var limit = [0,150]; 
            limits = [limit, limit];
        }else{
            limits = limits.map(l => l.sort());
        }
        if(!direction){
            direction = limits.map(function(l,index){
                return index * 2 + 1;
            });
        }
        if(!startPoint){
            startPoint = limits.map(function(limit,i){ 
                return (limit[0] + limit[1]) / 2; 
            });
        }
        if(speed !==0 && !speed){
            speed = 1;
        }

        return {
            coordinates: startPoint,
            limits: limits,
            direction: direction,
            speed: speed,
            move: function(){
                var nextState = next(this.limits, normalize(this.direction),
                                     this.coordinates, this.speed);
                this.coordinates = nextState.point;
                this.direction = nextState.direction;
            }
        };
    };

    return {_norm: norm,
            _normalize: normalize,
            _next: next,
            makeWanderer: makeWanderer
           };
});
