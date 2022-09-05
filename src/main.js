/**
 * Set up sketch when document loads.
 */
jQuery(function () {
    new SketchConfiguration(function (configuration) {
        // set size of canvas container.
        $("#sketchCanvas").height(configuration.canvasHeight).width(configuration.canvasWidth);
        // show sketch interface.
        $("#appInterface").addClass("d-flex flex-column");
        // set name of sketch.
        $("#sketchTitle").text(configuration.sketchName);
        // set canvas width on canvas info pane.
        $(`#canvasInfoWidth`).text(configuration.canvasWidth + "px");
        // set canvas height on canvas info pane.
        $(`#canvasInfoHeight`).text(configuration.canvasHeight + "px");
        // initialize sketch.
        new p5(sketch(configuration.canvasColor, configuration.canvasWidth, configuration.canvasHeight));
    });
});
