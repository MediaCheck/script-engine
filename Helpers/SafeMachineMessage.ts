import { PositionInfo } from '../Helpers/SafeMachineError';
import { MachineMessage, MachineMessageType } from './MachineMessage';

/**
 * 
 * Machine message is non destructive call from machine to parent.
 * Its only informations for parent.
 * 
 */
export class SafeMachineMessage extends MachineMessage {
    protected _position: PositionInfo;
    protected _stack: PositionInfo[];

    constructor(message: string, type: MachineMessageType, position?: PositionInfo, stack?: PositionInfo[]) {
        super(message, type);
        this._position = position;
        this._stack = stack;
    }

    /**
     * 
     * Gets position in code, that was saved in message
     * 
     */
    public get position(): PositionInfo {
        return this._position;
    }

    /**
     * 
     * Gets call stack in code, that was saved in message
     * 
     */
    public get safeMachineStack(): PositionInfo[] {
        return this._stack;
    }
}