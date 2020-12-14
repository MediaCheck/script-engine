/**
 * Created by davidhradek on 09.01.17.
 */

export abstract class Layer {
    public abstract getSource(): string;

    public abstract handleError(error: any): void;
    public abstract handleMessage(m: any): void;
}