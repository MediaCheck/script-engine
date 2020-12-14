/**
 * Created by davidhradek on 13.01.17.
 */

declare module 'acorn' {
    function parse(source: string, config: any): any;
}

declare module 'escodegen' {
    function generate(ast: any): string;
}

declare module 'source-map' {
        class SourceMapConsumer {
            constructor(map: any);
            originalPositionFor(n: any): any;
        }
}