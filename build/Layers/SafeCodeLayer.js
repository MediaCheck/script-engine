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
var JSSafeCode_1 = require("../Helpers/JSSafeCode");
var SafeMachineError_1 = require("../Helpers/SafeMachineError");
var SafeLib_1 = require("../Libs/SafeLib");
var SafeCodeLayer = (function (_super) {
    __extends(SafeCodeLayer, _super);
    function SafeCodeLayer(source) {
        var _this = _super.call(this, source) || this;
        _this._lib = new SafeLib_1.SafeLib();
        return _this;
    }
    Object.defineProperty(SafeCodeLayer.prototype, "lib", {
        get: function () {
            return this._lib;
        },
        enumerable: true,
        configurable: true
    });
    SafeCodeLayer.prototype.handleError = function (e) {
        var newE = new SafeMachineError_1.SafeMachineError(e, this._lib.lastPosition, this._lib.stack);
        _super.prototype.handleError.call(this, newE);
    };
    SafeCodeLayer.prototype.prepareSource = function (src) {
        return JSSafeCode_1.JSSafeCode.prepareCode(src);
    };
    return SafeCodeLayer;
}(CodeLayer_1.CodeLayer));
exports.SafeCodeLayer = SafeCodeLayer;
