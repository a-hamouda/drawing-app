class SprayCanTool extends ToolWithOptions {
    static #points = 13;
    static #spread = 10;

    constructor(canvas, canvasHistory) {
        super(canvas, canvasHistory);
        this.name = "sprayCanTool";
        this.icon = "assets/icons/spray-tool.svg";
        this.options.push(new ColorPicker(this.name));
    }

    onDrawStart() {
        super.onDrawStart();
        const fillColor = $("#" + this.name + "ColorPickerPreview").css("background-color");
        this.drawingLayer.push();
        this.drawingLayer.stroke(fillColor);
        for (let i = 0; i < SprayCanTool.#points; i++) {
            this.drawingLayer.point(
                this.canvas.random(this.canvas.mouseX - SprayCanTool.#spread, this.canvas.mouseX + SprayCanTool.#spread),
                this.canvas.random(this.canvas.mouseY - SprayCanTool.#spread, this.canvas.mouseY + SprayCanTool.#spread)
            );
        }
        this.drawingLayer.pop();
        this.hasChanges = true;
        super.updateCanvas();
    }
}
