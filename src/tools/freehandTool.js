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
        const mouse = this.canvas.normalizedMouse();
        if (this.#previousMouseX === -1) {
            this.#previousMouseX = mouse.x;
            this.#previousMouseY = mouse.y;
        } else {
            this.drawingLayer.push();
            this.drawingLayer.stroke(strokeColor);
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
}
