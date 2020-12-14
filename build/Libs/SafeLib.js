"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SafeMachineError_1 = require("../Helpers/SafeMachineError");
var MachineMessage_1 = require("../Helpers/MachineMessage");
var SafeMachineMessage_1 = require("../Helpers/SafeMachineMessage");
var SafeLib = (function () {
    function SafeLib() {
        this._watchdogTimeout = 1000;
        this._performanceTimeout = 500;
    }
    Object.defineProperty(SafeLib.prototype, "watchdogTimeout", {
        get: function () {
            return this._watchdogTimeout;
        },
        set: function (timeout) {
            this._watchdogTimeout = timeout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SafeLib.prototype, "performanceTimeout", {
        get: function () {
            return this._performanceTimeout;
        },
        set: function (timeout) {
            this._performanceTimeout = timeout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SafeLib.prototype, "lastPosition", {
        get: function () {
            return this._lastPosition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SafeLib.prototype, "stack", {
        get: function () {
            var ret = [].slice.call(this._stack);
            if (this._lastPosition) {
                ret.push(this._lastPosition);
            }
            return ret;
        },
        enumerable: true,
        configurable: true
    });
    SafeLib.prototype.init = function () {
        var _this = this;
        this._lastPosition = null;
        this._watchdogTime = new Date().getTime();
        this._stack = [];
        this._performanceMessageSent = false;
        if (this._watchdogInterval) {
            clearInterval(this._watchdogInterval);
            this._watchdogInterval = null;
        }
        this._watchdogInterval = setInterval(function () { return _this.resetWatchdogTime(); }, this._watchdogTimeout / 10);
        if (document) {
            document.addEventListener('visibilitychange', function () { return _this.onDocumentVisibilityChange(); });
        }
    };
    SafeLib.prototype.onDocumentVisibilityChange = function () {
        if (document && document.hidden) {
            this.resetWatchdogTime();
        }
    };
    SafeLib.prototype.resetWatchdogTime = function () {
        this._watchdogTime = new Date().getTime();
    };
    SafeLib.prototype.handleStack = function (position) {
        var current = SafeLib.parsePosition(position.toString());
        if (!current) {
            return;
        }
        if (current.deepDir == "in") {
            this._stack.push(current);
        }
        else if (current.deepDir == "out") {
            this._stack.pop();
        }
        this._lastPosition = current;
    };
    SafeLib.prototype.external = function (machine) {
        this._machine = machine;
        var ref = this;
        return {
            __check__: function (position) {
                if (position) {
                    ref.handleStack(position.toString());
                }
                if (!ref._watchdogTime) {
                    throw new SafeMachineError_1.SafeMachineError("Terminated", ref.lastPosition, ref.stack);
                }
                var time = (new Date().getTime()) - ref._watchdogTime;
                if (time > ref._performanceTimeout) {
                    if (!ref._performanceMessageSent) {
                        ref._machine.handleMessage(new SafeMachineMessage_1.SafeMachineMessage("Operation was too long", MachineMessage_1.MachineMessageType.Warning, ref.lastPosition, ref.stack));
                        ref._performanceMessageSent = true;
                    }
                }
                else {
                    ref._performanceMessageSent = false;
                }
                if (time > ref._watchdogTimeout) {
                    ref._watchdogTime = 0;
                    throw new SafeMachineError_1.SafeMachineError("Watchdog timeout", ref.lastPosition, ref.stack);
                }
            },
            __runtimeError__: function (e) {
                throw e;
            }
        };
    };
    SafeLib.prototype.clean = function () {
        var _this = this;
        if (this._watchdogInterval) {
            clearInterval(this._watchdogInterval);
            this._watchdogInterval = null;
        }
        if (document) {
            document.removeEventListener('visibilitychange', function () { return _this.onDocumentVisibilityChange(); });
        }
    };
    SafeLib.parsePosition = function (position) {
        var positionParts = position.split("-");
        var posA = positionParts[0].split(":");
        var posB = positionParts[1].split(":");
        var ret = {
            lineA: parseInt(posA[0]),
            lineB: parseInt(posB[0]),
            columnA: parseInt(posA[1]),
            columnB: parseInt(posB[1])
        };
        if (positionParts.length == 3) {
            ret.deepDir = positionParts[2];
        }
        return ret;
    };
    Object.defineProperty(SafeLib.prototype, "name", {
        get: function () {
            return SafeLib.libName;
        },
        enumerable: true,
        configurable: true
    });
    return SafeLib;
}());
SafeLib.libName = "SafeLib";
SafeLib.libTypings = "";
exports.SafeLib = SafeLib;
