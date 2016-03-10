define(["bibs/canvasBuffer", 
        "/animations/carreQuiTourne.js", 
        "/animations/copieBordOuest.js"], 
function(canvasBuffer, anim1, anim2){
    return {
        setup: function (context){
            anim1.setup(context);
            this.buffer = canvasBuffer(context.canvas.width,
                                                  context.canvas.height);
            anim2.setup(this.buffer.context);

        },
        draw: function (context, borders){
            anim1.draw(context, borders);
            anim2.draw(this.buffer.context, borders);

            this.buffer.setTransparency(122);
            this.buffer.copyFromBuffer(context);
        }
    };
});
