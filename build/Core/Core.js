"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Core = (function () {
    function Core() {
        this._running = false;
        this._terminated = false;
    }
    Object.defineProperty(Core.prototype, "running", {
        get: function () {
            return this._running;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Core.prototype, "terminated", {
        get: function () {
            return this._terminated;
        },
        enumerable: true,
        configurable: true
    });
    Core.prototype.unfreeze = function () {
        return this._terminated = false;
    };
    Core.prototype.terminate = function () {
        this._running = false;
        this._terminated = true;
    };
    Core.prototype.run = function (libraries, source) {
        if (this._running) {
            throw new Error("Machine already running");
        }
        this._terminated = false;
        this._running = true;
        this._sourceCode = source;
        var libHandler = Core.stringifyLibrary(libraries);
        var newSource = "'use strict';\n" +
            "try{\n" +
            "(function() {\n" +
            "'use strict';\n" +
            "let window, document, location, self, name, history, parent, screen, jQuery, $, Snap, alert; \n" +
            libHandler.out + "\n" +
            source +
            ";\n" +
            "})();\n" +
            "} catch(e) {throw e;}";
        var jsEngineFunction = new Function("_storage_", "__libraries__", newSource);
        this._handler = jsEngineFunction(this._storage, libHandler.object);
    };
    Core.stringifyLibrary = function (lib) {
        var libraryString = "";
        for (var name_1 in lib) {
            libraryString += "const " + name_1 + " = __libraries__[\"" + name_1 + "\"]; ";
        }
        return {
            out: libraryString,
            object: lib
        };
    };
    return Core;
}());
exports.Core = Core;
