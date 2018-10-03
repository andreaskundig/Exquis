define(["bibs/canvasBuffer",
        "/animations/carreQuiTourne.js", 
        "/animations/carreQuiTourneSansFond.js",
        "/animations/carreSinus.js"], 
function(canvasBuffer, anim1, anim2, anim3){
    return {
        setup: function (context, animationState){
            anim1.setup(context, animationState);
            const w = context.canvas.width;
            const h = context.canvas.height;
      
            
            this.l2 = canvasBuffer.bufferAnim(anim2, w, h);
            this.l3 = canvasBuffer.bufferAnim(anim3, w, h);

        },
        draw: function (context, borders, animationState){
            anim1.draw(context, borders, animationState);
            this.l2.draw(borders);
            this.l2.pasteInto(context,'destination-in');
            
            this.l3.draw(borders);
            this.l3.setTransparency(205);
            this.l2.pasteInto(this.l3.context,'destination-out');
            this.l3.pasteInto(context);
        }
    };
});
