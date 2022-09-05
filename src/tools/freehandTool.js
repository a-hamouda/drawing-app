class FreehandTool extends ToolWithOptions {
    //to smoothly draw we'll draw a line from the previous mouse location
    //to the current mouse location. The following values store
    //the locations from the last frame. They are -1 to start with because
    //we haven't started drawing yet.
    #previousMouseX = -1;
    #previousMouseY = -1;
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

    #onStrokeWeightChanged(weight) {
        this.#strokeWeight = weight;
    }

    #onStrokeColorChanged(color) {
        this.#strokeColor = color;
    }
}
