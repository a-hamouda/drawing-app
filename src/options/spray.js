class Spray extends ToolOption {
    /**
     * @type {{weight: number, spread: number}}
     */
    #config = {weight: 15, spread: 12};
    /**
     * @type {function({weight: number, spread: number})}
     */
    #onChanged;

    #html = `
<fieldset id="${this.toolId}${this.name}" class="form-group border rounded-1 p-3" style="display: none">
    <legend class="float-none w-auto ps-2 pe-2 fs-6">Spray</legend>
    <div class="row">
        <div class="row-cols-auto input-group">
            <span class="input-group-text border-dark" style="width: 25%"><p class="m-auto">Weight</p></span>
            <input class="form-control text-center border-dark" type="number" id="${this.toolId}SprayWeight" min=1 step=1 value=${this.#config.weight}>
            <span class="input-group-text border-dark">px</span>
        </div>
        <div class="row-cols-auto input-group">
            <span class="input-group-text border-dark" style="width: 25%"><p class="m-auto">Spread</p></span>
            <input class="form-control text-center border-dark" type="number" id="${this.toolId}SpraySpread" min=1 step=1 value=${this.#config.spread}>
            <span class="input-group-text border-dark">px</span>
        </div>
    </div>
</fieldset>
`;

    constructor(toolId, onChanged) {
        super(toolId, "Spray");
        this.#onChanged = onChanged;
        const properties = $(`#toolOptions`);
        properties.append(this.#html);
        this.#setInputHandlers();
        this.#onChanged(this.#config);
    }

    #setInputHandlers() {
        const weightInput = $("#" + this.toolId + "SprayWeight");
        weightInput.on("input change", () => {
            const newValue = weightInput.val();
            if (newValue.length === 0 || newValue < 0.1) weightInput.val(0.1);
            this.#config.weight = newValue;
            this.#onChanged(this.#config);
        });

        const spreadInput = $("#" + this.toolId + "SpraySpread");
        spreadInput.on("input change", () => {
            const newValue = spreadInput.val();
            if (newValue.length === 0 || newValue < 0.1) weightInput.val(0.1);
            this.#config.weight = newValue;
            this.#onChanged(this.#config);
        });
    }
}
