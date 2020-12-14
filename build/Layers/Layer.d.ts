export declare abstract class Layer {
    abstract getSource(): string;
    abstract handleError(error: any): void;
    abstract handleMessage(m: any): void;
}
