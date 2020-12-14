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
var Layer_1 = require("./Layer");
var CodeLayer = (function (_super) {
    __extends(CodeLayer, _super);
    function CodeLayer(source) {
        var _this = _super.call(this) || this;
        _this.setSource(source);
        return _this;
    }
    CodeLayer.prototype.setSource = function (source) {
        if (source instanceof Layer_1.Layer) {
            this._childLayer = source;
        }
        else {
            this._source = source;
        }
    };
    CodeLayer.prototype.getSource = function () {
        var src = null;
        if (this._source) {
            src = this._source;
        }
        else if (this._childLayer) {
            src = this._childLayer.getSource();
        }
        return this.prepareSource(src);
    };
    CodeLayer.prototype.setOnError = function (callback) {
        this._onError = callback;
    };
    CodeLayer.prototype.handleError = function (e) {
        if (this._onError) {
            this._onError(e);
        }
        if (this._childLayer) {
            return this._childLayer.handleError(e);
        }
    };
    CodeLayer.prototype.setOnMessage = function (callback) {
        this._onMessage = callback;
    };
    CodeLayer.prototype.handleMessage = function (m) {
        if (this._onMessage) {
            this._onMessage(m);
        }
        if (this._childLayer) {
            return this._childLayer.handleMessage(m);
        }
    };
    CodeLayer.prototype.prepareSource = function (src) {
        return src;
    };
    return CodeLayer;
}(Layer_1.Layer));
exports.CodeLayer = CodeLayer;
