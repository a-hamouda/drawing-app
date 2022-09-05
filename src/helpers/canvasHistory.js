/**
 * Canvas history tracker. Provides ways to undo and redo changes to the drawing canvas.
 */
class CanvasHistory {
    /**
     * Pixels before applying a change to the canvas.
     *
     * @type {Uint8ClampedArray}
     */
    initialSnapshot;
    /**
     * Stack of saved changes in form of pixel arrays.
     *
     * @type {Stack}
     */
    undoStack;
    /**
     * Stack of undone changes in form of pixel arrays.
     *
     * @type {Stack}
     */
    redoStack;
    /**
     * Tools that listen to history changes.
     *
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

    /**
     * Add a tool as a listener for canvas history.
     *
     * @param tool
     */
    addListener(tool) {
        this.listeners.push(tool);
    }

    /**
     * Notify all listeners about changes to canvas history.
     */
    #notifyListeners() {
        for (const listener of this.listeners) {
            listener.updateDrawingLayer();
        }
    }

    /**
     * Add a change to the history.
     *
     * @param {Uint8ClampedArray} snapshot - pixels of the new change.
     */
    add(snapshot) {
        this.undoStack.add(snapshot);
        CanvasHistory.#enableUndoButton(true);
    }

    /**
     * Undo a recent change.
     */
    #undo() {
        this.redoStack.add(this.undoStack.remove());
        CanvasHistory.#enableRedoButtonState(true);
        this.#updateCanvas();
        this.#notifyListeners();
        if (this.undoStack.size <= 0) CanvasHistory.#enableUndoButton(false);
    }

    /**
     * Redo last undone change.
     */
    #redo() {
        this.undoStack.add(this.redoStack.remove());
        CanvasHistory.#enableUndoButton(true);
        this.#updateCanvas();
        this.#notifyListeners();
        if (this.redoStack.size <= 0) CanvasHistory.#enableRedoButtonState(false);
    }

    /**
     * Apply history changes to main canvas.
     */
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

    /**
     * Enable/Disable undo button.
     *
     * @param {boolean} value - desired state of button.
     */
    static #enableUndoButton(value) {
        const undoButton = $(`#undoButton`);
        undoButton.prop("disabled", !value);
    }

    /**
     * Enable/Disable redo button.
     *
     * @param {boolean} value - desired state of button.
     */
    static #enableRedoButtonState(value) {
        const redoButton = $(`#redoButton`);
        redoButton.prop("disabled", !value);
    }
}
