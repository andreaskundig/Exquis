define(["bibs/imageDataUtils", "bibs/shapes"],
function(idu, shapes){
  const drawText = function(context, value, x, y, w, h){
        x = x || 0;
        y = y || 0;
        w = w || 50;
        h = h || 20;
        context.fillStyle = 'khaki';
        context.fillRect(x, y, w, h);
        context.font = "12px Arial";
        context.fillStyle = 'black';
        context.fillText(value, x + 15, y + 15);
  };
  return {
      setup: function (context){
          this.start = Date.now();
      },
      draw: function (context, borders){
          var now = Date.now();
          let fps = 0;
          if(this.lastTime){
              var elapsed = now - this.lastTime;
              fps = Math.round(10000 / elapsed)/10;
              if(Date.now() - this.start > 200){
                 this.start = Date.now();
                  drawText(context, fps, 20, 20 );
              }
                    
          }
          this.lastTime = now;
          
          
          let height = 60;
          let width = 80;
          let maxFps = 120;
          let graphY = 50;
          let graphX = 30;
          context.fillStyle = 'white';

          context.fillRect(graphX + width, graphY ,1,height);
          context.fillStyle = 'black'
          let fpsY = (maxFps - fps) * height / maxFps;
          context.fillRect(graphX + width , graphY +  fpsY,1,1);

          var middleLeft = idu.rectangle(graphX, graphY, width, height) ,
              // closure that binds the arguments context and borders
              push = function(rec, horiz, speed, filter){
                  idu.pushLine(context, borders, rec, horiz, speed);
              },

              // aliases to make arguments more readable
              horizontal = true,
              vertical = false;

          push(middleLeft,  horizontal, -1);
      }
  };
});
