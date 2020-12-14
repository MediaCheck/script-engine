import {Library} from "./Library";
import {Machine} from "../Core/Machine";
import {SafeMachineError, PositionInfo} from '../Helpers/SafeMachineError';
import {MachineMessageType} from '../Helpers/MachineMessage';
import {SafeMachineMessage} from '../Helpers/SafeMachineMessage';

/*
 *
 * Safe code Library
 * 
 * Its necessary to import this library to machine, when you are using SafeCodeLayer!
 * When this library is initialized from machine, it automatically starts watchdog.
 * When any error occurred or watchdog timeout gone, it will call error and store position.
 * Any errors from this lib has position - so you can read last position in code, before the error.
 * 
 * Enjoy safe code :)
 * 
 */
export class SafeLib implements Library {

    public static libName:string = "SafeLib";
    public static libTypings:string = "";

    protected _lastPosition: PositionInfo;
    protected _watchdogTimeout: number;
    protected _watchdogTime: number;
    protected _watchdogInterval: any;
    protected _stack: PositionInfo[];
    protected _performanceTimeout: number;
    protected _machine: Machine;
    protected _performanceMessageSent: boolean;

    constructor() {
        this._watchdogTimeout = 1000;
        this._performanceTimeout = 500;
    }

    /**
     * 
     * Gets actual watchdog kill timeout in miliseconds
     * 
     */
    public get watchdogTimeout(): number {
        return this._watchdogTimeout;
    }

    /**
     * 
     * Sets watchdog kill timeout in miliseconds
     * 
     */
    public set watchdogTimeout(timeout: number) {
        this._watchdogTimeout = timeout;
    }

    /**
     * 
     * Gets actual performance warning timeout in miliseconds
     * 
     */
    public get performanceTimeout(): number {
        return this._performanceTimeout;
    }

    /**
     * 
     * Sets performance warning timeout in miliseconds
     * 
     */
    public set performanceTimeout(timeout: number) {
        this._performanceTimeout = timeout;
    }

    /*
     *
     * Get last position in code
     * 
     * Its saved from __check__ function
     * Position is in format l1:c1-l2:c2. It is a range between 
     * characters on the begin and end of expression. l is a line and c is a column.
     */
    public get lastPosition(): PositionInfo {
        return this._lastPosition;
    }

    public get stack(): PositionInfo[] {
        let ret = [].slice.call(this._stack);
        if (this._lastPosition) {
            ret.push(this._lastPosition);
        }
        return ret;
    }

    /*
     *
     * Init lib - it will starts watchdog
     * 
     */
    public init() {
        this._lastPosition = null;
        this._watchdogTime = new Date().getTime();
        this._stack = [];
        this._performanceMessageSent = false;

        //  kill watchdog if running
        if (this._watchdogInterval) {
            clearInterval(this._watchdogInterval);
            this._watchdogInterval = null;
        }

        //  start watchdog
        this._watchdogInterval = setInterval(() => this.resetWatchdogTime(), this._watchdogTimeout / 10);

        //  if document, listen visibility change of tab...
        //  this is fix, because, when tab is not visible, javascript is stopped, but i need to know 
        //  actual time, before checking watchdog timeout
        if (document) {
            document.addEventListener('visibilitychange', () => this.onDocumentVisibilityChange());
        }
    }

    /**
     * 
     * Handle document visiblity changes
     * 
     */
    protected onDocumentVisibilityChange() {
        if (document && document.hidden) {
            this.resetWatchdogTime();
        }
    }

    /**
     * 
     * Reset reference time for watchdog
     * 
     */
    protected resetWatchdogTime() {
        this._watchdogTime = new Date().getTime();
    }

    /*
     *
     * handle check to create call stack
     * 
     */
    protected handleStack(position: string) {
        const current = SafeLib.parsePosition(position.toString());

        if (!current) {
            return;
        }

        if (current.deepDir == "in") {
            this._stack.push(current);
        } else if (current.deepDir == "out"){
            this._stack.pop();
        }

        this._lastPosition = current;
    }

    /*
     *
     * Get library "user" interface
     * 
     */
    public external(machine: Machine): { [key:string]: any } {
        this._machine = machine;
        let ref = this;

        return {
            __check__: function (position:any) {
                if (position) {
                    ref.handleStack(position.toString());
                }

                if (!ref._watchdogTime) {
                    throw new SafeMachineError("Terminated", ref.lastPosition, ref.stack);
                }

                const time = (new Date().getTime()) - ref._watchdogTime;

                if (time > ref._performanceTimeout) {
                    if (!ref._performanceMessageSent) {
                        ref._machine.handleMessage(new SafeMachineMessage("Operation was too long", MachineMessageType.Warning, ref.lastPosition, ref.stack));
                        ref._performanceMessageSent = true;
                    }
                } else {
                    ref._performanceMessageSent = false;
                }

                if (time > ref._watchdogTimeout) {
                    ref._watchdogTime = 0;
                    throw new SafeMachineError("Watchdog timeout", ref.lastPosition, ref.stack);
                }
            },
            __runtimeError__: function (e:any) {
                throw e;
            }
        }
    }

    /*
     *
     * Clean lib - stops watchdog
     * 
     */
    public clean() {
        //  kill watchdog if running
        if (this._watchdogInterval) {
            clearInterval(this._watchdogInterval);
            this._watchdogInterval = null;
        }

        //  clean visibility change listener
        if (document) {
            document.removeEventListener('visibilitychange', () => this.onDocumentVisibilityChange());
        }
    }

    /*
     *
     * parse position expression helper
     * 
     */
    public static parsePosition(position: string): PositionInfo {
        const positionParts = position.split("-");
        const posA = positionParts[0].split(":");
        const posB = positionParts[1].split(":");
        let ret:any = {
            lineA: parseInt(posA[0]),
            lineB: parseInt(posB[0]),
            columnA: parseInt(posA[1]),
            columnB: parseInt(posB[1])
        };

        if (positionParts.length == 3) {
            ret.deepDir = positionParts[2]
        }

        return ret;
    }

    /*
     *
     * Get library name
     * 
     */
    public get name(): string {
        return SafeLib.libName;
    }
}