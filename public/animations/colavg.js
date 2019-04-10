define(["bibs/imageDataUtils", "bibs/shapes"], 
function(idu, shapes){
    var pushValueInQueue = function(value, queue, size){
        size = size || 20;
        queue.push(value);
        while(queue.length > size){
            queue.shift();
        }
    },
   lastAvgCol = {north:null, east:null, south:null, west:null},
   lastDists = {north:[], east:[], south:[], west:[]},

   directions = {
       north:{horizontal:false, speedSign:1},
       east:{horizontal:true, speedSign:-1},
       south:{horizontal:false, speedSign:-1},
       west:{horizontal:true, speedSign:1}
   },
   rect;

  return {
      setup: function(context){
         rect = idu.rectangle(0, 0, context.canvas.width, context.canvas.height);
      },
      draw: function (context, borders){
          var currentAvgCol = {},
              distAndCardi = [];
          Object.keys(borders).forEach(function(cardi){
              var current = idu.averageColor(borders[cardi]),
                  last = lastAvgCol[cardi],
                  dist = Math.pow(idu.colorDistance(last,current),2);

            pushValueInQueue(dist, lastDists[cardi]);
            currentAvgCol[cardi] = current;
            var distsSum = lastDists[cardi].reduce(function(acc,val){
                return acc + val;},0);
            distAndCardi.push([distsSum, cardi]);
          });
          lastAvgCol = currentAvgCol;
          var sortedDistAndCardi = distAndCardi.sort().reverse();

              // closure that binds the arguments context, borders, filter
          var pushAvg = function(rec, horiz, speed){
                  idu.pushLine(context, borders, rec, horiz, speed);
          };
          sortedDistAndCardi.slice(0,2).forEach(function(dc,i){
              var biggestCardi = dc[1],
                  biggestDist = dc[0],
                  speed = Math.max(1,Math.min(148, biggestDist / 600)),
                  direction = directions[biggestCardi];
                  
                  //if(speed>2){console.log(speed);}
              pushAvg(rect, direction.horizontal, direction.speedSign * speed);
              //shapes.drawLabel(context,biggestDist,{x:10, y:20+i*50,
             //                                        width:60})

          });
      }
  };
});
