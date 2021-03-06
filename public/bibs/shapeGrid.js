define(function () {
    class ShapeGrid {
        constructor(context, options) {
            this.elementsPerSide = options.elementsPerSide || 4;
            this.elements = [];
            this.context = context;
            this.coordinatesByShape = new Map();
            
            const p = new paper.PaperScope();
            this.paper = p;
            p.setup(context.canvas);
            context.canvas.width /= devicePixelRatio;
            context.canvas.height /= devicePixelRatio;
            const stepSize = context.canvas.width/this.elementsPerSide;

            let createShape = options.createShape;
            if(!createShape){
                createShape = this.createBlackRectangle.bind(this);
            }
            for (var x = 0; x < this.elementsPerSide; x++) {
                for (var y = 0; y < this.elementsPerSide; y++) {
                    const topLeft = new p.Point(x,y).multiply(stepSize);
                    const shape = createShape(p,topLeft,stepSize);
                    this.elements.push(shape);
                    this.coordinatesByShape.set(shape, [x,y]);
                }
            }
        }

        createBlackRectangle(paper, topLeft, width) {
            const w = this.context.canvas.width / this.elementsPerSide;
            const h = this.context.canvas.height / this.elementsPerSide;
            const shapeSize = new paper.Size(w, h);
            return paper.Path.Rectangle({
                point: topLeft,
                fillColor: 'black',
                size: shapeSize,
                applyMatrix: false
            });
        }

        forEach(func) {
            this.elements.forEach((element, index) => {
                const [x, y] = this.xy(index);
                func(element, x, y, index)
            })
        }

        xy(index) {
            return [Math.floor(index / this.elementsPerSide),
            index % this.elementsPerSide];
        }

        indexForXY(x, y) {
            return x * this.elementsPerSide + y;
        }

        xyTouchesBorder(x, y) {
            return !!this.neighboringBorder(x,y);
        }

        getElementByXY(x, y) {
            return this.elements[this.indexForXY(x, y)];
        }

        neighborsXYs(x, y) {
            return [[x + 1, y], [x, y + 1], [x - 1, y], [x, y - 1]]
                .filter(([x, y]) => {
                    let ok = x >= 0 && x < this.elementsPerSide;
                    return ok && y >= 0 && y < this.elementsPerSide;
                });
        }

        neighboringBorder(x, y) {
            if (x == 0) { return 'west'; }
            if (y == 0) { return 'north'; }
            if (x == this.elementsPerSide - 1) { return 'east'; }
            if (y == this.elementsPerSide - 1) { return 'south'; }
            return null;
        }

        neighbors(x, y) {
            return this.neighborsXYs(x, y)
                .map(([x, y]) => this.getElementByXY(x, y));
        }

        scale() {
            this.paper.view.scale.apply(this.paper.view, arguments);
        }

        coordinates(shape){
            return this.coordinatesByShape.get(shape);
        }
    }

    return ShapeGrid;
});
