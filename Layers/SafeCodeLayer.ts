import {CodeLayer} from "./CodeLayer";
import {JSSafeCode} from "../Helpers/JSSafeCode";
import {SafeMachineError} from "../Helpers/SafeMachineError";
import {SafeLib} from "../Libs/SafeLib";
import {Layer} from "./Layer";

/*
 *
 * Layer for translate JS source to safe code source
 * Its using safe code helper - so you can look there for any other specifications
 * It is automatically initialize safe code library.
 * You must import this library to your machine, every time, when you reinitialize this layer.
 */
export class SafeCodeLayer extends CodeLayer {
    protected _lib: SafeLib;

    constructor(source?: string | Layer) {
        super(source);
        this._lib = new SafeLib();
    }

    /**
     * 
     * Gets automaticaly create safe code library, you must add this lib to machine
     * 
     */
    public get lib(): SafeLib {
        return this._lib;
    }

    /**
     * 
     * Translate error to safe code error
     * 
     */
    public handleError(e:Error) {
        const newE = new SafeMachineError(e, this._lib.lastPosition, this._lib.stack);
        super.handleError(newE);
    }

    /**
     * 
     * Prepare source code
     * 
     */
    protected prepareSource(src:string) {
        return JSSafeCode.prepareCode(src);
    }
}