define({
    drawEllipse: function (ctx, x, y, w, h) {
        var kappa = .5522848,
            ox = (w / 2) * kappa, // control point offset horizontal
            oy = (h / 2) * kappa, // control point offset vertical
            xe = x + w,           // x-end
            ye = y + h,           // y-end
            xm = x + w / 2,       // x-middle
            ym = y + h / 2;       // y-middle

        ctx.beginPath();
        ctx.moveTo(x, ym);
        ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        ctx.closePath();
        ctx.stroke();
    },
    drawLine: function(ctx, a, b, color){
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.closePath();
        ctx.stroke();
    },
    drawLabel: function(context, text, opts){
        opts = opts || {};
        const x = opts.x || 0,
              y = opts.y || 0,
              w = opts.width || 50,
              h = opts.height || 20;
              
        context.fillStyle = opts.backgroundColor || 'khaki';
        context.fillRect(x, y, w, h);
        context.font = opts.font || "12px Arial";
        context.fillStyle = opts.textColor || 'black';
        context.fillText(text, x + 15, y + 15);
  }
});
