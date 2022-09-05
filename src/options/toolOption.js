class ToolOption {
    constructor(toolId, name) {
        if (this.constructor === ToolOption) throw new Error("Cannot instantiate abstract classes");
        this.toolId = toolId;
        this.name = name;
    }

    show() {
        $('#' + this.toolId + this.name).show();
    }

    hide() {
        $('#' + this.toolId + this.name).hide();
    }
}
