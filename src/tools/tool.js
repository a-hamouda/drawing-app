class Tool {
    icon;
    name;
    canvas;
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
        this.updateDrawingLayer();
    }

    onUnselected() {
    };

    onDrawStart() {
    }

    onDrawEnd() {
        if (this.hasChanges) {
            this.drawingLayer.loadPixels();
            this.canvasHistory.add(this.drawingLayer.pixels);
            this.drawingLayer.image(this.canvas, 0, 0);
            this.hasChanges = false;
        }
    }

    clearDrawingLayer(backgroundColor) {
        if (this.drawingLayer === undefined || this.drawingLayer === null) return;
        this.drawingLayer.background(backgroundColor);
    }

    updateCanvas() {
        this.canvas.image(this.drawingLayer, 0, 0);
        this.updateDrawingLayer();
    }

    updateDrawingLayer() {
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

    onUnselected() {
        super.onUnselected();
        for (const option of this.options) {
            option.hide();
        }
    }
}
