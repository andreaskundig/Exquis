define(["bibs/imageDataUtils", "bibs/shapes"], 
function(idu, shapes){
  return {
      setup: function (context){
          this.side = 150;
          this.depth = 112;
          this.breadth = this.side - this.depth;
          this.speed = 3;
      },
      draw: function (context, borders){
          var now = Date.now();
          let fps = 0;
          if(this.lastTime){
              var elapsed = now - this.lastTime;
              fps = Math.round(10000 / elapsed)/10;
                      context.fillStyle = 'white';
                      context.fillRect(0,0,150,50);
                      context.font = "12px Arial";
                      context.fillStyle = 'black'
                      context.fillText(fps,50,20);

              //context.
          }
          this.lastTime = now;
          
          
          let height = 80;
          let maxFps = 120;
          let graphY = 50;
          context.fillStyle = 'white';

          context.fillRect(29, graphY ,1,height);

          context.fillStyle = 'black'
          
          let fpsY = (maxFps - fps) * height / maxFps;
          context.fillRect(29, graphY +  fpsY,1,1);

          var middleLeft = idu.rectangle(30, graphY, 80, height) ,
              // closure that binds the arguments context and borders
              push = function(rec, horiz, speed, filter){
                  idu.pushLine(context, borders, rec, horiz, speed);
              },

              // aliases to make arguments more readable
              horizontal = true,
              vertical = false;

          push(middleLeft,  horizontal, 1);
      }
  };
});
