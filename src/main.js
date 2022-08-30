jQuery(function () {
    const sketchConfiguration = new SketchConfiguration(function (configuration) {
        $("#sketchCanvas").height(configuration.canvasHeight).width(configuration.canvasWidth);
        $("#appInterface").css('display', 'block');
        $("#navbarTitle").text(configuration.sketchName);
        const app = new p5(sketch(configuration.canvasColor, configuration.canvasWidth, configuration.canvasHeight));
    });
});
