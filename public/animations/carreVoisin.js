define(["bibs/canvasBuffer",
        "/animations/carreQuiTourne.js", 
        "/animations/carreQuiTourneSansFond.js",
        "/animations/carreSinus.js"], 
function(canvasBuffer, anim1, anim2, anim3){
    var makeLayer = (anim, width, height) => {
        var buffer = canvasBuffer(width, height);
        anim.setup(buffer.context);
        return {draw: borders => anim.draw(buffer.context, borders),
                context: buffer.context,
                pasteInto: buffer.pasteInto};
    };
    return {
        setup: function (context){
            anim1.setup(context);
            const w = context.canvas.width;
            const h = context.canvas.height;
            
            this.l2 = makeLayer(anim2, w, h);
            this.l3 = makeLayer(anim3, w, h);

        },
        draw: function (context, borders){
            anim1.draw(context, borders);
            this.l2.draw(borders);
            this.l2.pasteInto(context,'destination-in');
            
            this.l3.draw(borders);
            this.l2.pasteInto(this.l3.context,'destination-out');
            this.l3.pasteInto(context);
        }
    };
});
