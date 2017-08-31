define(["bibs/imageDataUtils", "bibs/shapes"], 
function(idu, shapes){
  return {
      setup: function (context){
          this.side = 150;
          this.depth = 112;
          this.breadth = this.side - this.depth;
          this.speed = 3;
          this.lastTime
      },
      draw: function (context, borders){
          var middleLeft = idu.rectangle(this.breadth, this.breadth,
                                         this.side/2 - this.breadth, 
                                         this.side - 2 * this.breadth) ,
              // closure that binds the arguments context and borders
              push = function(rec, horiz, speed, filter){
                  idu.pushLine(context, borders, rec, horiz, speed, filter);
              },

              // aliases to make arguments more readable
              horizontal = true,
              vertical = false;

          push(middleLeft,  horizontal, this.speed - 2,  idu.avgColorFilter);
      }
  };
});
