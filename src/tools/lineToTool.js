/**
 * A tool for drawing straight lines to the screen. Allows the user to preview
 * the line to the current mouse position before drawing the line to the
 * pixel array.
 */
class LineToTool extends ToolWithOptions {
    /**
     * x-pos of the mouse.
     *
     * @type {number}
     */
    #startMouseX = -1;
    /**
     * y-pos of the mouse.
     * @type {number}
     */
    #startMouseY = -1;
    /**
     * Line color.
     *
     * @type string
     */
    #strokeColor;
    /**
     * Line weight.
     *
     * @type number
     */
    #strokeWeight;

    constructor(canvas, canvasHistory) {
        super(canvas, canvasHistory);
        this.icon = "assets/icons/line-tool.svg";
        this.name = "LineTo";
        this.options.push(new ColorPicker(this.name, "Line Color", this.#onStrokeColorChanged.bind(this)));
        this.options.push(new StrokeWeight(this.name, "Line Weight", this.#onStrokeWeightChanged.bind(this)));
    }

    onDrawStart() {
        super.onDrawStart();
        const mouse = this.canvas.normalizedMouse();
        if (this.#startMouseX === -1) {
            this.#startMouseX = mouse.x;
            this.#startMouseY = mouse.y;
            this.drawingLayer.loadPixels();
        } else {
            //update the screen with the saved pixels to hide any previous
            //line between mouse pressed and released
            this.drawingLayer.updatePixels();
            //draw the line
            this.drawingLayer.push();
            this.drawingLayer.stroke(this.#strokeColor);
            this.drawingLayer.strokeWeight(this.#strokeWeight);
            this.drawingLayer.line(this.#startMouseX, this.#startMouseY, mouse.x, mouse.y);
            this.drawingLayer.pop();
            this.hasChanges = true;
        }
        super.updateCanvas(false);
    }

    onDrawEnd() {
        this.#startMouseX = -1;
        this.#startMouseY = -1;
        super.onDrawEnd();
    }

    /**
     * Override line color.
     *
     * @param color
     */
    #onStrokeColorChanged(color) {
        this.#strokeColor = color;
    }

    /**
     * Override line weight.
     *
     * @param weight
     */
    #onStrokeWeightChanged(weight) {
        this.#strokeWeight = weight;
    }
}
