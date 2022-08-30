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
        const sideBarItem = createDiv(`<img alt="tool icon" src="${icon}"></div>`);
        sideBarItem.class('sideBarItem');
        sideBarItem.id(name);
        sideBarItem.parent('toolbar');
        sideBarItem.mouseClicked(() => this.toolbarItemClick(name));
    };

    toolbarItemClick(name) {
        //remove any existing borders
        const items = selectAll(".sideBarItem");
        for (let i = 0; i < items.length; i++) {
            items[i].style('border', '0');
        }

        this.selectTool(name);

        //call loadPixels to make sure most recent changes are saved to pixel array
        loadPixels();

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
                select("#" + toolName).style("border", "2px solid blue");

                //if the tool has an options' area. Populate it now.
                if (this.selectedTool.hasOwnProperty("populateOptions")) {
                    this.selectedTool.populateOptions();
                }
            }
        }
    }
}
