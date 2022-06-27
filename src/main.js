jQuery(function () {
    let navBar;
    const sketchConfiguration = new SketchConfiguration(function (configuration) {
        navBar = new NavBar(configuration.sketchName, configuration.canvasColor);
        $("#sketchCanvas").height(configuration.canvasHeight).width(configuration.canvasWidth);
        $("#appInterface").css('display', 'block');
        setup(configuration.canvasColor, configuration.canvasWidth, configuration.canvasHeight);
    });
});