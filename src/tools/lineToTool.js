//a tool for drawing straight lines to the screen. Allows the user to preview
//the line to the current mouse position before drawing the line to the
//pixel array.
class LineToTool extends ToolWithOptions {
    #startMouseX = -1;
    #startMouseY = -1;

    constructor(canvas, canvasHistory) {
        super(canvas, canvasHistory);
        this.icon = "assets/icons/line-tool.svg";
        this.name = "LineTo";
        this.options.push(new ColorPicker(this.name));
    }

    onDrawStart() {
        super.onDrawStart();
        if (this.#startMouseX === -1) {
            this.#startMouseX = this.canvas.mouseX;
            this.#startMouseY = this.canvas.mouseY;
            this.drawingLayer.loadPixels();
        } else {
            //update the screen with the saved pixels to hide any previous
            //line between mouse pressed and released
            this.drawingLayer.updatePixels();
            //draw the line
            const strokeColor = $("#" + this.name + "ColorPickerPreview").css("background-color");
            this.drawingLayer.push();
            this.drawingLayer.stroke(strokeColor);
            this.drawingLayer.line(this.#startMouseX, this.#startMouseY, this.canvas.mouseX, this.canvas.mouseY);
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
}
