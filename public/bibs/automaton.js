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

    var neighborCells = function(position, cells){
        var square = [];
        for(var i = 0; i < 3; i++){
            var cellsRow = cells[position[0] + i - 1];
            square[i] = square[i] || [];
            for(var j = 0; j < 3; j++){
                var cell = cellsRow[position[1] + j - 1];
                square[i][j] = cell;
            } 
        }
        return square;
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

    var evolveCells = function(oldCells, borders, evolveCell){
        var newCells = [],
            rows = oldCells.length,
            cols = oldCells[0].length;
        for(var i=1; i < rows - 1 ; i++){
            newCells[i] = [];
            for(var j=1; j < cols - 1 ; j++){
                var neighborColors = neighborCells([i,j], oldCells);
                newCells[i][j] = evolveCell(neighborColors);
            }
        }
        populateBorders(newCells, borders, rows);
        return newCells;
    };

    var displayColor = function(color, x, y, size, ctx){
        var rgb = "rgb("+color[0]+","+color[1]+","+color[2]+")";
        ctx.fillStyle = rgb;
        ctx.fillRect(x * size, y * size, size, size);
    };

    var forEachCell = function(cells, offset, callBack){
        for(var y = offset; y < cells.length - offset ; y++){
            for(var x = offset; x < cells.length - offset; x++){
                callBack(cells[y][x], x - offset, y - offset);
            }
        }
    };

    var gameOfLife = function(neighborColors){
        var black = [0,0,0,255];
        var white = [255,255,255,255];
        var initialColor = neighborColors[1][1];
        
        var aliveNeighbors = 0;
        neighborColors.forEach(function(rowArray, row){
            rowArray.forEach(function(color, col){
                if(row !== 1 || col !== 1){
                    aliveNeighbors += isColorAlive(color) ? 1: 0;
                }
            });
        });

        // Any dead cell with exactly three live neighbours becomes alive
        // Any live cell with two or three live neighbours lives
        // Any live cell with fewer than two live neighbours dies
        // Any live cell with more than three live neighbours dies
        var nowAlive = aliveNeighbors == 3;
        var wasAlive = isColorAlive(initialColor);
        if(wasAlive){
            nowAlive = nowAlive || aliveNeighbors == 2 ;
        }

        return nowAlive ? black : white;
    };
    
    var colorIntensity = function(color){
        var sumOfSq = 0;
        for(var i=0; i<3; i++){
                sumOfSq += Math.pow(color[i], 2);
        }
        return Math.sqrt(sumOfSq);
    };

    var isColorAlive = function(color){
        var halfOfMax = Math.sqrt(3 * Math.pow(255,2)) / 2; 
        return colorIntensity(color) < halfOfMax;
    };

    return function(numberOfSquares, context, copyBorders){
        var offset = copyBorders ? 0 : 1;
        var sqSize = context.canvas.width / numberOfSquares;
        var cells =  createEmptyCells(numberOfSquares + offset * 2);
        return {gameOfLife: gameOfLife,
                isColorAlive: isColorAlive,
                colorIntensity: colorIntensity,
                drawNext: function(borders, evolveCell){
                    cells = evolveCells(cells, borders, evolveCell);
                    forEachCell(cells, offset, function(color, x, y){
                        displayColor(color, x, y, sqSize, context);
                    });
                }};
    };
});
