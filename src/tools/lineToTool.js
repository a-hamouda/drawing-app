//a tool for drawing straight lines to the screen. Allows the user to preview
//the line to the current mouse position before drawing the line to the
//pixel array.
function LineToTool(canvas) {
    this.icon = "assets/icons/line-tool.svg";
    this.name = "LineTo";

    let startMouseX = -1;
    let startMouseY = -1;
    let drawing = false;

    //draws the line to the screen
    this.draw = function () {

        //only draw when mouse is clicked
        if (canvas.mouseIsPressed) {
            //if it's the start of drawing a new line
            if (startMouseX === -1) {
                startMouseX = canvas.mouseX;
                startMouseY = canvas.mouseY;
                drawing = true;
                //save the current pixel Array
                canvas.loadPixels();
            } else {
                //update the screen with the saved pixels to hide any previous
                //line between mouse pressed and released
                canvas.updatePixels();
                //draw the line
                canvas.line(startMouseX, startMouseY, canvas.mouseX, canvas.mouseY);
            }

        } else if (drawing) {
            //save the pixels with the most recent line and reset the
            //drawing bool and start locations
            canvas.loadPixels();
            drawing = false;
            startMouseX = -1;
            startMouseY = -1;
        }
    };
}
