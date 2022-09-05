/**
 * Circular spray tool.
 */
class SprayCanTool extends ToolWithOptions {
    /**
     * Config of the particles.
     *
     * @type {{weight: number, spread: number}}
     */
    #config;

    /**
     * Spray color.
     *
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
        this.drawingLayer.pop();
        this.hasChanges = true;
        super.updateCanvas();
    }

    /**
     * Check particle is inside a circle with the center being the mouse and the radius being
     * half of the spray's spread value.
     *
     * @param {number} pointX - x-pos of the particle.
     * @param {number} pointY - y-pos of the particle.
     * @param {number} mouseX - x-pos of the mouse.
     * @param {number} mouseY - y-pos of the mouse.
     * @param {number} radius - circle radius.
     * @return {boolean} - particle is inside circle.
     */
    static #isInsideCircle(pointX, pointY, mouseX, mouseY, radius) {
        return Math.sqrt(Math.pow((pointX - mouseX), 2) + Math.pow((pointY - mouseY), 2)) < radius;
    }

    /**
     * Override spray color.
     *
     * @param {string} color - color of the spray.
     */
    #onStrokeColorChanged(color) {
        this.#strokeColor = color;
    }

    /**
     * Override particles configuration.
     *
     * @param {{weight: number, spread: number}} config - particles configuration.
     */
    #onConfigChanged(config) {
        this.#config = config;
    }
}
