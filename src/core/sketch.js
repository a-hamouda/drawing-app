const sketch = (canvasColor, canvasWidth, canvasHeight) => {
    let toolbox;
    /**
     * @type {CanvasHistory}
     */
    let canvasHistory;
    let zoomFactor = 1;

    return (canvas) => {
        canvas.setup = () => {
            const mainCanvas = canvas.createCanvas(canvasWidth, canvasHeight);
            canvas.background(canvasColor);

            mainCanvas.parent("sketchCanvas");

            $(`#canvasZoom`).val(zoomFactor + "x");
            canvas.setupZoomHandlers();

            //create a toolbox for storing the tools
            toolbox = new Toolbox(canvasColor);
            new SketchActions(canvas, toolbox, canvasColor);
            canvasHistory = new CanvasHistory(canvas);
            
            //add the tools to the toolbox.
            toolbox.addTool(new FreehandTool(canvas, canvasHistory));
            toolbox.addTool(new LineToTool(canvas, canvasHistory));
            toolbox.addTool(new SprayCanTool(canvas, canvasHistory));
            toolbox.addTool(new MirrorDrawTool(canvas, canvasHistory));
        };

        canvas.mouseMoved = () => canvas.trackMouseRelativeToCanvas();

        canvas.mouseDragged = () => {
            canvas.trackMouseRelativeToCanvas();
            if (canvas.isMouseOverCanvas()) toolbox.selectedTool.onDrawStart();
        };

        canvas.mouseReleased = () => {
            if (canvas.isMouseOverCanvas()) toolbox.selectedTool.onDrawEnd();
        };

        canvas.setupZoomHandlers = () => {
            $(`#canvasIncreaseZoom`).on("click", () => {
                if (zoomFactor >= 3) return;
                zoomFactor += 0.5;
                canvas.zoom();
            });

            $(`#canvasDecreaseZoom`).on("click", () => {
                if (zoomFactor <= 0.5) return;
                zoomFactor -= 0.5;
                canvas.zoom();
            });
        };

        canvas.zoom = () => {
            // set zoom input value on canvas info pane
            $(`#canvasZoom`).val(zoomFactor + "x");
            const tempCanvas = canvas.createGraphics(canvasWidth, canvasHeight);
            tempCanvas.image(canvas, 0, 0, canvasWidth, canvasHeight);
            tempCanvas.loadPixels();
            canvas.resizeCanvas(canvasWidth * zoomFactor, canvasHeight * zoomFactor);
            canvas.image(tempCanvas, 0, 0, canvasWidth * zoomFactor, canvasHeight * zoomFactor);
        };

        canvas.isMouseOverCanvas = () => {
            const mouseX = canvas.mouseX;
            const mouseY = canvas.mouseY;
            const width = canvas.width;
            const height = canvas.height;

            if (mouseX < 0 || mouseX > width) return false;
            return !(mouseY < 0 || mouseY > height);
        };

        canvas.trackMouseRelativeToCanvas = () => {
            const dx = canvas.mouseX;
            const width = canvas.width;
            const dy = canvas.mouseY;
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
