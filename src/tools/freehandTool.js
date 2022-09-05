/**
 * Freehand painting tool. A.K.A. Pen tool.
 */
class FreehandTool extends ToolWithOptions {
    /**
     * Previous x-pos of the mouse.
     *
     * @type {number}
     */
    #previousMouseX = -1;
    /**
     * Previous y-pos of the mouse.
     *
     * @type {number}
     */
    #previousMouseY = -1;
    /**
     * Color of the pen.
     *
     * @type string
     */
    #strokeColor;
    /**
     * Stroke weight.
     *
     * @type number
     */
    #strokeWeight;

    constructor(canvas, canvasHistory) {
        super(canvas, canvasHistory);
        this.icon = "assets/icons/free-hand.svg";
        this.name = "freehand";
        this.options.push(new ColorPicker(this.name, "Pen Color", this.#onStrokeColorChanged.bind(this)));
        this.options.push(new StrokeWeight(this.name, "Stroke Weight", this.#onStrokeWeightChanged.bind(this)));
    }

    onDrawStart() {
        super.onDrawStart();
        const mouse = this.canvas.normalizedMouse();
        if (this.#previousMouseX === -1) {
            this.#previousMouseX = mouse.x;
            this.#previousMouseY = mouse.y;
        } else {
            this.drawingLayer.push();
            this.drawingLayer.stroke(this.#strokeColor);
            this.drawingLayer.strokeWeight(this.#strokeWeight);
            this.drawingLayer.line(this.#previousMouseX, this.#previousMouseY, mouse.x, mouse.y);
            this.drawingLayer.pop();
            this.#previousMouseX = mouse.x;
            this.#previousMouseY = mouse.y;
            this.hasChanges = true;
        }
        super.updateCanvas();
    }

    onDrawEnd() {
        this.#previousMouseX = -1;
        this.#previousMouseY = -1;
        super.onDrawEnd();
    }

    /**
     * Override stroke weight.
     *
     * @param {number} weight
     */
    #onStrokeWeightChanged(weight) {
        this.#strokeWeight = weight;
    }

    /**
     * Override pen color.
     * 
     * @param {string} color
     */
    #onStrokeColorChanged(color) {
        this.#strokeColor = color;
    }
}
