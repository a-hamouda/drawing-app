class FreehandTool {
    //to smoothly draw we'll draw a line from the previous mouse location
    //to the current mouse location. The following values store
    //the locations from the last frame. They are -1 to start with because
    //we haven't started drawing yet.
    #previousMouseX = -1;
    #previousMouseY = -1;

    constructor(canvas) {
        //set an icon and a name for the object
        this.icon = "assets/icons/free-hand.svg";
        this.name = "freehand";
        this._canvas = canvas;

        FreehandTool.#populateOptions();
    }

    draw() {
        //if the mouse is pressed
        if (this._canvas.mouseIsPressed) {
            //check if they previousX and Y are -1. set them to the current
            //mouse X and Y if they are.
            if (this.#previousMouseX === -1) {
                this.#previousMouseX = this._canvas.mouseX;
                this.#previousMouseY = this._canvas.mouseY;
            }
                //if we already have values for previousX and Y we can draw a line from
            //there to the current mouse location
            else {
                this._canvas.line(this.#previousMouseX, this.#previousMouseY, this._canvas.mouseX, this._canvas.mouseY);
                this.#previousMouseX = this._canvas.mouseX;
                this.#previousMouseY = this._canvas.mouseY;
            }
        }
            //if the user has released the mouse we want to set the previousMouse values
            //back to -1.
        //try and comment out these lines and see what happens!
        else {
            this.#previousMouseX = -1;
            this.#previousMouseY = -1;
        }
    }

    static #populateOptions() {
        new ColorPicker();
    }
}
