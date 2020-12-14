import { Core } from "./Core";
import { Library } from "../Libs/Library";
import { Layer } from "../Layers/Layer";
import { MachineMessage } from '../Helpers/MachineMessage';
export declare class Machine {
    protected _core: Core;
    protected _libraries: {
        [key: string]: Library;
    };
    protected _layer: Layer;
    constructor();
    call: (func: () => void) => void;
    include(lib: Library): void;
    exclude(lib: Library): void;
    run(layer: Layer): void;
    readonly running: boolean;
    terminate(): void;
    handleMessage(m: MachineMessage): void;
    protected handleError(e: any): void;
    protected prepareLibs(): {
        [k: string]: any;
    };
}
