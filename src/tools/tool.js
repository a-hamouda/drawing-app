/**
 * Abstract class for drawing tools.
 */
class Tool {
    /**
     * Icon file path
     *
     * @type {string}
     */
    icon;
    /**
     * Name of the tool.
     *
     * @type {string}
     */
    name;
    /**
     * Drawing canvas.
     *
     * @type {Object}
     */
    canvas;
    /**
     * Canvas pixels before applying changes by this tool.
     *
     * @type {Uint8ClampedArray}
     */
    previousPixels;
    /**
     * History of the canvas.
     *
     * @type {CanvasHistory}
     */
    canvasHistory;
    /**
     * Layer to draw to by this tool.
     *
     * @type {Object}
     */
    drawingLayer;
    /**
     * Drawing layer has changes not applied to canvas.
     *
     * @type {boolean}
     */
    hasChanges;

    constructor(canvas, canvasHistory) {
        if (this.constructor === Tool) throw new Error("Cannot instantiate abstract classes");
        this.canvas = canvas;
        this.canvasHistory = canvasHistory;
        this.drawingLayer = this.canvas.createGraphics(this.canvas.width, this.canvas.height);
        this.hasChanges = false;
        this.canvasHistory.addListener(this);
    }

    /**
     * Lifecycle method. Called when tool is selected to set up drawing session.
     */
    onSelected() {
        this.canvas.loadPixels();
        this.previousPixels = this.canvas.pixels;
        this.drawingLayer.loadPixels();
        this.drawingLayer.image(this.canvas, 0, 0);
        this.updateDrawingLayer();
    }

    /**
     * Lifecycle method. Called when tool is unselected to save any changes to canvas before
     * ending drawing session.
     */
    onUnselected() {
        let sessionHasData = false;
        this.drawingLayer.loadPixels();
        for (let i = 0; i < this.drawingLayer.pixels.length; i++) {
            if (this.drawingLayer.pixels[i] !== this.previousPixels[i]) {
                sessionHasData = true;
                break;
            }
        }
        if (!sessionHasData) {
            for (let i = 0; i < this.canvas.pixels.length; i++) {
                this.canvas.pixels[i] = this.previousPixels[i];
            }
            this.canvas.updatePixels();
        }
    };

    /**
     * Lifecycle method. Called when drawing by this tool begins.
     */
    onDrawStart() {
    }

    /**
     * Lifecycle method. Called when drawing by this tool ends.
     */
    onDrawEnd() {
        if (this.hasChanges) {
            this.drawingLayer.loadPixels();
            this.canvasHistory.add(this.drawingLayer.pixels);
            this.hasChanges = false;
        }
    }

    /**
     * Resets the drawing layer.
     *
     * @param {string} backgroundColor - color of the canvas.
     */
    clearDrawingLayer(backgroundColor) {
        if (this.drawingLayer === undefined || this.drawingLayer === null) return;
        this.drawingLayer.background(backgroundColor);
    }

    /**
     * Write drawing layer changes to canvas.
     *
     * @param {boolean} loadDrawingLayerPixels - should load drawing layer's pixels array.
     */
    updateCanvas(loadDrawingLayerPixels = true) {
        this.canvas.image(this.drawingLayer, 0, 0);
        this.updateDrawingLayer(loadDrawingLayerPixels);
    }

    /**
     * Write current canvas pixels to drawing layer.
     *
     * @param {boolean} loadDrawingLayerPixels - should load drawing layer's pixels array.
     */
    updateDrawingLayer(loadDrawingLayerPixels = true) {
        if (loadDrawingLayerPixels) this.drawingLayer.loadPixels();
        this.previousPixels = this.drawingLayer.pixels;
        this.drawingLayer.image(this.canvas, 0, 0);
    }
}

/**
 * Abstract class for drawing tools with options.
 */
class ToolWithOptions extends Tool {
    /**
     * Drawing tool options.
     *
     * @type {ToolOption[]}
     */
    options = [];

    constructor(canvas, canvasHistory) {
        super(canvas, canvasHistory);
        if (this.constructor === ToolWithOptions) throw new Error("Cannot instantiate abstract classes");
    }

    onSelected() {
        super.onSelected();
        for (const option of this.options) {
            option.show();
        }
    }

    onUnselected(hideOptions = true) {
        super.onUnselected();
        if (hideOptions) {
            for (const option of this.options) {
                option.hide();
            }
        }
    }
}
