define(["bibs/imageDataUtils"], (idu)=>({
start: window.performance.now() * 10000 ,
draw: function({context, borders}){
    const periodCount = Math.floor((new Date().getTime()-this.start) / 1700);
    const rec = idu.rectangle(0, 0, context.canvas.width, context.canvas.height);
    const isHorizontal = periodCount % 2 == 0;
    const speed = (periodCount % 3) +1 ; 
    idu.pushLine(context, borders, rec, isHorizontal, speed);
}}));
