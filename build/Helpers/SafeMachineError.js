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
var SafeMachineError = (function (_super) {
    __extends(SafeMachineError, _super);
    function SafeMachineError(original, position, safeMachineStack) {
        var _this = _super.call(this, original.toString()) || this;
        _this.name = "SafeMachineError";
        _this.message = original.toString();
        _this._position = position;
        _this._original = original;
        _this._safeMachineStack = safeMachineStack;
        _this.__proto__ = SafeMachineError.prototype;
        return _this;
    }
    Object.defineProperty(SafeMachineError.prototype, "position", {
        get: function () {
            return this._position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SafeMachineError.prototype, "safeMachineStack", {
        get: function () {
            return [].slice.call(this._safeMachineStack, -Math.min(this._safeMachineStack.length, 5));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SafeMachineError.prototype, "original", {
        get: function () {
            return this._original;
        },
        enumerable: true,
        configurable: true
    });
    return SafeMachineError;
}(Error));
exports.SafeMachineError = SafeMachineError;
