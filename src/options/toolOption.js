class ToolOption {
    /**
     *
     * @param {string} toolId
     * @param {string} optionTitle
     * @param onChanged
     */
    constructor(toolId, optionTitle, onChanged) {
        if (this.constructor === ToolOption) throw new Error("Cannot instantiate abstract classes");
        this.toolId = toolId;
        this.optionTitle = optionTitle;
        /**
         * Callback to execute when option has new configuration.
         *
         * @type function(string)
         */
        this.onChanged = onChanged;
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
