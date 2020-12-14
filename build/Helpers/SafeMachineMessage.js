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
var MachineMessage_1 = require("./MachineMessage");
var SafeMachineMessage = (function (_super) {
    __extends(SafeMachineMessage, _super);
    function SafeMachineMessage(message, type, position, stack) {
        var _this = _super.call(this, message, type) || this;
        _this._position = position;
        _this._stack = stack;
        return _this;
    }
    Object.defineProperty(SafeMachineMessage.prototype, "position", {
        get: function () {
            return this._position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SafeMachineMessage.prototype, "safeMachineStack", {
        get: function () {
            return this._stack;
        },
        enumerable: true,
        configurable: true
    });
    return SafeMachineMessage;
}(MachineMessage_1.MachineMessage));
exports.SafeMachineMessage = SafeMachineMessage;
