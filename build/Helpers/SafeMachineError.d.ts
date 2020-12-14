export interface PositionInfo {
    lineA: number;
    lineB: number;
    columnA: number;
    columnB: number;
    deepDir?: string;
}
export declare class SafeMachineError extends Error {
    protected _position: PositionInfo;
    protected _original: any;
    protected _safeMachineStack: PositionInfo[];
    constructor(original: any, position: PositionInfo, safeMachineStack: PositionInfo[]);
    readonly position: PositionInfo;
    readonly safeMachineStack: PositionInfo[];
    readonly original: string;
}
