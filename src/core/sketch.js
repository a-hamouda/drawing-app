const sketch = (canvasColor, canvasWidth, canvasHeight) => {
    /**
     * @type {Toolbox}
     */
    let toolbox;
    /**
     * @type {CanvasHistory}
     */
    let canvasHistory;
    /**
     * @type {number}
     */
    let zoomFactor;

    return (canvas) => {
        canvas.setup = () => {
            const mainCanvas = canvas.createCanvas(canvasWidth, canvasHeight);
            canvas.background(canvasColor);

            mainCanvas.parent("sketchCanvas");

            //create a toolbox for storing the tools
            toolbox = new Toolbox(canvasColor);
            new SketchActions(canvas, toolbox, canvasColor, canvas.updateZoomFactor);
            canvasHistory = new CanvasHistory(canvas);

            //add the tools to the toolbox.
            toolbox.addTool(new FreehandTool(canvas, canvasHistory));
            toolbox.addTool(new LineToTool(canvas, canvasHistory));
            toolbox.addTool(new SprayCanTool(canvas, canvasHistory));
            toolbox.addTool(new MirrorDrawTool(canvas, canvasHistory));
            toolbox.addTool(new Eraser(canvas, canvasHistory, canvasColor));
        };

        canvas.mouseMoved = () => canvas.trackMouseRelativeToCanvas();

        canvas.mouseDragged = () => {
            canvas.trackMouseRelativeToCanvas();
            if (canvas.isMouseOverCanvas()) toolbox.selectedTool.onDrawStart();
        };

        canvas.mouseReleased = () => {
            if (canvas.isMouseOverCanvas()) toolbox.selectedTool.onDrawEnd();
        };

        canvas.updateZoomFactor = (factor) => {
            zoomFactor = factor;
        };

        /**
         *
         * @return {{x: number, y: number}}
         */
        canvas.normalizedMouse = () => {
            const mouseX = canvas.mouseX;
            const mouseY = canvas.mouseY;
            const normalizedX = (mouseX / (canvasWidth * zoomFactor)) * canvasWidth;
            const normalizedY = (mouseY / (canvasHeight * zoomFactor)) * canvasHeight;
            return {x: normalizedX, y: normalizedY};
        };

        canvas.isMouseOverCanvas = () => {
            const mouse = canvas.normalizedMouse();
            const width = canvas.width;
            const height = canvas.height;

            if (mouse.x < 0 || mouse.x > width) return false;
            return !(mouse.y < 0 || mouse.y > height);
        };

        canvas.trackMouseRelativeToCanvas = () => {
            const dx = canvas.normalizedMouse().x;
            const width = canvas.width;
            const dy = canvas.normalizedMouse().y;
            const height = canvas.height;
            const dxText = $(`#canvasInfoMouseX`);
            const dyText = $(`#canvasInfoMouseY`);

            if (dx > width) {
                dxText.text("+" + Math.round(dx - width) + "px");
            } else {
                dxText.text(Math.round(dx) + "px");
            }

            if (dy > height) {
                dyText.text("+" + Math.round(dy - height) + "px");
            } else {
                dyText.text(Math.round(dy) + "px");
            }
        };
    };
};
