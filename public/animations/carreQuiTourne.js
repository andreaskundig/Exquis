define({
  setup: function (context) {
    this.rotation = 0;
  },
  draw: function (context, borders) {
    context.fillStyle = "rgb(" + this.params.red.value + ",250,0)";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    context.save();
    context.translate(75, 75);
    context.rotate(this.rotation);
    context.fillStyle = "rgb(200,0,255)";
    context.fillRect(-75, -75, 150, 150);
    context.restore();
    this.rotation += this.params.speed.value * Math.PI / 180;
  },
  params: {
    "speed": {
      "value": 1,
      "min": -10,
      "max": 10,
      "step": 0.01
    },
    "red": {
      "value": 200,
      "min": 0,
      "max": 255,
      "step": 1
    }
  }
});
