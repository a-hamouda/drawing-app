class NavBar {
    /**
     * Top navigation bar of the sketch.
     *
     * @param {string} title;
     * @param {string} backgroundColor
     */
    constructor(title, backgroundColor) {
        // setup title
        $("#navbarTitle").text(title);

        NavBar.#setupActionList(title, backgroundColor);
    }

    /**
     * Setup actions for the sketch.
     *
     * @param {string} sketchName
     * @param {string} backgroundColor
     */
    static #setupActionList(sketchName, backgroundColor) {
        $('#saveImageAction').on('click', function () {
            saveCanvas(sketchName, "jpg");
        });

        $('#clearAction').on('click', function () {
            background(backgroundColor);
            loadPixels();
        });
    }
}