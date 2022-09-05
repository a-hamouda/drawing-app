/**
 * Mirror drawing tool Symmetry configurator.
 */
class Symmetry extends ToolOption {
    /**
     * Axis of symmetry line.
     *
     * @type {"x" | "y"}
     */
    #axis;

    /**
     * HTML structure of the option's elements.
     *
     * @type {string}
     */
    #html = `
<fieldset id="${this.id}" class="form-group border rounded-1 p-3" style="display: none">
    <legend class="float-none w-auto ps-2 pe-2 fs-6">${this.optionTitle}</legend>
    <div class="btn-group w-100" role="group" aria-label="Basic radio toggle button group">
        <input type="radio" class="btn-check" name="btnradio" id="${this.toolId}VerticalToggle" autocomplete="off" checked>
        <label class="btn btn-outline-primary w-50" for="${this.toolId}VerticalToggle">Vertical</label>

        <input type="radio" class="btn-check" name="btnradio" id="${this.toolId}HorizontalToggle" autocomplete="off">
        <label class="btn btn-outline-primary w-50" for="${this.toolId}HorizontalToggle">Horizontal</label>
    </div>
</fieldset>
`;

    constructor(toolId, optionTitle, onChanged) {
        super(toolId, optionTitle, onChanged);
        this.#axis = "x";
        const properties = $(`#toolOptions`);
        properties.append(this.#html);
        this.#setToggleHandler();
        this.onChanged(this.#axis);
    }

    /**
     * Setup toggle buttons handler.
     */
    #setToggleHandler() {
        const verticalToggle = $("#" + this.toolId + "VerticalToggle");
        verticalToggle.on("click", () => {
            this.#axis = "x";
            this.onChanged(this.#axis);
        });

        const horizontalToggle = $("#" + this.toolId + "HorizontalToggle");
        horizontalToggle.on("click", () => {
            this.#axis = "y";
            this.onChanged(this.#axis);
        });
    }
}
