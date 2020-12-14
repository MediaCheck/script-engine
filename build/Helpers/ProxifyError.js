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
var ProxifyError = (function (_super) {
    __extends(ProxifyError, _super);
    function ProxifyError(msg) {
        var _this = _super.call(this, msg) || this;
        _this.name = "ProxifyError";
        _this.message = msg;
        _this.__proto__ = ProxifyError.prototype;
        return _this;
    }
    return ProxifyError;
}(Error));
exports.ProxifyError = ProxifyError;
