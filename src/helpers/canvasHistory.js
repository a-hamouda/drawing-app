class CanvasHistory {
    /**
     * @type {Uint8ClampedArray}
     */
    initialSnapshot;
    /**
     * @type {Stack}
     */
    undoStack;
    /**
     * @type {Stack}
     */
    redoStack;
    /**
     * @type {Tool[]}
     */
    listeners;

    constructor(canvas) {
        this.canvas = canvas;
        this.canvas.loadPixels();
        this.initialSnapshot = canvas.pixels;
        this.undoStack = new Stack();
        this.redoStack = new Stack();
        this.listeners = [];
        $(`#undoButton`).on("click", this.#undo.bind(this));
        $(`#redoButton`).on("click", this.#redo.bind(this));

        CanvasHistory.#enableUndoButton(false);
        CanvasHistory.#enableRedoButtonState(false);
    }

    addListener(tool) {
        this.listeners.push(tool);
    }

    removeListener(tool) {
        this.listeners.splice(this.listeners.indexOf(tool), 1);
    }

    #notifyListeners() {
        for (const listener of this.listeners) {
            listener.updateDrawingLayer();
        }
    }

    add(snapshot) {
        console.log("added new snapshot");
        this.undoStack.add(snapshot);
        CanvasHistory.#enableUndoButton(true);
    }

    #undo() {
        this.redoStack.add(this.undoStack.remove());
        CanvasHistory.#enableRedoButtonState(true);
        this.#updateCanvas();
        this.#notifyListeners();
        if (this.undoStack.size <= 0) CanvasHistory.#enableUndoButton(false);
        console.log("undo queue has: " + this.undoStack.size + " elements.");
        console.log("redo queue has: " + this.redoStack.size + " elements.");
    }

    #redo() {
        this.undoStack.add(this.redoStack.remove());
        CanvasHistory.#enableUndoButton(true);
        this.#updateCanvas();
        this.#notifyListeners();
        if (this.redoStack.size <= 0) CanvasHistory.#enableRedoButtonState(false);
        console.log("undo queue has: " + this.undoStack.size + " elements.");
        console.log("redo queue has: " + this.redoStack.size + " elements.");
    }

    #updateCanvas() {
        this.canvas.loadPixels();
        if (this.undoStack.size === 0) {
            for (let i = 0; i < this.canvas.pixels.length; i++) {
                this.canvas.pixels[i] = this.initialSnapshot[i];
            }
        } else {
            for (let i = 0; i < this.canvas.pixels.length; i++) {
                this.canvas.pixels[i] = this.undoStack.first.data[i];
            }
        }
        this.canvas.updatePixels();
    }

    static #enableUndoButton(value) {
        const undoButton = $(`#undoButton`);
        undoButton.prop("disabled", !value);
    }

    static #enableRedoButtonState(value) {
        const redoButton = $(`#redoButton`);
        redoButton.prop("disabled", !value);
    }
}
