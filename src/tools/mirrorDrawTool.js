function MirrorDrawTool(canvas) {
    this.name = "mirrorDraw";
    this.icon = "assets/mirrorDraw.jpg";

    //which axis is being mirrored (x or y) x is default
    this.axis = "x";
    //line of symmetry is halfway across the screen
    this.lineOfSymmetry = canvas.width / 2;

    //this changes in the jquery click handler. So storing it as
    //a variable self now means we can still access it in the handler
    const self = this;

    //where was the mouse on the last time draw was called.
    //set it to -1 to begin with
    let previousMouseX = -1;
    let previousMouseY = -1;

    //mouse coordinates for the other side of the Line of symmetry.
    let previousOppositeMouseX = -1;
    let previousOppositeMouseY = -1;

    this.draw = function () {
        //display the last save state of pixels
        canvas.updatePixels();

        //do the drawing if the mouse is pressed
        if (canvas.mouseIsPressed) {
            //if the previous values are -1 set them to the current mouse location
            //and mirrored positions
            if (previousMouseX === -1) {
                previousMouseX = canvas.mouseX;
                previousMouseY = canvas.mouseY;
                previousOppositeMouseX = this.calculateOpposite(canvas.mouseX, "x");
                previousOppositeMouseY = this.calculateOpposite(canvas.mouseY, "y");
            }

                //if there are values in the previous locations
            //draw a line between them and the current positions
            else {
                canvas.line(previousMouseX, previousMouseY, canvas.mouseX, canvas.mouseY);
                previousMouseX = canvas.mouseX;
                previousMouseY = canvas.mouseY;

                //these are for the mirrored drawing the other side of the
                //line of symmetry
                const oX = this.calculateOpposite(canvas.mouseX, "x");
                const oY = this.calculateOpposite(canvas.mouseY, "y");
                canvas.line(previousOppositeMouseX, previousOppositeMouseY, oX, oY);
                previousOppositeMouseX = oX;
                previousOppositeMouseY = oY;
            }
        }
        //if the mouse isn't pressed reset the previous values to -1
        else {
            previousMouseX = -1;
            previousMouseY = -1;

            previousOppositeMouseX = -1;
            previousOppositeMouseY = -1;
        }

        //after the drawing is done save the pixel state. We don't want the
        //line of symmetry to be part of our drawing

        canvas.loadPixels();

        //push the drawing state so that we can set the stroke weight and colour
        canvas.push();
        canvas.strokeWeight(3);
        canvas.stroke("red");
        //draw the line of symmetry
        if (this.axis === "x") {
            canvas.line(canvas.width / 2, 0, canvas.width / 2, canvas.height);
        } else {
            canvas.line(0, canvas.height / 2, canvas.width, canvas.height / 2);
        }
        //return to the original stroke
        canvas.pop();

    };

    /*calculate an opposite coordinate the other side of the
     *symmetry line.
     *@param n number: location for either x or y coordinate
     *@param a [x,y]: the axis of the coordinate (y or y)
     *@return number: the opposite coordinate
     */
    this.calculateOpposite = function (n, a) {
        //if the axis isn't the one being mirrored return the same
        //value
        if (a !== this.axis) {
            return n;
        }

        //if n is less than the line of symmetry return a coordinate
        //that is far greater than the line of symmetry by the distance from
        //n to that line.
        if (n < this.lineOfSymmetry) {
            return this.lineOfSymmetry + (this.lineOfSymmetry - n);
        }

            //otherwise a coordinate that is smaller than the line of symmetry
        //by the distance between it and n.
        else {
            return this.lineOfSymmetry - (n - this.lineOfSymmetry);
        }
    };


    //when the tool is deselected update the pixels to just show the drawing and
    //hide the line of symmetry. Also clear options
    this.unselectTool = function () {
        canvas.updatePixels();
        //clear options
        $(".options").html("");
    };

    //adds a button and click handler to the options' area. When clicked
    //toggle the line of symmetry between horizontal to vertical
    this.populateOptions = function () {
        $(".options").html("<button id='directionButton'>Make Horizontal</button>");
        // 	//click handler
        $("#directionButton").on("click", function () {
            const button = $("#" + this.elt.id);
            if (self.axis === "x") {
                self.axis = "y";
                self.lineOfSymmetry = height / 2;
                button.html('Make Vertical');
            } else {
                self.axis = "x";
                self.lineOfSymmetry = width / 2;
                button.html('Make Horizontal');
            }
        });
    };
}
