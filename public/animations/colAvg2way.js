define(["bibs/imageDataUtils", "bibs/shapes"], 
function(idu, shapes){
    var colSqDistance = function(c1, c2){
        if(!c1 || !c2){ return 0;}
        var d = c1.map(function(e,i){
            return Math.pow(c2[i]-c1[i],2);
        });
        return d[0]+d[1]+d[2];
    },
    pushValueInQueue = function(value, queue, size){
        size = size || 5;
        queue.push(value);
        while(queue.length > size){
            queue.shift();
        }
    },
   lastAvgCol = {},
   lastDists = {north:[], east:[], south:[], west:[]},

   directions ={north:{horizontal:false, speedSign:1},
       east:{horizontal:true, speedSign:-1},
       south:{horizontal:false, speedSign:-1},
       west:{horizontal:true, speedSign:1}
   },
    rect = idu.rectangle(0, 0, 150, 150);

  return {
      setup: function(){},
      draw: function (context, borders){
          //console.log(Math.sqrt(colSqDistance([255,255,255],[0,0,0])));
          var currentAvgCol = {},
          // [[dist, cardi],...]
              distAndCardi = [];
          Object.keys(directions).forEach(function(cardi){
              var current = idu.averageColor(borders[cardi]),
                  last = lastAvgCol[cardi],
                  dist = colSqDistance(last,current);
            // store latest distance by cardinal point  
            pushValueInQueue(dist, lastDists[cardi]);
            currentAvgCol[cardi] = current;
            var distsSum = lastDists[cardi].reduce(function(acc,val){
                return acc + val;},0);
            distAndCardi.push([distsSum, cardi]);
          });
          lastAvgCol = currentAvgCol;
          var biggestDistAndCardi = distAndCardi.sort().reverse()[0];
          var biggestDist = Math.sqrt(biggestDistAndCardi[0]);
          var speedAmpl = 1;//biggestDist / 147 + 1;
          //console.log(biggestDist);
          var biggestCardi = biggestDistAndCardi[1];
          var direction = directions[biggestCardi];
          if(lastDists.north.length>3){
          Object.keys(directions).filter(function(c){
              
              if(['east','west'].indexOf(c)==-1){console.log(c);}
              return directions[c].horizontal !== direction.horizontal;
          }).forEach(function(c){
              delete directions[c];
          })}
          
          

              // closure that binds the arguments context, borders, filter
              pushAvg = function(rec, horiz, speed){
 //                 idu.pushLine(context, borders, rec, horiz, speed, 
 //                 idu.avgColorFilter);
                  idu.pushLine(context, borders, rec, horiz, speed);
              },

          pushAvg(rect, direction.horizontal, direction.speedSign * speedAmpl);
      }
  };
});