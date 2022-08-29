class ColorPicker {
    constructor() {
        const properties = $(`#toolProperties`);

        // create elements
        const colorsFieldSet = $(`<fieldset class="form-group border rounded-1 p-3 w-auto h-auto">`);
        const colorsLegend = $(`<legend class="float-none w-auto ps-2 pe-2 fs-6">`);
        const canvasDiv = $(`<div style="display:table;">`);
        const canvas = $(`<canvas style="display: table-row" width="300px" height="300px">`);

        // configure elements
        colorsLegend.text("Stroke Color");
        const context = canvas.get(0).getContext('2d');
        const colorWheel = new Image();
        colorWheel.src = "./assets/color_wheel.svg";
        colorWheel.onload = () => context.drawImage(colorWheel, 0, 0, 300, 300);

        // structure elements
        colorsLegend.appendTo(colorsFieldSet);
        canvas.appendTo(canvasDiv);
        canvasDiv.appendTo(colorsFieldSet);
        colorsFieldSet.appendTo(properties);
    }
}
