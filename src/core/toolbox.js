/**
 * Painting tools container.
 */
class Toolbox {
    constructor(canvasBackgroundColor) {
        /**
         * Paining tools.
         *
         * @type {Tool[]}
         */
        this.tools = [];
        /**
         * Current active tool.
         *
         * @type {Tool}
         */
        this.selectedTool = null;
        /**
         * Background color of the canvas.
         *
         * @type {string}
         */
        this.canvasBackgroundColor = canvasBackgroundColor;
    }

    /**
     * Add a painting tool.
     *
     * @param {Tool} tool
     */
    addTool(tool) {
        //check that the object tool has an icon and a name
        console.assert(tool.hasOwnProperty("icon") && tool.hasOwnProperty("name"),
            "make sure your tool has both a name and an icon");
        this.tools.push(tool);
        this.addToolIcon(tool.icon, tool.name);
        //if no tool is selected (i.e. none have been added so far)
        //make this tool the selected one.
        if (this.selectedTool == null) {
            this.selectTool(tool.name);
        }
    }

    /**
     * Add a new tool icon to the html page.
     *
     * @param {string} icon - icon image file path.
     * @param {string} name - name of the tool.
     */
    addToolIcon(icon, name) {
        const sideBarItem = $(`<img class="sideBarItem" width="42px" id=${name} alt="tool icon" src="${icon}">`);
        sideBarItem.on("click", () => this.toolbarItemClick(name));
        sideBarItem.appendTo($(`#toolbar`));
    };

    /**
     * Activate tool by name, and deactivate other tools.
     *
     * @param name - name of the tool.
     */
    toolbarItemClick(name) {
        const sideBarItems = $(`.sideBarItem`);
        for (const sideBarItem of sideBarItems) {
            $(sideBarItem).css("background-color", "transparent");
        }
        this.selectTool(name);
    };

    /**
     * Select a tool by name.
     *
     * @param {string} toolName - name of the painting tool.
     */
    selectTool(toolName) {
        //search through the tools for one that's name matches toolName
        for (let i = 0; i < this.tools.length; i++) {
            if (this.tools[i].name === toolName) {
                //if the tool has an unselectTool method run it.
                if (this.selectedTool != null) {
                    this.selectedTool.onUnselected();
                }
                //select the tool and highlight it on the toolbar
                this.selectedTool = this.tools[i];
                this.selectedTool.onSelected();
                $(`#${toolName}`).css("background-color", "blue");
            }
        }
    }

    /**
     * Clear all drawing layers of all tools.
     */
    clearDrawingLayers() {
        for (const tool of this.tools) {
            tool.clearDrawingLayer(this.canvasBackgroundColor);
        }
    }
}
