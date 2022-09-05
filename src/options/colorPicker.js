/**
 * Painting tool Color Picker.
 */
class ColorPicker extends ToolOption {
    /**
     * Radius of the color wheel.
     *
     * @type {number}
     */
    #wheelRadius = 75;
    /**
     * Current selected color in HEX.
     *
     * @type {string}
     */
    #selectedColor = '#000';
    /**
     * Current selected color in RGBA format.
     *
     * @type {Uint8ClampedArray}
     */
    #rgba = Uint8ClampedArray.from([0, 0, 0, 255]);

    /**
     * HTML structure of the option's elements.
     *
     * @type {string}
     */
    #html = `
<fieldset id="${this.id}" class="form-group border rounded-1 p-3" style="display: none">
    <legend class="float-none w-auto ps-2 pe-2 fs-6">${this.optionTitle}</legend>
    <div class="row">
        <div class="col">
            <div class="input-group">
                <span class="input-group-text border-dark colorPickerRGBALabel">R</span>
                <input class="form-control text-center border-dark" id="${this.toolId}ColorPickerRedInput" max="255" min="0" type="number" value=${this.#rgba[0]}>
            </div>
            <div class="input-group pt-1">
                <span class="input-group-text colorPickerRGBALabel border-dark">G</span>
                <input class="form-control text-center border-dark" id="${this.toolId}ColorPickerGreenInput" max="255" min="0" type="number" value=${this.#rgba[1]}>
            </div>
            <div class="input-group pt-1">
                <span class="input-group-text colorPickerRGBALabel border-dark" >B</span>
                <input class="form-control text-center border-dark" id="${this.toolId}ColorPickerBlueInput" max="255" min="0" type="number" value=${this.#rgba[2]}>
            </div>
            <div class="input-group pt-1">
                <span class="input-group-text colorPickerRGBALabel border-dark" >A</span>
                <input class="form-control text-center border-dark" id="${this.toolId}ColorPickerAlphaInput" max="255" min="0" type="number" value="${this.#rgba[3]}">
            </div>
        </div>
        <div class="col-auto">
            <canvas class="pt-1" id="${this.toolId}ColorPickerCanvas" style="cursor: default;" width="${this.#wheelRadius * 2}px" height="${this.#wheelRadius * 2}px"></canvas>
        </div>
    </div>
    <div class="d-flex align-content-center justify-content-center pt-3">
        <div class="row w-50" style="height: 25px;">
            <div class="col" id="${this.toolId}ColorPickerPreview" style="background-color: ${this.#selectedColor};"></div>
            <div class="col" id="${this.toolId}ColorPickerTempPreview" style="background-color: ${this.#selectedColor};"></div>
        </div>
    </div>
</fieldset>
`;

    constructor(toolId, optionTitle, onChanged) {
        super(toolId, optionTitle, onChanged);
        const properties = $(`#toolOptions`);
        properties.append(this.#html);

        const context = $("#" + this.toolId + "ColorPickerCanvas").get(0).getContext('2d');
        const colorWheel = new Image();
        colorWheel.src = "./assets/color_wheel.svg";
        colorWheel.onload = () => context.drawImage(colorWheel, 0, 0, this.#wheelRadius * 2, this.#wheelRadius * 2);
        this.#setColorSelectHandler();
        this.#setOnColorWheelHoverHandler();
        this.#setRGBAInputHandlers();
        this.onChanged(this.#selectedColor);
    }

    /**
     * Setup mouse on color wheel handler. Changes cursor and temporary preview color.
     */
    #setOnColorWheelHoverHandler() {
        const canvas = $("#" + this.toolId + "ColorPickerCanvas");
        canvas.on("mousemove", (event) => {
            if (!this.#isOverColorWheel(event)) {
                $(canvas).css("cursor", 'default');
                return;
            }
            $(canvas).css("cursor", 'pointer');
            const hexColor = ColorPicker.#RGBAToHexA(this.#getPointedColor(event));
            $("#" + this.toolId + "ColorPickerTempPreview").css("background-color", `${hexColor}`);

        });

        canvas.on("mouseleave", () => {
            $("#" + this.toolId + "ColorPickerTempPreview").css("background-color", `${this.#selectedColor}`);
        });
    }

    /**
     * Setup selected color handler. Changes both preview, and temporary preview colors.
     */
    #setColorSelectHandler() {
        const canvas = $("#" + this.toolId + "ColorPickerCanvas");
        canvas.on('click', (event) => {
            if (!this.#isOverColorWheel(event, canvas)) return;
            this.#rgba = this.#getPointedColor(event);
            $("#" + this.toolId + "ColorPickerRedInput").val(this.#rgba[0]);
            $("#" + this.toolId + "ColorPickerGreenInput").val(this.#rgba[1]);
            $("#" + this.toolId + "ColorPickerBlueInput").val(this.#rgba[2]);
            $("#" + this.toolId + "ColorPickerAlphaInput").val(this.#rgba[3]);
            this.#updateColor();
        });
    }

    /**
     * Setup input fields handlers.
     */
    #setRGBAInputHandlers() {
        const redInput = $("#" + this.toolId + "ColorPickerRedInput");
        redInput.on('input change', () => {
            const newValue = +redInput.val();
            if (newValue.length === 0) redInput.val(0);
            if (newValue < 0 || newValue > 255) return;
            this.#rgba[0] = newValue;
            this.#updateColor();
        });

        const greenInput = $("#" + this.toolId + "ColorPickerGreenInput");
        greenInput.on('input change', () => {
            const newValue = greenInput.val();
            if (newValue.length === 0) greenInput.val(0);
            if (newValue < 0 || newValue > 255) return;
            this.#rgba[1] = +newValue;
            this.#updateColor();
        });

        const blueInput = $("#" + this.toolId + "ColorPickerBlueInput");
        blueInput.on('input change', () => {
            const newValue = blueInput.val();
            if (newValue.length === 0) blueInput.val(0);
            if (newValue < 0 || newValue > 255) return;
            this.#rgba[2] = +newValue;
            this.#updateColor();
        });

        const alphaInput = $("#" + this.toolId + "ColorPickerAlphaInput");
        alphaInput.on('input change', () => {
            const newValue = alphaInput.val();
            if (newValue.length === 0) alphaInput.val(0);
            if (newValue < 0 || newValue > 255) return;
            this.#rgba[3] = +newValue;
            this.#updateColor();
        });
    }

    /**
     * Update current selected color and executes callback to notify about color changes.
     */
    #updateColor() {
        this.#selectedColor = ColorPicker.#RGBAToHexA(this.#rgba);
        $("#" + this.toolId + "ColorPickerPreview").css("background-color", `${this.#selectedColor}`);
        $("#" + this.toolId + "ColorPickerTempPreview").css("background-color", `${this.#selectedColor}`);
        this.onChanged(this.#selectedColor);
    }

    /**
     * Check mouse is on color wheel.
     *
     * @param {MouseEvent} event - mouse event.
     * @return {boolean} - mouse is on color wheel.
     */
    #isOverColorWheel(event) {
        const canvas = $("#" + this.toolId + "ColorPickerCanvas");
        const mouseX = event.pageX;
        const mouseY = event.pageY;
        const wheelCenterX = $(canvas).offset().left + this.#wheelRadius;
        const wheelCenterY = $(canvas).offset().top + this.#wheelRadius;
        return Math.sqrt(Math.pow((wheelCenterX - mouseX), 2) + Math.pow((wheelCenterY - mouseY), 2)) < this.#wheelRadius;
    }

    /**
     * Get color of the pixel under the mouse pointer.
     *
     * @param {MouseEvent} event - mouse event.
     * @return {Uint8ClampedArray} - color in RGBA format.
     */
    #getPointedColor(event) {
        const canvas = $("#" + this.toolId + "ColorPickerCanvas");
        const context = canvas.get(0).getContext("2d");
        const relativeX = event.pageX - $(canvas).offset().left;
        const relativeY = event.pageY - $(canvas).offset().top;
        return context.getImageData(relativeX, relativeY, 1, 1).data;
    }

    /**
     * Convert from list of rgba values to hex color.
     *
     * @param {Uint8ClampedArray} rgba - color in RGBA format.
     */
    static #RGBAToHexA(rgba) {
        let r = rgba[0].toString(16);
        let g = rgba[1].toString(16);
        let b = rgba[2].toString(16);
        let a = rgba[3].toString(16);

        if (r.length === 1) r = "0" + r;
        if (g.length === 1) g = "0" + g;
        if (b.length === 1) b = "0" + b;
        if (a.length === 1) a = "0" + a;

        return "#" + r + g + b + a;
    }
}
