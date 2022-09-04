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
        const mouse = this.canvas.normalizedMouse();
        const fillColor = $("#" + this.name + "ColorPickerPreview").css("background-color");
        this.drawingLayer.push();
        this.drawingLayer.stroke(fillColor);
        for (let i = 0; i < SprayCanTool.#points; i++) {
            this.drawingLayer.point(
                this.canvas.random(mouse.x - SprayCanTool.#spread, mouse.x + SprayCanTool.#spread),
                this.canvas.random(mouse.y - SprayCanTool.#spread, mouse.y + SprayCanTool.#spread)
            );
        }
        this.drawingLayer.pop();
        this.hasChanges = true;
        super.updateCanvas();
    }
}
