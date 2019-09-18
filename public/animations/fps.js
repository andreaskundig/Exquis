define(["bibs/imageDataUtils", "bibs/shapes"],
function(idu, shapes){
  return {
      setup: function({context}){
          this.start = Date.now();
      },
      draw: function({context, borders}){
          var now = Date.now();
          let fps = 0;
          if(this.lastTime){
              var elapsed = now - this.lastTime;
              fps = Math.round(10000 / elapsed)/10;
              if(Date.now() - this.start > 200){
                 this.start = Date.now();
                  shapes.drawLabel(context, fps, { x: 20, y: 20} );
              }
                    
          }
          this.lastTime = now;
          
          let opts = {
              height: 60,
              width: 80,
              maxValue: 120,
              x: 30,
              y: 50
          };
          idu.drawGraph(context, fps, opts);
      }
  };
});
