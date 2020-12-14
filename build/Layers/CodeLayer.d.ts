import { Layer } from "./Layer";
import { MachineMessage } from '../Helpers/MachineMessage';
export declare class CodeLayer extends Layer {
    protected _onError: ((error: any) => void);
    protected _onMessage: ((message: any) => void);
    protected _childLayer: Layer;
    protected _source: string;
    constructor(source?: string | Layer);
    setSource(source: string | Layer): void;
    getSource(): string;
    setOnError(callback: ((error: any) => void)): void;
    handleError(e: Error): void;
    setOnMessage(callback: ((message: any) => void)): void;
    handleMessage(m: MachineMessage): void;
    protected prepareSource(src: string): string;
}
