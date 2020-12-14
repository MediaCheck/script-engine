import { Library } from "./Library";
import { Machine } from "../Core/Machine";
import { PositionInfo } from '../Helpers/SafeMachineError';
export declare class SafeLib implements Library {
    static libName: string;
    static libTypings: string;
    protected _lastPosition: PositionInfo;
    protected _watchdogTimeout: number;
    protected _watchdogTime: number;
    protected _watchdogInterval: any;
    protected _stack: PositionInfo[];
    protected _performanceTimeout: number;
    protected _machine: Machine;
    protected _performanceMessageSent: boolean;
    constructor();
    watchdogTimeout: number;
    performanceTimeout: number;
    readonly lastPosition: PositionInfo;
    readonly stack: PositionInfo[];
    init(): void;
    protected onDocumentVisibilityChange(): void;
    protected resetWatchdogTime(): void;
    protected handleStack(position: string): void;
    external(machine: Machine): {
        [key: string]: any;
    };
    clean(): void;
    static parsePosition(position: string): PositionInfo;
    readonly name: string;
}
