class Tool {
    icon;
    name;
    canvas;
    previousPixels;
    canvasHistory;
    drawingLayer;
    hasChanges;

    constructor(canvas, canvasHistory) {
        if (this.constructor === Tool) throw new Error("Cannot instantiate abstract classes");
        this.canvas = canvas;
        this.canvasHistory = canvasHistory;
        this.drawingLayer = this.canvas.createGraphics(this.canvas.width, this.canvas.height);
        this.hasChanges = false;
        this.canvasHistory.addListener(this);
    }

    onSelected() {
        this.canvas.loadPixels();
        this.previousPixels = this.canvas.pixels;
        this.drawingLayer.loadPixels();
        this.drawingLayer.image(this.canvas, 0, 0);
        this.updateDrawingLayer();
    }

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

    onDrawStart() {
    }

    onDrawEnd() {
        if (this.hasChanges) {
            this.drawingLayer.loadPixels();
            this.canvasHistory.add(this.drawingLayer.pixels);
            this.hasChanges = false;
        }
    }

    clearDrawingLayer(backgroundColor) {
        if (this.drawingLayer === undefined || this.drawingLayer === null) return;
        this.drawingLayer.background(backgroundColor);
    }

    updateCanvas(loadDrawingLayerPixels = true) {
        this.canvas.image(this.drawingLayer, 0, 0);
        this.updateDrawingLayer(loadDrawingLayerPixels);
    }

    updateDrawingLayer(loadDrawingLayerPixels = true) {
        if (loadDrawingLayerPixels) this.drawingLayer.loadPixels();
        this.previousPixels = this.drawingLayer.pixels;
        this.drawingLayer.image(this.canvas, 0, 0);
    }
}

class ToolWithOptions extends Tool {
    /**
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
