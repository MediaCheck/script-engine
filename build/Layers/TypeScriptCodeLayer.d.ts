import { CodeLayer } from "./CodeLayer";
import { Layer } from "./Layer";
import { PositionInfo } from '../Helpers/SafeMachineError';
import { MachineMessage } from '../Helpers/MachineMessage';
export declare class TypescriptBuildError extends Error {
    protected _diagnostics: any[];
    constructor(msg: string, diagnostics?: any[]);
    readonly diagnostics: any[];
}
export declare class TypeScriptCodeLayer extends CodeLayer {
    protected _output: {
        outputText: string;
        diagnostics?: any[];
        sourceMapText?: string;
    };
    protected _transpileModuleFunction: (input: string, transpileOptions: any) => {
        outputText: string;
        diagnostics?: any[];
        sourceMapText?: string;
    };
    constructor(transpileModuleFunction: (input: string, transpileOptions: any) => {
        outputText: string;
        diagnostics?: any[];
        sourceMapText?: string;
    }, source?: string | Layer);
    lastCompileTime: number;
    protected prepareSource(src: string): string;
    protected translateError(consumer: any, position: PositionInfo): PositionInfo;
    handleError(e: Error): void;
    handleMessage(m: MachineMessage): void;
}
