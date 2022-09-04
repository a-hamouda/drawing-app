class FreehandTool extends ToolWithOptions {
    //to smoothly draw we'll draw a line from the previous mouse location
    //to the current mouse location. The following values store
    //the locations from the last frame. They are -1 to start with because
    //we haven't started drawing yet.
    #previousMouseX = -1;
    #previousMouseY = -1;

    constructor(canvas, canvasHistory) {
        super(canvas, canvasHistory);
        this.icon = "assets/icons/free-hand.svg";
        this.name = "freehand";
        this.options.push(new ColorPicker(this.name));
    }

    onDrawStart() {
        super.onDrawStart();
        const strokeColor = $("#" + this.name + "ColorPickerPreview").css("background-color");
        if (this.#previousMouseX === -1) {
            this.#previousMouseX = this.canvas.mouseX;
            this.#previousMouseY = this.canvas.mouseY;
        } else {
            this.drawingLayer.push();
            this.drawingLayer.stroke(strokeColor);
            this.drawingLayer.line(this.#previousMouseX, this.#previousMouseY, this.canvas.mouseX, this.canvas.mouseY);
            this.drawingLayer.pop();
            this.#previousMouseX = this.canvas.mouseX;
            this.#previousMouseY = this.canvas.mouseY;
            this.hasChanges = true;
        }
        super.updateCanvas();
    }

    onDrawEnd() {
        this.#previousMouseX = -1;
        this.#previousMouseY = -1;
        super.onDrawEnd();
    }
}
