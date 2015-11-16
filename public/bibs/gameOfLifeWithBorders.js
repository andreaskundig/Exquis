define(["bibs/imageDataUtils"],function(idu){
    var makeGOL = function(){
    var borderSquares = function( imageData){
        var dead = [255,255,126,1],
            result = [];
        result[0] = dead.slice();
        result[attr.numberOfSquares+1] = dead.slice();
        for(var i=0; i < attr.numberOfSquares ; i++){
            var s = attr.squareSize * 4;
            var color = idu.averageColor(imageData, i*s, (i+1)*s);
            result[i+1] = color;
        }
        return result;
    };
    
    var populateBorders = function(cells, squareSize, borders){
        var dead = [255,255,255,1],
            north = borderSquares(borders.north),
            east = borderSquares(borders.east),
            south = borderSquares(borders.south),
            west = borderSquares(borders.west);
        cells[0] = north;
        cells[attr.numberOfSquares+1] = south;
        for(var i=0; i < attr.numberOfSquares; i++){
            var row = cells[i+1];
            row[0] = west[i+1];
            row[attr.numberOfSquares+1]= east[i+1];
        }
    };

    var attr = {cells:[], squareSize:0, numberOfSquares:0};
    var init = function(numberOfSquares, totalSize){
        attr.numberOfSquares = numberOfSquares;
        attr.squareSize = Math.floor(totalSize/numberOfSquares);
        var dead = [255,255,255,1];
        for(var i=0; i < numberOfSquares + 2; i++){
            attr.cells[i] = [];
            for(var j=0; j < numberOfSquares + 2; j++){
                attr.cells[i][j] = dead.slice();
            }
        }
    };

    var isAlive = function(color){
        var halfOfMax = Math.sqrt(3 * Math.pow(255,2)) / 2; 
        var sumOfSq = 0;
        for(var i=0; i<3; i++){
            sumOfSq += Math.pow(color[i], 2);
        }
        return Math.sqrt(sumOfSq) < halfOfMax;
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

    var evolve = function(borders){
        var newCells = [];
        for(var i=0; i < attr.numberOfSquares ; i++){
            newCells[i+1] = [];
            for(var j=0; j < attr.numberOfSquares; j++){
                // if(i+1 <2 && j+1<2){
                //     console.log("new", i+1,j+1);
                // }
                newCells[i+1][j+1] = evolveCell(attr.cells, [i+1,j+1]);
            }
        }
        populateBorders(newCells, attr.squareSize, borders);
        attr.cells = newCells;
    };

    var evolveCell = function(cells, position){
        // Any live cell with fewer than two live neighbours dies
        // Any live cell with two or three live neighbours lives
        // Any live cell with more than three live neighbours dies
        // Any dead cell with exactly three live neighbours becomes alive
        var initialColor = cells[position[0]][position[1]];
        var wasAlive = isAlive(initialColor);
        var aliveNeigh = neighbors(position).filter(function(neighPos){
            var color = cells[neighPos[0]][neighPos[1]];
            // if(position[0] <2 && position[1]<2){
            //     console.log(position, neighPos, color, isAlive(color));
            // }
            return isAlive(color);
        }).length;
        var nowAlive = aliveNeigh == 3;
        if(wasAlive){
            nowAlive = nowAlive || aliveNeigh == 2 ;
        }
        //TODO return darkest or lightest
        return nowAlive? [0,0,12,1] : [255,255,126,1];
    };

    
    return {init: init, 
            evolve: evolve, 
            attr: attr};
    };
    return {create: makeGOL};
});
