define([],function(){
    return {
        init: function(paused){
            this.count = paused ? -1 : 1;
            // event handler function
	    var handler = function(e) {
	        var key = window.event ? e.keyCode : e.which;
                if(key === 80){ //p play
                    this.count = 1;
                    console.log("play");
                }else if(key === 83){ //s step
                    this.count = -1;
                    console.log("step");
                }
	    }.bind(this);
	    
	    // attach handler to the keydown event of the document
	    if (document.attachEvent) document.attachEvent('onkeydown', handler);
	    else document.addEventListener('keydown', handler);         
        },
        wantsPause: function(){
            var pause = this.count == 0;
            if(!pause){
                this.count +=1;
            }
            return pause;
        }
    };

});
