/**
 * Main drawing sketch.
 *
 * Used in instance mode to avoid problems and confusion when mixing with other
 * libraries.
 *
 * Read more about global vs instance modes here:
 *  https://github.com/processing/p5.js/wiki/Global-and-instance-mode
 *  https://p5js.org/reference/#/p5/p5
 *
 * @param {string} canvasColor - color of the canvas.
 * @param {number} canvasWidth - width of the canvas.
 * @param {number} canvasHeight - height of the canvas.
 * @return {function(Object)} - sketch object function.
 */
const sketch = (canvasColor, canvasWidth, canvasHeight) => {
    /**
     * Tools container.
     *
     * @type {Toolbox}
     */
    let toolbox;
    /**
     * Drawing history tracker.
     *
     * @type {CanvasHistory}
     */
    let canvasHistory;
    /**
     * Canvas zoom factor.
     *
     * @type {number}
     */
    let zoomFactor;

    return (canvas) => {
        /**
         * P5 [setup] function.
         */
        canvas.setup = () => {
            const mainCanvas = canvas.createCanvas(canvasWidth, canvasHeight);
            canvas.background(canvasColor);
            // attach to html element.
            mainCanvas.parent("sketchCanvas");

            // create a toolbox for storing the tools
            toolbox = new Toolbox(canvasColor);
            // initialize sketch actions.
            new SketchActions(canvas, toolbox, canvasColor, canvas.updateZoomFactor);
            // create canvas history tracker.
            canvasHistory = new CanvasHistory(canvas);

            //add the tools to the toolbox.
            toolbox.addTool(new FreehandTool(canvas, canvasHistory));
            toolbox.addTool(new LineToTool(canvas, canvasHistory));
            toolbox.addTool(new SprayCanTool(canvas, canvasHistory));
            toolbox.addTool(new MirrorDrawTool(canvas, canvasHistory));
            toolbox.addTool(new Eraser(canvas, canvasHistory, canvasColor));
        };

        /**
         * P5 [mouseMoved] function.
         */
        canvas.mouseMoved = () => canvas.trackMouseRelativeToCanvas();

        /**
         * P5 [mouseDragged] function.
         */
        canvas.mouseDragged = () => {
            canvas.trackMouseRelativeToCanvas();
            // only draw if mouse is over canvas.
            if (canvas.isMouseOverCanvas()) toolbox.selectedTool.onDrawStart();
        };

        /**
         * P5 [mouseReleased] function.
         */
        canvas.mouseReleased = () => {
            // finalize drawing if mouse is over canvas.
            if (canvas.isMouseOverCanvas()) toolbox.selectedTool.onDrawEnd();
        };

        /**
         * Used as a callback to notify this instance about zoom changes.
         *
         * @param {number} factor
         */
        canvas.updateZoomFactor = (factor) => {
            zoomFactor = factor;
        };

        /**
         * Calculate the effective position of the mouse relative to the zoomed canvas.
         *
         * Example:
         *  Given a 10 x 10 canvas, if user zooms the canvas by a factor of 2x,
         *  pointing to cell (10, 10) on the zoomed canvas should also point to cell (5, 5) on the normal canvas.
         *
         * @return {{x: number, y: number}} - normalized mouse position relative to the zoomed canvas.
         */
        canvas.normalizedMouse = () => {
            const mouseX = canvas.mouseX;
            const mouseY = canvas.mouseY;
            const normalizedX = (mouseX / (canvasWidth * zoomFactor)) * canvasWidth;
            const normalizedY = (mouseY / (canvasHeight * zoomFactor)) * canvasHeight;
            return {x: normalizedX, y: normalizedY};
        };

        /**
         * Check if mouse is currently on canvas.
         *
         * @return {boolean} - mouse is on canvas.
         */
        canvas.isMouseOverCanvas = () => {
            const mouse = canvas.normalizedMouse();
            const width = canvas.width;
            const height = canvas.height;

            if (mouse.x < 0 || mouse.x > width) return false;
            return !(mouse.y < 0 || mouse.y > height);
        };

        /**
         * Track mouse and update canvas info pane.
         */
        canvas.trackMouseRelativeToCanvas = () => {
            const mouse = canvas.normalizedMouse();
            const width = canvas.width;
            const height = canvas.height;
            const dxText = $(`#canvasInfoMouseX`);
            const dyText = $(`#canvasInfoMouseY`);

            if (mouse.x > width) {
                dxText.text("+" + Math.round(mouse.x - width) + "px");
            } else {
                dxText.text(Math.round(mouse.x) + "px");
            }

            if (mouse.y > height) {
                dyText.text("+" + Math.round(mouse.y - height) + "px");
            } else {
                dyText.text(Math.round(mouse.y) + "px");
            }
        };
    };
};
