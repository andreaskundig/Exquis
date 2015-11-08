define({
    generateEvolver : function(width, height, startLivingPositions){
        var computeNeighborPositions = function(position){
            var neighbours = [];
            for(var i = -1; i < 2; i++){
                for(var j = -1; j < 2; j++){
                    neighbours.push({x: position.x + i,
                                     y: position.y + j});
                } 
            } 
        };

        var isEqualPosition = function(a, b){
            return a.x === b.x && a.y === b.y;
        };

        var contains = function(collection, position){
            var size = collection.length;

            for(var i = 0; i < size; i++){
                if (isEqualPosition(collection[i], position)){
                    return  true;
                }
            }
            return false;
        };

        var partitionNeighbors = function(neighborPositions, livingCellsColl){
            var living = [],
                dead = [];

            neighborPositions.forEach(function(neighborPosition){
                if (contains(livingCellsColl, neighborPosition)){
                    living.push(neighborPosition);
                }else{
                    dead.push(neighborPosition);
                }
            });

            return {
                living: living,
                dead: dead
            };
        };

        var isOutside = function(position){
            return position.x < 0 || position.x > width ||
                position.y < 0 || position.y > height;
        };
        
        var livingCells;

        // startLivingPositions is array of {x, y}
        if (startLivingPositions == undefined){
            livingCells = [];
        }else{
            livingCells = startLivingPositions;
        }

        return function(livingOutside){
            /*        
             Any live cell with fewer than two live neighbours dies
             Any live cell with two or three live neighbours lives
             Any live cell with more than three live neighbours dies
             Any dead cell with exactly three live neighbours becomes alive
             */
            var allTheLiving = livingCells.concat(livingOutside); 
            livingCells = livingOutside.reduce(function(result, cell){
                var neighborPos = computeNeighborPositions(cell),
                    partits = partitionNeighbors(neighborPos, livingCells),
                    livingCount = partits.living.length;
                if(livingCount == 2 || livingCount == 3){
                    if(!isOutside(cell)){
                        result.push(cell);
                    }
                }

                partits.dead.forEach(function(cell){
                    var neighborPos = computeNeighborPositions(cell),
                        partits = partitionNeighbors(neighborPos, livingCells),
                        livingCount = partits.living.length;
                    if (livingCount == 3 && !contains(result, cell)){
                        if(!isOutside(cell)){
                            result.push(cell);
                        }
                    }
                });

                return result;
            }, []);

            
            return livingCells;
        };
    },

    makeGlider: function(center_x, center_y){
        return [{x:center_x, y:center_y - 1}, 
                {x:center_x + 1, y:center_y}, 
                {x:center_x - 1, y:center_y + 1}, 
                {x:center_x, y:center_y + 1}, 
                {x:center_x + 1, y:center_y + 1}];
    },

    makeNoise: function(width, height, count){
        var result = [];

        for (var i = 0; i < count; i++) {
            result.push({
                x: Math.floor(Math.random() * width), 
                y: Math.floor(Math.random() * height)});
        }

        return result;
    },

    makeGliderNoise: function(width, height, count){
        var result = [];

        for (var i = 0; i < count; i++) {
            result = result.concat(this.makeGlider(Math.floor(Math.random() * width - 1), 
                                                   Math.floor(Math.random() * height - 1)));
        }

        return result;
    }
}
      );
