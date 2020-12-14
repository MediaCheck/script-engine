"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MachineMessageType;
(function (MachineMessageType) {
    MachineMessageType[MachineMessageType["Warning"] = 0] = "Warning";
    MachineMessageType[MachineMessageType["Error"] = 1] = "Error";
})(MachineMessageType = exports.MachineMessageType || (exports.MachineMessageType = {}));
;
var MachineMessage = (function () {
    function MachineMessage(message, type) {
        this._message = message;
        this._type = type;
    }
    Object.defineProperty(MachineMessage.prototype, "message", {
        get: function () {
            return this._message;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MachineMessage.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    return MachineMessage;
}());
exports.MachineMessage = MachineMessage;
