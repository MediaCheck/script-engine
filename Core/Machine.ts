import {Core} from "./Core";
import {Library} from "../Libs/Library";
import {Layer} from "../Layers/Layer";
import { MachineMessage } from '../Helpers/MachineMessage';

/**
 * 
 * Javascript code evaluation machine
 * 
 */
export class Machine {
    protected _core: Core;
    protected _libraries: {[key: string]: Library};
    protected _layer: Layer;

    constructor() {
        this._core = new Core();
        this._libraries = {};
    }

    /*
     *
     * Call function into Machine
     * 
     */
    public call = (func: (() => void)) => {
        try {
            if (this._core.terminated) {
                throw new Error("Machine was terminated");
            }
            func();
        } catch (e) {
            this.handleError(e);
        }
    }

    /*
     *
     * Import library into Machine
     * 
     */
    public include(lib: Library) {
        if (this._libraries[lib.name]) {
            this._libraries[lib.name].clean();
        }

        this._libraries[lib.name] = lib;
    }

    /*
     *
     * Exclude included library from Machine
     * 
     */
    public exclude(lib: Library) {
        if (this._libraries[lib.name]) {
            this._libraries[lib.name].clean();
            delete this._libraries[lib.name];
        }
    }

    /*
     *
     * Run code from layer
     * 
     */
    public run(layer: Layer) {
        this._layer = layer;

        let library = this.prepareLibs();

        try {
            this._core.run(library, this._layer.getSource());
        } catch (e) {
            this.handleError(e);
        }
    }

    /*
     *
     * Get is machine running
     * 
     */
    public get running(): boolean {
        return this._core.running;
    }

    /*
     *
     * Terminate machine
     * 
     */
    public terminate() {
        this._core.terminate();

        for (let libKey in this._libraries) {
            if (this._libraries.hasOwnProperty(libKey)) {
                const libObject: Library = this._libraries[libKey];
                libObject.clean();
            }
        }
    }

    /**
     * 
     * Handle message from libs, or external sources
     * 
     */
    public handleMessage(m: MachineMessage) {
        this._layer.handleMessage(m);
    }

    /*********************************
     *
     * Protected implementation
     *
     *********************************/

    /*
     *
     * Handle error - it can be called from any part of machine
     * 
     */
    protected handleError(e: any) {
        this.terminate();
        this._layer.handleError(e);
    }

    /*
     *
     * Prepare one big library from imports 
     * 
     */
    protected prepareLibs() {
        let library: {[k:string]:any} = {};

        for (let libKey in this._libraries) {
            const libObject: Library = this._libraries[libKey];
            const libExternals: any = libObject.external(this);

            for (let propKey in libExternals) {
                if (libExternals.hasOwnProperty(propKey)) {
                    library[propKey] = libExternals[propKey];
                }
            }

            libObject.init();
        }

        return library;
    }
}