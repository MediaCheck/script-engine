"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Core_1 = require("./Core");
var Machine = (function () {
    function Machine() {
        var _this = this;
        this.call = function (func) {
            try {
                if (_this._core.terminated) {
                    throw new Error("Machine was terminated");
                }
                func();
            }
            catch (e) {
                _this.handleError(e);
            }
        };
        this._core = new Core_1.Core();
        this._libraries = {};
    }
    Machine.prototype.include = function (lib) {
        if (this._libraries[lib.name]) {
            this._libraries[lib.name].clean();
        }
        this._libraries[lib.name] = lib;
    };
    Machine.prototype.exclude = function (lib) {
        if (this._libraries[lib.name]) {
            this._libraries[lib.name].clean();
            delete this._libraries[lib.name];
        }
    };
    Machine.prototype.run = function (layer) {
        this._layer = layer;
        var library = this.prepareLibs();
        try {
            this._core.run(library, this._layer.getSource());
        }
        catch (e) {
            this.handleError(e);
        }
    };
    Object.defineProperty(Machine.prototype, "running", {
        get: function () {
            return this._core.running;
        },
        enumerable: true,
        configurable: true
    });
    Machine.prototype.terminate = function () {
        this._core.terminate();
        for (var libKey in this._libraries) {
            if (this._libraries.hasOwnProperty(libKey)) {
                var libObject = this._libraries[libKey];
                libObject.clean();
            }
        }
    };
    Machine.prototype.handleMessage = function (m) {
        this._layer.handleMessage(m);
    };
    Machine.prototype.handleError = function (e) {
        this.terminate();
        this._layer.handleError(e);
    };
    Machine.prototype.prepareLibs = function () {
        var library = {};
        for (var libKey in this._libraries) {
            var libObject = this._libraries[libKey];
            var libExternals = libObject.external(this);
            for (var propKey in libExternals) {
                if (libExternals.hasOwnProperty(propKey)) {
                    library[propKey] = libExternals[propKey];
                }
            }
            libObject.init();
        }
        return library;
    };
    return Machine;
}());
exports.Machine = Machine;
