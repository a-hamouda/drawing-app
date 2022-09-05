/**
 * Eraser too. Resets pixels of the canvas.
 */
class Eraser extends ToolWithOptions {
    /**
     * Background color of the canvas.
     *
     * @type {string}
     */
    #backgroundColor;
    /**
     * Size of the eraser.
     *
     * @type {number}
     */
    #size;
    /**
     * Previous x-pos of the mouse.
     *
     * @type {number}
     */
    #previousMouseX = -1;
    /**
     * Previous y-pos of the mouse.
     * @type {number}
     */
    #previousMouseY = -1;
    /**
     * Layer to which the eraser guide is drawn.
     */
    #eraserLayer;

    constructor(canvas, canvasHistory, backgroundColor) {
        super(canvas, canvasHistory);
        this.#backgroundColor = backgroundColor;
        this.icon = "assets/icons/eraser.svg";
        this.name = "eraser";
        this.options.push(new StrokeWeight(this.name, "Eraser Size", this.#onSizeChanged.bind(this)));
    }

    onDrawStart() {
        super.onDrawStart();
        const mouse = this.canvas.normalizedMouse();
        if (this.#previousMouseX === -1) {
            this.#previousMouseX = mouse.x;
            this.#previousMouseY = mouse.y;
        } else {
            this.drawingLayer.push();
            this.drawingLayer.stroke(this.#backgroundColor);
            this.drawingLayer.strokeWeight(this.#size);
            this.drawingLayer.line(this.#previousMouseX, this.#previousMouseY, mouse.x, mouse.y);
            this.drawingLayer.pop();
            this.#previousMouseX = mouse.x;
            this.#previousMouseY = mouse.y;
            this.hasChanges = true;
        }
        super.updateCanvas();
        this.#drawEraserGuide();
    }


    onDrawEnd() {
        this.#previousMouseX = -1;
        this.#previousMouseY = -1;
        super.onDrawEnd();
    }

    /**
     * Override the size of eraser.
     *
     * @param size
     */
    #onSizeChanged(size) {
        this.#size = size;
    }

    /**
     * Draw the eraser guide on a separate layer.
     */
    #drawEraserGuide() {
        const mouse = this.canvas.normalizedMouse();
        this.#eraserLayer = this.canvas.createGraphics(this.#size, this.#size);
        this.#eraserLayer.push();
        this.#eraserLayer.stroke("red");
        this.#eraserLayer.ellipseMode(this.#eraserLayer.CENTER);
        this.#eraserLayer.circle(this.#size / 2, this.#size / 2, this.#size * 0.99);
        this.#eraserLayer.pop();
        this.canvas.image(this.#eraserLayer, mouse.x - this.#size / 2, mouse.y - this.#size / 2);
    }
}
