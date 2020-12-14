import { PositionInfo } from '../Helpers/SafeMachineError';
import { MachineMessage, MachineMessageType } from './MachineMessage';
export declare class SafeMachineMessage extends MachineMessage {
    protected _position: PositionInfo;
    protected _stack: PositionInfo[];
    constructor(message: string, type: MachineMessageType, position?: PositionInfo, stack?: PositionInfo[]);
    readonly position: PositionInfo;
    readonly safeMachineStack: PositionInfo[];
}
