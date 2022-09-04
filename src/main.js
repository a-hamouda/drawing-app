jQuery(function () {
    const sketchConfiguration = new SketchConfiguration(function (configuration) {
        $("#sketchCanvas").height(configuration.canvasHeight).width(configuration.canvasWidth);
        $("#appInterface").addClass("d-flex flex-column")
        $("#sketchTitle").text(configuration.sketchName);
        $(`#canvasInfoWidth`).text(configuration.canvasWidth + "px");
        $(`#canvasInfoHeight`).text(configuration.canvasHeight + "px");
        const app = new p5(sketch(configuration.canvasColor, configuration.canvasWidth, configuration.canvasHeight));
    });
});
