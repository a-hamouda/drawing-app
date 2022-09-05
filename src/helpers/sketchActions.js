class SketchActions {
    #zoomFactor = 1;
    /**
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

    #setupActionList() {
        $('#saveImageAction').on('click', () => {
            const sketchName = $("#sketchTitle").text();
            this.toolbox.selectedTool.onUnselected();
            this.canvas.saveCanvas(sketchName, "jpg");
        });

        $('#clearAction').on('click', () => {
            this.canvas.background(this.backgroundColor);
            this.toolbox.clearDrawingLayers();
            this.canvas.loadPixels();
        });
    }

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

    #updateZoom() {
        $(`#canvasZoom`).val(this.#zoomFactor + "x");
        const canvasContainer = $(`#canvasContainer`);
        canvasContainer.css("transform-origin", `0% 0% 0px`);
        canvasContainer.css("transform", `scale(${this.#zoomFactor})`);
        this.#onZoomChanged(this.#zoomFactor);
    }
}
