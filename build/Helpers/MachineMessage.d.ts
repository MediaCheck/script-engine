export declare enum MachineMessageType {
    Warning = 0,
    Error = 1,
}
export declare class MachineMessage {
    protected _message: string;
    protected _type: MachineMessageType;
    constructor(message: string, type: MachineMessageType);
    readonly message: string;
    readonly type: MachineMessageType;
}
