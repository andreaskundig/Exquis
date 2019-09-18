
define(["bibs/imageDataUtils"],  
function(idu){
    return {
        setup: function({context}){
        },
        draw: function({context, borders}){
           var speed = 2;

           var vertical = true;
           idu.pushLine(context, borders, null, vertical, speed);

           vertical = false
           idu.pushLine(context, borders, null, vertical, speed);

        }};
});
