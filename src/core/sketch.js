const sketch = (canvasColor, canvasWidth, canvasHeight) => {
    let toolbox = null;
    let isSetup = false;
    let zoomFactor = 1;

    return (canvas) => {
        canvas.setup = () => {
            const mainCanvas = canvas.createCanvas(canvasWidth, canvasHeight);
            mainCanvas.parent("sketchCanvas");

            $(`#canvasZoom`).val(zoomFactor + "x");
            canvas.setupZoomHandlers();

            new SketchActions(canvas, canvasColor);
            //create a toolbox for storing the tools
            toolbox = new Toolbox();

            //add the tools to the toolbox.
            toolbox.addTool(new FreehandTool(canvas));
            toolbox.addTool(new LineToTool(canvas));
            toolbox.addTool(new SprayCanTool(canvas));
            toolbox.addTool(new MirrorDrawTool(canvas));
            isSetup = true;

            canvas.background(canvasColor);
        };

        canvas.draw = () => {
            if (!isSetup) return;
            toolbox.selectedTool.draw();
        };

        canvas.mouseMoved = () => canvas.trackMouseOverCanvas();
        canvas.mouseDragged = () => canvas.trackMouseOverCanvas();

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

        canvas.trackMouseOverCanvas = () => {
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
