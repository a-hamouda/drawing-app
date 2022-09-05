class StrokeWeight extends ToolOption {
    #weight = 1;
    /**
     * @type {function(number)}
     */
    #onChanged;

    #html = `
<fieldset id="${this.toolId}${this.name}" class="form-group border rounded-1 p-3" style="display: none">
    <legend class="float-none w-auto ps-2 pe-2 fs-6">Stroke Weight</legend>
    <div class="input-group flex-nowrap">
        <input class="form-control text-center border-dark" type="number" id="${this.toolId}StrokeWeightInput" min=0.1 step=0.1 value=${this.#weight}>
        <span class="input-group-text border-dark">px</span>
    </div>
</fieldset>
`;

    constructor(toolId, onChanged) {
        super(toolId, "StrokeWeight");
        this.#onChanged = onChanged;
        const properties = $(`#toolOptions`);
        properties.append(this.#html);
        this.#setInputHandler();
        this.#onChanged(this.#weight);
    }

    #setInputHandler() {
        const input = $("#" + this.toolId + "StrokeWeightInput");
        input.on('input change', () => {
            const newValue = input.val();
            if (newValue.length === 0) input.val(0.1);
            this.#weight = newValue;
            this.#onChanged(this.#weight);
        });
    }
}
