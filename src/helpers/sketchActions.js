class SketchActions {
    constructor(canvas, toolbox, backgroundColor) {
        this.canvas = canvas;
        this.toolbox = toolbox;
        this.backgroundColor = backgroundColor;
        this.#setupActionList();
    }
    
    #setupActionList() {
        const self = this;
        $('#saveImageAction').on('click', () => {
            const sketchName = $("#sketchTitle").text();
            self.canvas.saveCanvas(sketchName, "jpg");
        });

        $('#clearAction').on('click', () => {
            self.canvas.background(this.backgroundColor);
            self.toolbox.clearDrawingLayers();
            self.canvas.loadPixels();
        });
    }
}
