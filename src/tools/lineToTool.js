//a tool for drawing straight lines to the screen. Allows the user to preview
//the line to the current mouse position before drawing the line to the
//pixel array.
class LineToTool extends ToolWithOptions {
    #startMouseX = -1;
    #startMouseY = -1;
    /**
     * @type string
     */
    #strokeColor;
    /**
     * @type number
     */
    #strokeWeight;

    constructor(canvas, canvasHistory) {
        super(canvas, canvasHistory);
        this.icon = "assets/icons/line-tool.svg";
        this.name = "LineTo";
        this.options.push(new ColorPicker(this.name, this.#onStrokeColorChanged.bind(this)));
        this.options.push(new StrokeWeight(this.name, this.#onStrokeWeightChanged.bind(this)))
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

    #onStrokeColorChanged(color) {
        this.#strokeColor = color;
    }

    #onStrokeWeightChanged(weight) {
        this.#strokeWeight = weight;
    }
}
