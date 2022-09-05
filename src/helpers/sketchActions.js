/**
 * Sketch Actions configurator.
 */
class SketchActions {
    /**
     * Zoom factor of the canvas.
     *
     * @type {number}
     */
    #zoomFactor = 1;
    /**
     * Callback to execute when zoom changes.
     *
     * @type {function(number)}
     */
    #onZoomChanged;

    constructor(canvas, toolbox, backgroundColor, onZoomChanged) {
        this.canvas = canvas;
        this.toolbox = toolbox;
        this.backgroundColor = backgroundColor;
        this.#onZoomChanged = onZoomChanged;
        this.#setupActionList();
        this.#setupZoomHandlers();
    }

    /**
     * Configure actions html elements.
     */
    #setupActionList() {
        $('#saveImageAction').on('click', () => {
            const sketchName = $("#sketchTitle").text();
            const selectedTool = this.toolbox.selectedTool;
            if (selectedTool instanceof ToolWithOptions) {
                selectedTool.onUnselected(false);
            } else {
                selectedTool.onUnselected();
            }
            this.canvas.saveCanvas(sketchName, "jpg");
        });

        $('#clearAction').on('click', () => {
            this.canvas.background(this.backgroundColor);
            this.toolbox.clearDrawingLayers();
            this.canvas.loadPixels();
        });
    }

    /**
     * Setup actions html elements handlers.
     */
    #setupZoomHandlers() {
        this.#updateZoom();

        $(`#canvasIncreaseZoom`).on("click", () => {
            if (this.#zoomFactor >= 3) return;
            this.#zoomFactor += 0.5;
            this.#updateZoom();
        });

        $(`#canvasDecreaseZoom`).on("click", () => {
            if (this.#zoomFactor <= 0.5) return;
            this.#zoomFactor -= 0.5;
            this.#updateZoom();
        });
    }

    /**
     * Apply zoom updates to canvas and call zoom callback.
     */
    #updateZoom() {
        $(`#canvasZoom`).val(this.#zoomFactor + "x");
        const canvasContainer = $(`#canvasContainer`);
        canvasContainer.css("transform-origin", `0% 0% 0px`);
        canvasContainer.css("transform", `scale(${this.#zoomFactor})`);
        this.#onZoomChanged(this.#zoomFactor);
    }
}
