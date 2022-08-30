class SketchActions {
    /**
     * Actions related to sketch.
     *
     * @param {string} backgroundColor
     * @param canvas
     */
    constructor(canvas, backgroundColor) {
        SketchActions.#setupActionList(canvas, backgroundColor);
    }

    /**
     * Setup actions for the sketch.
     *
     * @param canvas
     * @param {string} backgroundColor
     */
    static #setupActionList(canvas, backgroundColor) {
        $('#saveImageAction').on('click', function () {
            const sketchName = $("#navbarTitle").text();
            canvas.saveCanvas(sketchName, "jpg");
        });

        $('#clearAction').on('click', function () {
            canvas.background(backgroundColor);
            canvas.loadPixels();
        });
    }
}
