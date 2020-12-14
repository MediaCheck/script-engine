import {Layer} from "./Layer";
import { MachineMessage } from '../Helpers/MachineMessage';

/**
 * 
 * Base code layer for machine
 * 
 */
export class CodeLayer extends Layer {
    protected _onError: ((error: any) => void);
    protected _onMessage: ((message: any) => void);

    protected _childLayer: Layer;
    protected _source: string;

    constructor(source?: string | Layer) {
        super();
        this.setSource(source);
    }

    /**
     * 
     * Set source of this layer
     * 
     */
    public setSource(source: string | Layer) {
        if (source instanceof Layer) {
            this._childLayer = source;
        } else {
            this._source = source;
        }
    }

    /**
     * 
     * Get source code for run
     * 
     */
    public getSource(): string {
        let src = null;
        if (this._source) {
            src = this._source;
        } else if (this._childLayer) {
            src = this._childLayer.getSource();
        }

        return this.prepareSource(src);
    }

    /**
     * 
     * Set on error callback
     * 
     */
    public setOnError(callback: ((error: any) => void)) {
        this._onError = callback;
    }

    /**
     * 
     * Handle error (translate it for this layer)
     * 
     */
    public handleError(e:Error) {
        if (this._onError) {
            this._onError(e);
        }

        if (this._childLayer) {
            return this._childLayer.handleError(e);
        }
    }

    /**
     * 
     * Set on message callback
     * 
     */
    public setOnMessage(callback: ((message: any) => void)) {
        this._onMessage = callback;
    }

    /**
     * 
     * Handle message (translate it for this layer)
     * 
     */
    public handleMessage(m: MachineMessage) {
        if (this._onMessage) {
            this._onMessage(m);
        }

        if (this._childLayer) {
            return this._childLayer.handleMessage(m);
        }
    }

    /******************************
     * 
     * Internal functions
     * 
     ******************************/

    /**
     * 
     * Internal source code preparation (eg. compile from typescript, etc.)
     * 
     */
    protected prepareSource(src:string) {
        return src;
    }
}