export interface CoreLibraryHandler {
    out: string;
    object: any;
}
export declare class Core {
    protected _running: boolean;
    protected _sourceCode: string;
    protected _handler: any;
    protected _storage: any;
    protected _terminated: boolean;
    constructor();
    readonly running: boolean;
    readonly terminated: boolean;
    unfreeze(): boolean;
    terminate(): void;
    run(libraries: any, source: string): void;
    protected static stringifyLibrary(lib: any): CoreLibraryHandler;
}
