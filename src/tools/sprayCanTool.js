class SprayCanTool extends ToolWithOptions {
    // static #points = 13;
    // static #spread = 10;

    /**
     * @type {{weight: number, spread: number}}
     */
    #config;

    /**
     * @type string
     */
    #strokeColor;

    constructor(canvas, canvasHistory) {
        super(canvas, canvasHistory);
        this.name = "sprayCanTool";
        this.icon = "assets/icons/spray-tool.svg";
        this.options.push(new ColorPicker(this.name, this.#onStrokeColorChanged.bind(this)));
        this.options.push(new Spray(this.name, this.#onConfigChanged.bind(this)));
    }

    onDrawStart() {
        super.onDrawStart();
        const mouse = this.canvas.normalizedMouse();
        this.drawingLayer.push();
        this.drawingLayer.stroke(this.#strokeColor);
        for (let i = 0; i < this.#config.weight; i++) {
            this.drawingLayer.point(
                this.canvas.random(mouse.x - this.#config.spread, mouse.x + this.#config.spread),
                this.canvas.random(mouse.y - this.#config.spread, mouse.y + this.#config.spread)
            );
        }
        this.drawingLayer.pop();
        this.hasChanges = true;
        super.updateCanvas();
    }

    #onStrokeColorChanged(color) {
        this.#strokeColor = color;
    }

    #onConfigChanged(config) {
        this.#config = config;
        console.log("changed");
    }
}
