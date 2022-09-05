/**
 * Symmetric drawing tool.
 */
class MirrorDrawTool extends ToolWithOptions {
    /**
     * Pen color.
     *
     * @type string
     */
    #strokeColor;
    /**
     * Stroke weight.
     *
     * @type number
     */
    #strokeWeight;
    /**
     * Symmetry axis.
     *
     * @type {"x", "y"}
     */
    #axis;
    /**
     * Previous x-pos of the mouse.
     * @type {number}
     */
    #previousMouseX = -1;
    /**
     * Previous y-pos of the mouse.
     *
     * @type {number}
     */
    #previousMouseY = -1;
    /**
     * Previous x-pos of the mouse on the opposite side.
     *
     * @type {number}
     */
    #previousOppositeMouseX = -1;
    /**
     * Previous y-pos of the mouse on the opposite side.
     *
     * @type {number}
     */
    #previousOppositeMouseY = -1;
    /**
     * Layer to which the symmetry line guide is drew.
     */
    #symmetryLineLayer;

    constructor(canvas, canvasHistory) {
        super(canvas, canvasHistory);
        this.name = "mirrorDraw";
        this.icon = "assets/icons/mirror-tool.svg";
        this.options.push(new ColorPicker(this.name, "Pen Color", this.#onStrokeColorChanged.bind(this)));
        this.options.push(new StrokeWeight(this.name, "Stroke Weight", this.#onStrokeWeightChanged.bind(this)));
        this.options.push(new Symmetry(this.name, "Symmetric drawing", this.#onAxisChanged.bind(this)));
    }

    onSelected() {
        super.onSelected();
        this.#drawLineOfSymmetry();
    }

    onDrawStart() {
        super.onDrawStart();
        const mouse = this.canvas.normalizedMouse();
        if (this.#previousMouseX === -1) {
            this.#previousMouseX = mouse.x;
            this.#previousMouseY = mouse.y;
            this.#previousOppositeMouseX = this.calculateOpposite(mouse.x, "x");
            this.#previousOppositeMouseY = this.calculateOpposite(mouse.y, "y");
        } else {
            this.drawingLayer.push();
            this.drawingLayer.stroke(this.#strokeColor);
            this.drawingLayer.strokeWeight(this.#strokeWeight);
            this.drawingLayer.line(this.#previousMouseX, this.#previousMouseY, mouse.x, mouse.y);
            this.#previousMouseX = mouse.x;
            this.#previousMouseY = mouse.y;

            //these are for the mirrored drawing the other side of the
            //line of symmetry
            const oX = this.calculateOpposite(mouse.x, "x");
            const oY = this.calculateOpposite(mouse.y, "y");
            this.drawingLayer.line(this.#previousOppositeMouseX, this.#previousOppositeMouseY, oX, oY);
            this.#previousOppositeMouseX = oX;
            this.#previousOppositeMouseY = oY;
            this.drawingLayer.pop();
            this.hasChanges = true;
        }
        super.updateCanvas();
        this.#drawLineOfSymmetry();
    }

    onDrawEnd() {
        this.#previousMouseX = -1;
        this.#previousMouseY = -1;
        this.#previousOppositeMouseX = -1;
        this.#previousOppositeMouseY = -1;
        super.onDrawEnd();
    }

    /**
     * Draw the symmetry line guide on a separate layer.
     */
    #drawLineOfSymmetry() {
        if (this.#axis === "x") {
            this.#symmetryLineLayer = this.canvas.createGraphics(3, this.canvas.height);
            this.#symmetryLineLayer.background("red");
            this.canvas.image(this.#symmetryLineLayer, (this.canvas.width / 2) - (this.#symmetryLineLayer.width / 2), 0);
        } else {
            this.#symmetryLineLayer = this.canvas.createGraphics(this.canvas.width, 3);
            this.#symmetryLineLayer.background("red");
            this.canvas.image(this.#symmetryLineLayer, 0, (this.canvas.height / 2) - (this.#symmetryLineLayer.height / 2));
        }
    }

    /**
     * calculate an opposite coordinate the other side of the
     * symmetry line.
     * @param n number: location for either x or y coordinate
     * @param a [x,y]: the axis of the coordinate (y or y)
     * @return number: the opposite coordinate
     */
    calculateOpposite(n, a) {
        //if the axis isn't the one being mirrored return the same
        //value
        if (a !== this.#axis) {
            return n;
        }

        //if n is less than the line of symmetry return a coordinate
        //that is far greater than the line of symmetry by the distance from
        //n to that line.
        if (n < this.lineOfSymmetry) {
            return this.lineOfSymmetry + (this.lineOfSymmetry - n);
        }

            //otherwise a coordinate that is smaller than the line of symmetry
        //by the distance between it and n.
        else {
            return this.lineOfSymmetry - (n - this.lineOfSymmetry);
        }
    }

    /**
     * Override pen color.
     * 
     * @param {string} color - color of the pen.
     */
    #onStrokeColorChanged(color) {
        this.#strokeColor = color;
    }

    /**
     * Override stroke weight.
     * 
     * @param {number} weight - weight of the stroke.
     */
    #onStrokeWeightChanged(weight) {
        this.#strokeWeight = weight;
    }

    /**
     * Update line of symmetry when axis is changed.
     * 
     * @param {"x" | "y"} axis - new axis.
     */
    #onAxisChanged(axis) {
        this.#axis = axis;
        this.canvas.loadPixels();
        if (axis === "x") {
            this.lineOfSymmetry = this.canvas.width / 2;
        } else {
            this.lineOfSymmetry = this.canvas.height / 2;
        }
        this.#drawLineOfSymmetry();
        this.canvas.updatePixels();
    }
}
