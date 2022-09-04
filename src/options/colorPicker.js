class ColorPicker extends ToolOption {
    #wheelRadius = 75;
    #selectedColor = '#000';
    #rgba = Uint8ClampedArray.from([0, 0, 0, 255]);

    #html = `
        <fieldset id="${this.toolId}ColorPickerFieldSet" class="form-group border rounded-1 p-3" style="display: none">
            <legend class="float-none w-auto ps-2 pe-2 fs-6">Stroke Color</legend>
                <div class="row">
                    <div class="col">
                        <div class="input-group">
                            <div class="input-group-text colorPickerRGBALabel">R</div>
                            <input class="colorPickerInput" id="${this.toolId}ColorPickerRedInput" max="255" min="0" type="number" value=${this.#rgba[0]}>
                        </div>
                        <div class="input-group pt-1">
                            <div class="input-group-text colorPickerRGBALabel">G</div>
                            <input class="colorPickerInput" id="${this.toolId}ColorPickerGreenInput" max="255" min="0" type="number" value=${this.#rgba[1]}>
                        </div>
                        <div class="input-group pt-1">
                            <div class="input-group-text colorPickerRGBALabel" >B</div>
                            <input class="colorPickerInput" id="${this.toolId}ColorPickerBlueInput" max="255" min="0" type="number" value=${this.#rgba[2]}>
                        </div>
                        <div class="input-group pt-1">
                            <div class="input-group-text colorPickerRGBALabel" >A</div>
                            <input class="colorPickerInput" id="${this.toolId}ColorPickerAlphaInput" max="255" min="0" type="number" value="${this.#rgba[3]}">
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
        </fieldset>`;

    constructor(toolId) {
        super(toolId);
        const properties = $(`#toolOptions`);
        properties.append(this.#html);

        const context = $("#" + this.toolId + "ColorPickerCanvas").get(0).getContext('2d');
        const colorWheel = new Image();
        colorWheel.src = "./assets/color_wheel.svg";
        colorWheel.onload = () => context.drawImage(colorWheel, 0, 0, this.#wheelRadius * 2, this.#wheelRadius * 2);
        this.#setColorSelectHandler();
        this.#setOnColorWheelHoverHandler();
        this.#setRGBAInputHandlers();
    }

    show() {
        $('#' + this.toolId + "ColorPickerFieldSet").show();
    }

    hide() {
        $('#' + this.toolId + "ColorPickerFieldSet").hide();
    }

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

    #setColorSelectHandler() {
        const canvas = $("#" + this.toolId + "ColorPickerCanvas");
        canvas.on('click', (event) => {
            if (!this.#isOverColorWheel(event, canvas)) return;
            this.#rgba = this.#getPointedColor(event);
            $("#" + this.toolId + "ColorPickerRedInput").val(this.#rgba[0]);
            $("#" + this.toolId + "ColorPickerGreenInput").val(this.#rgba[1]);
            $("#" + this.toolId + "ColorPickerBlueInput").val(this.#rgba[2]);
            $("#" + this.toolId + "ColorPickerAlphaInput").val(this.#rgba[3]);
            this.#updateColorPreview();
        });
    }

    #setRGBAInputHandlers() {
        const redInput = $("#" + this.toolId + "ColorPickerRedInput");
        redInput.on('change', () => {
            const newValue = redInput.val();
            if (newValue.length === 0) redInput.val(0);
            if (newValue < 0 || newValue > 255) return;
            this.#rgba[0] = newValue;
            this.#updateColorPreview();
        });

        const greenInput = $("#" + this.toolId + "ColorPickerGreenInput");
        greenInput.on('change', () => {
            const newValue = greenInput.val();
            if (newValue.length === 0) greenInput.val(0);
            if (newValue < 0 || newValue > 255) return;
            this.#rgba[1] = newValue;
            this.#updateColorPreview();
        });

        const blueInput = $("#" + this.toolId + "ColorPickerBlueInput");
        blueInput.on('change', () => {
            const newValue = blueInput.val();
            if (newValue.length === 0) blueInput.val(0);
            if (newValue < 0 || newValue > 255) return;
            this.#rgba[2] = newValue;
            this.#updateColorPreview();
        });

        const alphaInput = $("#" + this.toolId + "ColorPickerAlphaInput");
        alphaInput.on('change', () => {
            const newValue = alphaInput.val();
            if (newValue.length === 0) alphaInput.val(0);
            if (newValue < 0 || newValue > 255) return;
            this.#rgba[3] = newValue;
            this.#updateColorPreview();
        });
    }

    #updateColorPreview() {
        this.#selectedColor = ColorPicker.#RGBAToHexA(this.#rgba);
        $("#" + this.toolId + "ColorPickerPreview").css("background-color", `${this.#selectedColor}`);
        $("#" + this.toolId + "ColorPickerTempPreview").css("background-color", `${this.#selectedColor}`);
    }

    #isOverColorWheel(event) {
        const canvas = $("#" + this.toolId + "ColorPickerCanvas");
        const mouseX = event.pageX;
        const mouseY = event.pageY;
        const wheelCenterX = $(canvas).offset().left + this.#wheelRadius;
        const wheelCenterY = $(canvas).offset().top + this.#wheelRadius;
        return Math.sqrt(Math.pow((wheelCenterX - mouseX), 2) + Math.pow((wheelCenterY - mouseY), 2)) < this.#wheelRadius;
    }

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
     * @param {Uint8ClampedArray} rgba
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
