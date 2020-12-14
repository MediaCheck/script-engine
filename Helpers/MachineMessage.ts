import { PositionInfo } from '../Helpers/SafeMachineError';

/**
 * 
 * Machine message is non destructive call from machine to parent.
 * Its only informations for parent.
 * 
 */
export enum MachineMessageType {Warning, Error};

export class MachineMessage {
    protected _message: string;
    protected _type: MachineMessageType;

    constructor(message: string, type: MachineMessageType) {
        this._message = message;
        this._type = type;
    }

    /**
     * 
     * Get this message string
     * 
     */
    public get message(): string {
        return this._message;
    }

    /**
     * 
     * Get this message type
     * 
     */
    public get type(): MachineMessageType {
        return this._type;
    }
}