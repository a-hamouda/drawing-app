const sketch = (canvasColor, canvasWidth, canvasHeight) => {
    let toolbox = null;
    let isSetup = false;

    return (canvas) => {
        canvas.setup = () => {
            const mainCanvas = canvas.createCanvas(canvasWidth, canvasHeight);
            mainCanvas.parent("sketchCanvas");

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
            console.assert(toolbox.selectedTool.hasOwnProperty("draw"), "it doesn't look like your tool has a draw method!");
            toolbox.selectedTool.draw();
        };
    };
};
