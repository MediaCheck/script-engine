import { CodeLayer } from "./CodeLayer";
import { SafeLib } from "../Libs/SafeLib";
import { Layer } from "./Layer";
export declare class SafeCodeLayer extends CodeLayer {
    protected _lib: SafeLib;
    constructor(source?: string | Layer);
    readonly lib: SafeLib;
    handleError(e: Error): void;
    protected prepareSource(src: string): string;
}
