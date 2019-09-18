// define(["bibs/paper-core"], function(paper){
define(["paper"], function(paper){
    return {
        setup: function({context}){
            //context.canvas.setAttribute('resize','true');
            this.paper = new paper.PaperScope();
            this.paper.setup(context.canvas);
                  
            // Create a Paper.js Path to draw a line into it:
            this.path = new paper.Path();
            // Give the stroke a color
            this.path.strokeColor = '#ffff99';
            this.path.strokeWidth = 10;
            var start = new paper.Point(5, 5);
            // Move to start and draw a line from there
            this.path.moveTo(start);
            // Note that the plus operator on Point objects does not work
            // in JavaScript. Instead, we need to call the add() function:
            this.path.lineTo(start.add([ 150, 0 ]));
            // Draw the view now:
            this.paper.view.draw();
            
        },
        draw: function({context, borders}){
            this.path.rotate(2);
            this.paper.view.draw();
        }};
});
