/*
 *
 * Internal interface for handle object of library
 * 
 */
export interface CoreLibraryHandler {
    out: string;
    object: any;
}

/*
 *
 * Core is pure environment, that evaluates code
 * Be careful, because terminate do nothing, when you have pure JS code
 * without any miters, that checks the running property.
 * 
 * When you running code, it automatically include libraries. All external interfaces of libraries
 * will be added to root of scope
 */
export class Core {
    protected _running: boolean;
    protected _sourceCode: string;
    protected _handler: any;
    protected _storage: any;
    protected _terminated: boolean;

    constructor() {
        this._running = false;
        this._terminated = false;
    }

    /*
     *
     * Is core running
     * 
     */
    public get running(): boolean {
        return this._running;
    }

    /*
     * 
     * Core was terminated
     * 
     */
    public get terminated(): boolean {
        return this._terminated;
    }

    /*
     *
     * Unfreezee core after terminate
     * 
     */
    public unfreeze() {
        return this._terminated = false;
    }

    /*
     *
     * Terminate Core
     * 
     */
    public terminate() {
        this._running = false;
        this._terminated = true;
    }

    /*
     *
     * Run source code
     * 
     */
    public run(libraries: any, source: string) {
        if (this._running) {
            throw new Error("Machine already running");
        }

        this._terminated = false;
        this._running = true;
        this._sourceCode = source;

        const libHandler = Core.stringifyLibrary(libraries);

        let newSource = "'use strict';\n" +
            "try{\n" +
            "(function() {\n" +
            "'use strict';\n" +
            "let window, document, location, self, name, history, parent, screen, jQuery, $, Snap, alert; \n" +
            libHandler.out + "\n" +
            source +
            ";\n" +
            "})();\n" +
            "} catch(e) {throw e;}";

        const jsEngineFunction = new Function("_storage_", "__libraries__", newSource);
        this._handler = jsEngineFunction(this._storage, libHandler.object);
    }

    /*********************************
     *
     * Protected implementation
     *
     *********************************/

    /*
     *
     * Stringify library
     *
     */
    protected static stringifyLibrary(lib: any): CoreLibraryHandler {
        let libraryString = "";
        for (let name in lib) {
            libraryString += "const " + name + " = __libraries__[\"" + name + "\"]; ";
        }

        return {
            out: libraryString,
            object: lib
        };
    }
}