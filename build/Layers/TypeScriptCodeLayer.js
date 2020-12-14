"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var CodeLayer_1 = require("./CodeLayer");
var SourceMap = require("source-map");
var SafeMachineError_1 = require("../Helpers/SafeMachineError");
var SafeMachineMessage_1 = require("../Helpers/SafeMachineMessage");
var TypescriptBuildError = (function (_super) {
    __extends(TypescriptBuildError, _super);
    function TypescriptBuildError(msg, diagnostics) {
        var _this = _super.call(this, "TypescriptBuildError") || this;
        _this.name = "TypescriptBuildError";
        _this.message = msg;
        _this._diagnostics = diagnostics;
        _this.__proto__ = TypescriptBuildError.prototype;
        return _this;
    }
    Object.defineProperty(TypescriptBuildError.prototype, "diagnostics", {
        get: function () {
            return this._diagnostics;
        },
        enumerable: true,
        configurable: true
    });
    return TypescriptBuildError;
}(Error));
exports.TypescriptBuildError = TypescriptBuildError;
var TypeScriptCodeLayer = (function (_super) {
    __extends(TypeScriptCodeLayer, _super);
    function TypeScriptCodeLayer(transpileModuleFunction, source) {
        var _this = _super.call(this, source) || this;
        _this.lastCompileTime = 0;
        _this._transpileModuleFunction = transpileModuleFunction;
        return _this;
    }
    TypeScriptCodeLayer.prototype.prepareSource = function (src) {
        this._output = null;
        if (src) {
            try {
                var d1 = (new Date()).getTime();
                this._output = this._transpileModuleFunction(src, {
                    reportDiagnostics: true,
                    compilerOptions: {
                        sourceMap: true,
                        target: "ES5",
                        module: "ES6"
                    }
                });
                var d2 = (new Date()).getTime();
                this.lastCompileTime = (d2 - d1);
                if (this._output.diagnostics && this._output.diagnostics.length) {
                    throw new TypescriptBuildError("Build error", this._output.diagnostics);
                }
            }
            catch (e) {
                this.handleError(e);
            }
        }
        if (this._output && this._output.outputText)
            return this._output.outputText;
        return "";
    };
    TypeScriptCodeLayer.prototype.translateError = function (consumer, position) {
        var originalA = consumer.originalPositionFor({
            line: position.lineA,
            column: position.columnA,
        });
        var originalB = consumer.originalPositionFor({
            line: position.lineB,
            column: position.columnB,
        });
        return {
            lineA: originalA.line,
            columnA: originalA.column,
            lineB: originalB.line,
            columnB: originalB.column
        };
    };
    TypeScriptCodeLayer.prototype.handleError = function (e) {
        var err;
        if (e instanceof SafeMachineError_1.SafeMachineError) {
            if (this._output && this._output.sourceMapText) {
                var sourceMap = JSON.parse(this._output.sourceMapText);
                var consumer = new SourceMap.SourceMapConsumer(sourceMap);
                var stack = [];
                if (e.safeMachineStack) {
                    for (var i = 0; i < e.safeMachineStack.length; i++) {
                        stack.push(this.translateError(consumer, e.safeMachineStack[i]));
                    }
                }
                var position = null;
                if (e.position) {
                    position = this.translateError(consumer, e.position);
                }
                err = new SafeMachineError_1.SafeMachineError(e.original, position, stack);
            }
            else {
                err = e;
            }
        }
        else {
            err = e;
        }
        _super.prototype.handleError.call(this, err);
    };
    TypeScriptCodeLayer.prototype.handleMessage = function (m) {
        var mess;
        if (m instanceof SafeMachineMessage_1.SafeMachineMessage) {
            if (this._output && this._output.sourceMapText) {
                var sourceMap = JSON.parse(this._output.sourceMapText);
                var consumer = new SourceMap.SourceMapConsumer(sourceMap);
                var stack = [];
                if (m.safeMachineStack) {
                    for (var i = 0; i < m.safeMachineStack.length; i++) {
                        stack.push(this.translateError(consumer, m.safeMachineStack[i]));
                    }
                }
                var position = null;
                if (m.position) {
                    position = this.translateError(consumer, m.position);
                }
                mess = new SafeMachineMessage_1.SafeMachineMessage(m.message, m.type, position, stack);
            }
            else {
                mess = m;
            }
        }
        else {
            mess = m;
        }
        _super.prototype.handleMessage.call(this, mess);
    };
    return TypeScriptCodeLayer;
}(CodeLayer_1.CodeLayer));
exports.TypeScriptCodeLayer = TypeScriptCodeLayer;
