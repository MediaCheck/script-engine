import {CodeLayer} from "./CodeLayer";
import {Layer} from "./Layer";
import * as SourceMap from "source-map";
import { SafeMachineError, PositionInfo } from '../Helpers/SafeMachineError';
import { MachineMessage } from '../Helpers/MachineMessage';
import { SafeMachineMessage } from '../Helpers/SafeMachineMessage';

/**
 * 
 * Typescript build error with diagnostics from typescript compiler
 * 
 */
export class TypescriptBuildError extends Error {
    protected _diagnostics: any[];

    constructor(msg:string, diagnostics?: any[]) {
        super("TypescriptBuildError");
        this.name = "TypescriptBuildError";
        this.message = msg;
        this._diagnostics = diagnostics;
        (<any>this).__proto__ = TypescriptBuildError.prototype;
    }

    public get diagnostics(): any[] {
        return this._diagnostics;
    }
}

/*
 *
 * Typescript layer
 * 
 * This layer is for running typescript directly on machine.
 * Its compile typescript source code and translate errors
 * back to javascript using source map
 */
export class TypeScriptCodeLayer extends CodeLayer {
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

    constructor(transpileModuleFunction:(input: string, transpileOptions: any) => {
        outputText: string;
        diagnostics?: any[];
        sourceMapText?: string;
    }, source?: string | Layer) {
        super(source);
        this._transpileModuleFunction = transpileModuleFunction;
    }

    public lastCompileTime: number = 0;

    /*
     *
     * Prepare source code overrided function
     * Its compile typescript
     */
    protected prepareSource(src:string) {
        this._output = null;
        if (src) {
            try {
                const d1 = (new Date()).getTime();
                this._output = this._transpileModuleFunction(src, {
                    reportDiagnostics: true,
                    compilerOptions: {
                        sourceMap: true,
                        target: "ES5",
                        module: "ES6"
                    }
                });

                const d2 = (new Date()).getTime();
                this.lastCompileTime = (d2 - d1);

                if (this._output.diagnostics && this._output.diagnostics.length) {
                    throw new TypescriptBuildError("Build error", this._output.diagnostics);
                }

            } catch (e) {
                this.handleError(e);
            }
        }

        if (this._output && this._output.outputText)
            return this._output.outputText;

        return "";
    }

    /**
     * 
     * Translate error positions by source map
     * 
     */
    protected translateError(consumer: any, position: PositionInfo): PositionInfo {

        const originalA = consumer.originalPositionFor({
            line: position.lineA,
            column: position.columnA,
        });

        const originalB = consumer.originalPositionFor({
            line: position.lineB,
            column: position.columnB,
        });

        return {
            lineA: originalA.line,
            columnA: originalA.column,
            lineB: originalB.line,
            columnB: originalB.column
        }
    }

    /*
     *
     * Translate error
     * 
     */
    public handleError(e:Error) {
        let err;

        if (e instanceof SafeMachineError) {
            if (this._output && this._output.sourceMapText) {
                const sourceMap = JSON.parse(this._output.sourceMapText);
                const consumer = new SourceMap.SourceMapConsumer(sourceMap);

                let stack = [];
                if (e.safeMachineStack) {
                    for (let i = 0; i < e.safeMachineStack.length; i++) {
                        stack.push(this.translateError(consumer, e.safeMachineStack[i]));
                    }
                }

                let position = null;
                if (e.position) {
                    position = this.translateError(consumer, e.position);
                }
                err = new SafeMachineError(e.original, position, stack);
            } else {
                err = e;
            }
        } else {
            // TODO: something with not SafeMachine errors
            err = e;
        }

        super.handleError(err);
    }

    /**
     * 
     * Handle message (translate it for this layer)
     * 
     */
    public handleMessage(m: MachineMessage) {
        let mess;

        if (m instanceof SafeMachineMessage) {
            if (this._output && this._output.sourceMapText) {
                const sourceMap = JSON.parse(this._output.sourceMapText);
                const consumer = new SourceMap.SourceMapConsumer(sourceMap);

                let stack = [];
                if (m.safeMachineStack) {
                    for (let i = 0; i < m.safeMachineStack.length; i++) {
                        stack.push(this.translateError(consumer, m.safeMachineStack[i]));
                    }
                }

                let position = null;
                if (m.position) {
                    position = this.translateError(consumer, m.position);
                }
                mess = new SafeMachineMessage(m.message, m.type, position, stack);
            } else {
                mess = m;
            }
        } else {
            // TODO: something with not SafeMachine errors
            mess = m;
        }

        super.handleMessage(mess);
    }
}