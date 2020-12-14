/*
 *
 * Exception holder for safe code machine
 * 
 */
export interface PositionInfo {
    lineA: number;
    lineB: number;
    columnA: number;
    columnB: number;
    deepDir?: string;
}
export class SafeMachineError extends Error {

    protected _position: PositionInfo;
    protected _original: any;
    protected _safeMachineStack: PositionInfo[];

    constructor(original: any, position: PositionInfo, safeMachineStack: PositionInfo[]) {
        super(original.toString());
        this.name = "SafeMachineError";
        this.message = original.toString();
        this._position = position;
        this._original = original;
        this._safeMachineStack = safeMachineStack;

        (<any>this).__proto__ = SafeMachineError.prototype;
    }

    /*
     *
     * Get last position in code
     * 
     */
    public get position(): PositionInfo {
        return this._position;
    }

    /*
     *
     * Get call stack
     * 
     */
    public get safeMachineStack(): PositionInfo[] {
        return [].slice.call(this._safeMachineStack, -Math.min( this._safeMachineStack.length, 5 ));
    }

    /*
     *
     * Get original error
     * 
     */
    public get original(): string {
        return this._original;
    }
}
