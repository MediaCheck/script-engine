/**
 * Created by davidhradek on 10.01.17.
 */

/*
 *
 * Exception holder for proxify disallow set
 *
 */

export class ProxifyError extends Error {
    constructor(msg:string) {
        super(msg);
        this.name = "ProxifyError";
        this.message = msg;

        (<any>this).__proto__ = ProxifyError.prototype;
    }
}