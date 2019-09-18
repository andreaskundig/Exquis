define(["bibs/webCam"], function(webCam){
    return {
        setup: function({context}){
            this.webCam = webCam.makeWebCam();
            this.rotation = 0;
        },
        draw: function({context, borders}){
            
            context.save();
            context.translate(75, 75);
            context.rotate(this.rotation );
            context.scale(0.8, 0.8);
            context.translate(- this.webCam.context.width / 2,
                              - this.webCam.context.height / 2);
            this.webCam.copyFromCam(context);
            context.restore();
            
            this.rotation = this.rotation + Math.PI / 180 / 3;
        }
    };
});
