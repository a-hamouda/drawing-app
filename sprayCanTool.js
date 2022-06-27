function SprayCanTool() {

    this.name = "sprayCanTool";
    this.icon = "assets/sprayCan.jpg";

    const points = 13;
    const spread = 10;

    this.draw = function () {
        if (mouseIsPressed) {
            for (let i = 0; i < points; i++) {
                point(random(mouseX - spread, mouseX + spread), random(mouseY - spread, mouseY + spread));
            }
        }
    };
}