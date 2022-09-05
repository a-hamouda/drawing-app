class SprayCanTool extends ToolWithOptions {
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
        this.options.push(new ColorPicker(this.name, "Spray Color", this.#onStrokeColorChanged.bind(this)));
        this.options.push(new Spray(this.name, "Particles", this.#onConfigChanged.bind(this)));
    }

    onDrawStart() {
        super.onDrawStart();
        const mouse = this.canvas.normalizedMouse();
        this.drawingLayer.push();
        this.drawingLayer.stroke(this.#strokeColor);
        let j = 0;
        while (j < this.#config.weight) {
            const x = this.canvas.random(mouse.x - this.#config.spread, mouse.x + this.#config.spread);
            const y = this.canvas.random(mouse.y - this.#config.spread, mouse.y + this.#config.spread);
            if (!SprayCanTool.#isInsideCircle(x, y, mouse.x, mouse.y, this.#config.spread / 2)) continue;
            this.drawingLayer.point(x, y);
            j++;
        }
        // for (let i = 0; i < this.#config.weight; i++) {
        //     this.drawingLayer.point(
        //         this.canvas.random(mouse.x - this.#config.spread, mouse.x + this.#config.spread),
        //         this.canvas.random(mouse.y - this.#config.spread, mouse.y + this.#config.spread)
        //     );
        // }
        this.drawingLayer.pop();
        this.hasChanges = true;
        super.updateCanvas();
    }

    static #isInsideCircle(pointX, pointY, mouseX, mouseY, radius) {
        return Math.sqrt(Math.pow((pointX - mouseX), 2) + Math.pow((pointY - mouseY), 2)) < radius;
    }

    #onStrokeColorChanged(color) {
        this.#strokeColor = color;
    }

    #onConfigChanged(config) {
        this.#config = config;
    }
}
