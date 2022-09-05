class SketchConfiguration {
    /**
     * Create an instance of SketchConfiguration.
     * SketchConfiguration is responsible for setting up the canvas.
     *
     * @param {function(SketchConfiguration): void} onPopupDismissed
     */
    constructor(onPopupDismissed) {
        this.#sketchName = 'Demo Sketch';
        this.#canvasWidth = 908;
        this.#canvasHeight = 500;
        this.#canvasColor = SketchConfiguration.#colors[0].value;
        this.#initializeFormFields(onPopupDismissed);

        SketchConfiguration.#toggleSetupPopup();
        this.#setupBackgroundColorsList();
        this.#registerSketchNameListener();
        this.#registerCanvasWidthListener();
        this.#registerCanvasHeightListener();
        this.#registerCanvasColorListener();
    }

    /**
     * Allowed canvas background colors.
     */
    static #colors = [{name: 'White', value: '#ffffff'}, {name: 'Grey', value: '#808080'}, {
        name: 'Black', value: '#000000'
    }];

    /**
     * Name of the current sketch.
     *
     * @type {string}
     */
    #sketchName;

    /**
     * Getter for the sketch name.
     * @return {string}
     */
    get sketchName() {
        return this.#sketchName;
    }

    /**
     * Sketch name input field handler.
     *
     * @return {string}
     */
    #registerSketchNameListener() {
        let self = this;
        $("#sketchName").on('input', function (e) {
            self.#sketchName = $(e.currentTarget).val();
        });
    }

    /**
     * Width of the canvas.
     *
     * @type {number}
     */
    #canvasWidth;

    /**
     * Getter for the canvas width.
     *
     * @return {number}
     */
    get canvasWidth() {
        return this.#canvasWidth;
    }

    /**
     * Canvas width input field change handler.
     *
     * @return {number}
     */
    #registerCanvasWidthListener() {
        let self = this;
        $("#canvasWidth").on('input', function (e) {
            self.#canvasWidth = $(e.currentTarget).val();
        });
    }

    /**
     * Height of the canvas.
     *
     * @type {number}
     */
    #canvasHeight;

    /**
     * Getter for the canvas height.
     *
     * @return {number}
     */
    get canvasHeight() {
        return this.#canvasHeight;
    }

    /**
     * Canvas height input field change handler.
     *
     * @return {number}
     */
    #registerCanvasHeightListener() {
        let self = this;
        $("#canvasHeight").on('input', function (e) {
            self.#canvasHeight = $(e.currentTarget).val();
        });
    }


    /**
     * Background color of the canvas.
     *
     * @type {string}
     */
    #canvasColor;

    /**
     * Getter for the canvas color.
     *
     * @return {string}
     */
    get canvasColor() {
        return this.#canvasColor;
    }

    #registerCanvasColorListener() {
        let self = this;
        $('#colorsList').on('click', 'li', function (e) {
            let value = $(e.currentTarget).attr('value');
            self.#canvasColor = value;
            SketchConfiguration.#setBackgroundColor(value);
        });
    }

    /**
     * Toggle sketch setup popup.
     */
    static #toggleSetupPopup() {
        $('#setupPopup').modal('toggle');
    }

    /**
     * Initialize form fields with default values.
     *
     * @param {function(SketchConfiguration): void} onPopupDismissed
     */
    #initializeFormFields(onPopupDismissed) {
        let self = this;
        $("#sketchName").attr('value', this.sketchName);
        $("#canvasWidth").attr('value', this.canvasWidth);
        $("#canvasHeight").attr('value', this.canvasHeight);
        $("#canvasColor").css('background-color', this.canvasColor);
        $("#startDrawing").on('click', function () {
            SketchConfiguration.#toggleSetupPopup();
            onPopupDismissed(self);
        });
    }

    /**
     * Add colors to the colors list.
     */
    #setupBackgroundColorsList() {
        const colorsListItems = SketchConfiguration.#colors.map(function (color) {
            return SketchConfiguration.#createColorListItem(color);
        });
        $('#colorsList').append(colorsListItems);
    }

    /**
     * Create html structure of a color item in the background colors' dropdown.
     * @param {Object} color
     */
    static #createColorListItem(color) {
        return $('<li></li>')
            .addClass('dropdown-item')
            .attr('value', color.value)
            .text(color.name);
    }

    /**
     * Set background color for the canvas.
     * @param {string} color
     */
    static #setBackgroundColor(color) {
        $('#canvasColor')
            .css('background-color', color);
    }
}
