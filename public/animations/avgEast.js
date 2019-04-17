define(["bibs/imageDataUtils"], 
function(idu){
  return {
      draw: function (context, borders){
          var rec = idu.rectangle(0, 0, context.canvas.width, context.canvas.height) ;
          idu.pushLine(context, borders, rec, true, -5, idu.avgColorFilter);
      },
      setup: function (context){
      }
  };
});
