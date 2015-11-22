define(["bibs/imageDataUtils"],function(idu){
    var borderSquares = function(imageData, noSquares){
        var result = [],
            squareSize = Math.floor(imageData.data.length / noSquares / 4) * 4;
        for(var i=0; i < noSquares ; i++){
            var start = i * squareSize,
                end = start + squareSize,
                color = idu.averageColor(imageData, start, end);
            result.push(color);
        }
        return result;
    };

    var populateBorders = function(cells, borders, noSquares){
        var north = borderSquares(borders.north, noSquares),
            east = borderSquares(borders.east, noSquares),
            south = borderSquares(borders.south, noSquares),
            west = borderSquares(borders.west, noSquares);
        cells[0] = north;
        cells[noSquares-1] = south;
        for(var i=0; i < noSquares; i++){
            var row = cells[i];
            row[0] = west[i];
            row[noSquares-1]= east[i];
        }
    };

    var intensity = function(color){
        var sumOfSq = 0;
        for(var i=0; i<3; i++){
                sumOfSq += Math.pow(color[i], 2);
        }
        return Math.sqrt(sumOfSq);
    };

    var isAlive = function(color){
        var halfOfMax = Math.sqrt(3 * Math.pow(255,2)) / 2; 
        return intensity(color) < halfOfMax;
    };

    var neighbors = function(position){
        var neigh = [];
        for(var i = -1; i < 2; i++){
            for(var j = -1; j < 2; j++){
                if(j != 0 || i!=0){
                    neigh.push([position[0] + i,
                                position[1] + j]);
                }
            } 
        }
        return neigh;
    };

    var evolveCell = function(cells, position){
        // Any live cell with fewer than two live neighbours dies
        // Any live cell with two or three live neighbours lives
        // Any live cell with more than three live neighbours dies
        // Any dead cell with exactly three live neighbours becomes alive
        var initialColor = cells[position[0]][position[1]];
        var wasAlive = isAlive(initialColor);
        var maxIntensity, minIntensity, maxColor, minColor;
        var aliveNeigh = neighbors(position).filter(function(neighPos){
            var color = cells[neighPos[0]][neighPos[1]];
            // if(position[0] <2 && position[1]<2){
            //     console.log(position, neighPos, color, isAlive(color));
            // }
            var ints = intensity(color);
            if(!maxIntensity || ints > maxIntensity){
                maxIntensity = ints;
                maxColor = color;
            }
            if(!minIntensity || ints < minIntensity){
                minIntensity = ints;
                minColor = color;
            }
            return isAlive(color);
        }).length;
        var nowAlive = aliveNeigh == 3;
        if(wasAlive){
            nowAlive = nowAlive || aliveNeigh == 2 ;
        }
        //TODO return darkest or lightest
        return nowAlive? minColor : maxColor;
    };

    var createEmptyCells =  function(numberOfSquares){
        var cells = [],
            dead = [130,130,130,1];
        
        for(var i=0; i < numberOfSquares ; i++){
            cells[i] = [];
            for(var j=0; j < numberOfSquares ; j++){
                cells[i][j] = dead.slice();
            }
        }
        return cells;
    };

    var evolveCells = function(oldCells, borders){
        var newCells = [],
            rows = oldCells.length,
            cols = oldCells[0].length;
        for(var i=1; i < rows - 1 ; i++){
            newCells[i] = [];
            for(var j=1; j < cols - 1 ; j++){
                newCells[i][j] = evolveCell(oldCells, [i,j]);
            }
        }
        populateBorders(newCells, borders, rows);
        return newCells;
    };

    return function(numberOfSquares, context){
        return {cells:  createEmptyCells(numberOfSquares),
                squareSize: context.canvas.width / numberOfSquares,
                evolve: function(borders){
                    this.cells = evolveCells(this.cells, borders);
                }};
    };
});
