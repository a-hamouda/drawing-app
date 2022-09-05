/**
 * Abstract class for Tool Options.
 */
class ToolOption {
    /**
     *
     * @param {string} toolId - id of the tool.
     * @param {string} optionTitle - title of the option.
     * @param onChanged - callback for when the option was reconfigured.
     */
    constructor(toolId, optionTitle, onChanged) {
        if (this.constructor === ToolOption) throw new Error("Cannot instantiate abstract classes");
        this.toolId = toolId;
        this.optionTitle = optionTitle;
        /**
         * Callback to execute when option has new configuration.
         *
         * @type function(*)
         */
        this.onChanged = onChanged;
    }

    /**
     * ID of the option.
     * 
     * @return {string}
     */
    get id() {
        const normalizedToolId = this.toolId.replaceAll(" ", "");
        const normalizedOptionTitle = this.optionTitle.replaceAll(" ", "");
        return normalizedToolId + normalizedOptionTitle;
    };

    /**
     * Show the option.
     */
    show() {
        $('#' + this.id).show();
    }

    /**
     * Hide the option.
     */
    hide() {
        $('#' + this.id).hide();
    }
}
