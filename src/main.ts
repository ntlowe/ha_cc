import {DomIds, ViewProps} from "./lib/view/viewprops";
import {View} from "./lib/view/view";
import {jsonToDrawingElements} from "./lib/geo/io/planargraph";

const defaultText = `{
   "vertices": [[0, 0], [2, 0], [2, 2], [0, 2]],
   "edges": [[0, 1], [1, 2], [0, 2], [0, 3], [2, 3]]
}`;

function main(): void {

   // instantiate options for the simple html view
   let props = new ViewProps();
   props.viewWidth = 400;
   props.viewHeight = 400;
   props.viewMargin = 2;
   props.defaultText = defaultText;
   props.jsonToDrawingElements = jsonToDrawingElements;

   // set id relations for dom elements
   let domIds = new DomIds();
   domIds.mainContentRowId = "main-row";
   domIds.domSvgId = "svg-canvas";
   domIds.jsonErrLabel = "error-label";
   domIds.jsonInputId = "submit-json-input";
   domIds.buttonId = "btn";

   // a very lite view control layer (would normally employ a framework: vue.js or react.js)
   let view = new View(props, domIds);

   // starts listening for button click basically
   view.listenForChanges();
}

main();