define([],function(){
    
    return function(paused){
        var stepper = {
            count: paused ? -1 : 1,
            wantsPause: function(){
                var pause = this.count == 0;
                if(!pause){
                    this.count +=1;
                }
                return pause;
            }
        };
            // event handler function
	var handler = function(e) {
	    var key = window.event ? e.keyCode : e.which;
            if(key === 80){ //p play
                stepper.count = 1;
                console.log("play");
            }else if(key === 83){ //s step
                stepper.count = -1;
                console.log("step");
            }
	};
	    
	    // attach handler to the keydown event of the document
	if (document.attachEvent){
            document.attachEvent('onkeydown', handler);
        } else { 
            document.addEventListener('keydown', handler);         
        }
        return stepper;
    };

});
