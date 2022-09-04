class ToolOption {
    constructor(toolId) {
        if (this.constructor === ToolOption) throw new Error("Cannot instantiate abstract classes");
        this.toolId = toolId;
    }

    show() {

    }

    hide() {

    }
}
