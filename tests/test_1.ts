import {Machine} from "../Core/Machine";
import {SafeCodeLayer} from "../Layers/SafeCodeLayer";
import {TypeScriptCodeLayer} from "../Layers/TypeScriptCodeLayer";

import {transpileModule} from "typescript";

let machine = new Machine();

let bug1Found = false;

let typeScriptCodeLayer1 = new TypeScriptCodeLayer(transpileModule, "");

let safeCodeLayer1 = new SafeCodeLayer(typeScriptCodeLayer1);
machine.include(safeCodeLayer1.lib);

typeScriptCodeLayer1.setOnError((e) => {
    bug1Found = true;
    console.error(e);
});

machine.run(safeCodeLayer1);

let running1 = false;
if (machine.running) {
    running1 = true;
}

machine.terminate();

let typeScriptCodeLayer = new TypeScriptCodeLayer(transpileModule, `
console.log("Started");
var a:string = "ab:";
var b:number = 55;

let fnc = (c) => {
    console.log(a+b+c);
};

fnc(" :-)");

bug;

`);

let safeCodeLayer = new SafeCodeLayer(typeScriptCodeLayer);
machine.include(safeCodeLayer.lib);

let bugFound = false;

typeScriptCodeLayer.setOnError((e) => {
    console.log(e.toString());
    if (e.toString() == "SafeMachineError: ReferenceError: bug is not defined") {
        bugFound = true;
    } else {
        console.error(e);
    }
});

machine.run(safeCodeLayer);


setTimeout(() => {
    machine.terminate();
    if (!bug1Found) {
        console.log(" > TEST1 OK");
    } else {
        console.log(" > TEST1 FAILED");
    }

    if (running1) {
        console.log(" > TEST2 OK");
    } else {
        console.log(" > TEST2 FAILED");
    }

    if (bugFound) {
        console.log(" > TEST3 OK");
    } else {
        console.log(" > TEST3 FAILED");
    }
}, 1200);

