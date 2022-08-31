function SprayCanTool(canvas) {

    this.name = "sprayCanTool";
    this.icon = "assets/icons/spray-tool.svg";

    const points = 13;
    const spread = 10;

    this.draw = function () {
        if (canvas.mouseIsPressed) {
            for (let i = 0; i < points; i++) {
                canvas.point(
                    canvas.random(canvas.mouseX - spread, canvas.mouseX + spread),
                    canvas.random(canvas.mouseY - spread, canvas.mouseY + spread)
                );
            }
        }
    };
}
