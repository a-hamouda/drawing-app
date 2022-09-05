class ToolOption {
    /**
     *
     * @param {string} toolId
     * @param {string} optionTitle
     */
    constructor(toolId, optionTitle) {
        if (this.constructor === ToolOption) throw new Error("Cannot instantiate abstract classes");
        this.toolId = toolId;
        this.optionTitle = optionTitle;
    }

    get id() {
        const normalizedToolId = this.toolId.replaceAll(" ", "");
        const normalizedOptionTitle = this.optionTitle.replaceAll(" ", "");
        return normalizedToolId + normalizedOptionTitle;
    };

    show() {
        $('#' + this.id).show();
    }

    hide() {
        $('#' + this.id).hide();
    }
}
