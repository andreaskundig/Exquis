define(["bibs/canvasBuffer"], function(canvasBuffer){ return {
    setup: function(context){
        this.toRadians =  Math.PI / 180; 
        
        this.rotation = 0;
        this.halfWidth = context.canvas.width / 2;
        this.halfHeight = context.canvas.height / 2;
        
        this.buffer = canvasBuffer.makeBuffer(context.canvas.width,
                                              context.canvas.height);
        context.fillStyle = "rgb(150,10,20)";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        context.font = "12px Arial";
        context.fillText("Infolipo",10,50);
        context.strokeText("Infolipo",10,50);
        
        this.initStepper();
    },
    draw: function(context, borders){
        if(!this.isStepping()){
            return;
        }

        this.buffer.copyToBuffer(context, {x:0, y:0});

        context.save();
        context.translate(75, 75);
        context.rotate(this.rotation* this.toRadians);
        this.buffer.pasteInto(context);
        context.restore();

        this.rotation = this.rotation + 1;
    },
    initStepper: function(){
        this.count = 1;
        // event handler function
	var handler = function(e) {
	    var key = window.event ? e.keyCode : e.which;
            if(key === 80){ //p play
                this.count = 1;
            }else if(key === 83){ //s step
                this.count = -1;
            }
	}.bind(this);
	
	// attach handler to the keydown event of the document
	if (document.attachEvent) document.attachEvent('onkeydown', handler);
	else document.addEventListener('keydown', handler);         
    },
    isStepping: function(){
        var stepping = this.count != 0;
        if(stepping){
            this.count +=1;
        }
        return stepping;
    }

};});
