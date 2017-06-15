define(["bibs/imageDataUtils", "bibs/shapes"], 
function(idu, shapes){
    var colSqDistance = function(c1, c2){
        if(!c1 || !c2){ return 0;}
        var d = c1.map(function(e,i){
            return [Math.pow(c2[i]-c1[i],2)];
        });
        return d[0]+d[1]+d[2];
    },
   lastAvgCol = {},
   directions ={north:{horizontal:false, speedSign:1},
       east:{horizontal:true, speedSign:-1},
       south:{horizontal:false, speedSign:-1},
       west:{horizontal:true, speedSign:1}
   },
    rect = idu.rectangle(0, 0, 150, 150);

  return {
      setup: function(){},
      draw: function (context, borders){
          var currentAvgCol = {},
              distAndCardi = [];
          Object.keys(borders).forEach(function(cardi){
              var current = idu.averageColor(borders[cardi]),
                  last = lastAvgCol[cardi];
            currentAvgCol[cardi] = current;
            distAndCardi.push([colSqDistance(last,current), cardi]);
          });
          lastAvgCol = currentAvgCol;
          
          var biggestCardi = distAndCardi.sort().reverse()[0][1];
          var direction = directions[biggestCardi];

              // closure that binds the arguments context, borders, filter
              pushAvg = function(rec, horiz, speed){
                  idu.pushLine(context, borders, rec, horiz, speed, 
                               idu.avgColorFilter);
              },

              // aliases to make arguments more readable
              horizontal = true,
              vertical = false;

          pushAvg(rect, direction.horizontal, direction.speedSign * 3);
      }
  };
});