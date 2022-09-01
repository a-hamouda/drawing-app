//container object for storing the tools. Functions to add new tools and select a tool
class Toolbox {
    constructor() {
        this.tools = [];
        this.selectedTool = null;
    }

    //add a tool to the tools array
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

    //add a new tool icon to the html page
    addToolIcon(icon, name) {
        const sideBarItem = $(`<img class="sideBarItem" width="42px" id=${name} alt="tool icon" src="${icon}">`);
        sideBarItem.on("click", () => this.toolbarItemClick(name));
        sideBarItem.appendTo($(`#toolbar`));
    };

    toolbarItemClick(name) {
        //remove any existing borders
        const sideBarItems = $(`.sideBarItem`);
        for (const sideBarItem of sideBarItems) {
            $(sideBarItem).css("background-color", "transparent");
        }
        this.selectTool(name);
    };

    selectTool(toolName) {
        //search through the tools for one that's name matches
        //toolName
        for (let i = 0; i < this.tools.length; i++) {
            if (this.tools[i].name === toolName) {
                //if the tool has an unselectTool method run it.
                if (this.selectedTool != null && this.selectedTool.hasOwnProperty("unselectTool")) {
                    this.selectedTool.unselectTool();
                }
                //select the tool and highlight it on the toolbar
                this.selectedTool = this.tools[i];
                $(`#${toolName}`).css("background-color", "blue");
            }
        }
    }
}
