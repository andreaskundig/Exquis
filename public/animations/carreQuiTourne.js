define({
  setup: function (context, animationState) {
    if (!animationState.hasOwnProperty('rotation')) {
      animationState.rotation = 0;
    }
  },
  draw: function (context, borders, animationState) {
    context.fillStyle = "rgb(" + this.params.red.value + ",250,0)";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    context.save();
    context.translate(75, 75);
    context.rotate(animationState.rotation);
    context.fillStyle = "rgb(200,0,255)";
    context.fillRect(-75, -75, 150, 150);
    context.restore();
    animationState.rotation += this.params.speed.value * Math.PI / 180;
  },
  params: {
    "speed": {
      "value": 2.54,
      "min": -10,
      "max": 10,
      "step": 0.01
    },
    "red": {
      "value": 48,
      "min": 0,
      "max": 255,
      "step": 1
    }
  }
});
