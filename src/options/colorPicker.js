class ColorPicker {
    #wheelRadius = 75;
    #selectedColor = '#000';
    #rgba = Uint8ClampedArray.from([0, 0, 0, 255]);

    #html = `
        <fieldset id="colorPickerFieldSet" class="form-group border rounded-1 p-3">
            <legend class="float-none w-auto ps-2 pe-2 fs-6">Stroke Color</legend>
                <div class="row">
                    <div class="col">
                        <div class="input-group">
                            <div class="input-group-text colorPickerRGBALabel">R</div>
                            <input class="colorPickerInput" id="colorPickerRedInput" max="255" min="0" type="number" value=${this.#rgba[0]}>
                        </div>
                        <div class="input-group pt-1">
                            <div class="input-group-text colorPickerRGBALabel">G</div>
                            <input class="colorPickerInput" id="colorPickerGreenInput" max="255" min="0" type="number" value=${this.#rgba[1]}>
                        </div>
                        <div class="input-group pt-1">
                            <div class="input-group-text colorPickerRGBALabel" >B</div>
                            <input class="colorPickerInput" id="colorPickerBlueInput" max="255" min="0" type="number" value=${this.#rgba[2]}>
                        </div>
                        <div class="input-group pt-1">
                            <div class="input-group-text colorPickerRGBALabel" >A</div>
                            <input class="colorPickerInput" id="colorPickerAlphaInput" max="255" min="0" type="number" value="${this.#rgba[3]}">
                        </div>
                    </div>
                    <div class="col-auto">
                        <canvas class="pt-1" id="colorPickerCanvas" style="cursor: default;" width="${this.#wheelRadius * 2}px" height="${this.#wheelRadius * 2}px"></canvas>
                    </div>
                </div>
                <div class="d-flex align-content-center justify-content-center pt-3">
                    <div class="row w-50" style="height: 25px;">
                        <div class="col" id="colorPickerPreview" style="background-color: ${this.#selectedColor};"></div>
                        <div class="col" id="colorPickerTempPreview" style="background-color: ${this.#selectedColor};"></div>
                    </div>
                </div>
        </fieldset>`;

    constructor() {
        const properties = $(`#toolOptions`);
        properties.append(this.#html);

        const context = $(`#colorPickerCanvas`).get(0).getContext('2d');
        const colorWheel = new Image();
        colorWheel.src = "./assets/color_wheel.svg";
        colorWheel.onload = () => context.drawImage(colorWheel, 0, 0, this.#wheelRadius * 2, this.#wheelRadius * 2);
        this.#setColorSelectHandler();
        this.#setOnColorWheelHoverHandler();
        this.#setRGBAInputHandlers();
    }

    #setOnColorWheelHoverHandler() {
        const canvas = $(`#colorPickerCanvas`);
        canvas.on("mousemove", (event) => {
            if (!this.#isOverColorWheel(event)) {
                $(canvas).css("cursor", 'default');
                return;
            }
            $(canvas).css("cursor", 'pointer');
            const hexColor = ColorPicker.#RGBAToHexA(ColorPicker.#getPointedColor(event));
            $(`#colorPickerTempPreview`).css("background-color", `${hexColor}`);
        });

        canvas.on("mouseleave", () => {
            $(`#colorPickerTempPreview`).css("background-color", `${this.#selectedColor}`);
        });
    }

    #setColorSelectHandler() {
        const canvas = $(`#colorPickerCanvas`);
        canvas.on('click', (event) => {
            if (!this.#isOverColorWheel(event, canvas)) return;
            this.#rgba = ColorPicker.#getPointedColor(event);
            $(`#colorPickerRedInput`).val(this.#rgba[0]);
            $(`#colorPickerGreenInput`).val(this.#rgba[1]);
            $(`#colorPickerBlueInput`).val(this.#rgba[2]);
            $(`#colorPickerAlphaInput`).val(this.#rgba[3]);
            this.#updateColorPreview();
        });
    }

    #setRGBAInputHandlers() {
        const redInput = $(`#colorPickerRedInput`);
        redInput.on('change', () => {
            const newValue = redInput.val();
            if (newValue.length === 0) redInput.val(0);
            if (newValue < 0 || newValue > 255) return;
            this.#rgba[0] = newValue;
            this.#updateColorPreview();
        });

        const greenInput = $(`#colorPickerGreenInput`);
        greenInput.on('change', () => {
            const newValue = greenInput.val();
            if (newValue.length === 0) greenInput.val(0);
            if (newValue < 0 || newValue > 255) return;
            this.#rgba[1] = newValue;
            this.#updateColorPreview();
        });

        const blueInput = $(`#colorPickerBlueInput`);
        blueInput.on('change', () => {
            const newValue = blueInput.val();
            if (newValue.length === 0) blueInput.val(0);
            if (newValue < 0 || newValue > 255) return;
            this.#rgba[2] = newValue;
            this.#updateColorPreview();
        });

        const alphaInput = $(`#colorPickerAlphaInput`);
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
        $(`#colorPickerPreview`).css("background-color", `${this.#selectedColor}`);
        $(`#colorPickerTempPreview`).css("background-color", `${this.#selectedColor}`);
    }

    #isOverColorWheel(event) {
        const canvas = $(`#colorPickerCanvas`);
        const mouseX = event.pageX;
        const mouseY = event.pageY;
        const wheelCenterX = $(canvas).offset().left + this.#wheelRadius;
        const wheelCenterY = $(canvas).offset().top + this.#wheelRadius;
        return Math.sqrt(Math.pow((wheelCenterX - mouseX), 2) + Math.pow((wheelCenterY - mouseY), 2)) < this.#wheelRadius;
    }

    static #getPointedColor(event) {
        const canvas = $(`#colorPickerCanvas`);
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
