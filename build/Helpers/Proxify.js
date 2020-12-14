"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ProxifyError_1 = require("./ProxifyError");
var Proxify = (function () {
    function Proxify() {
    }
    Proxify.wrap = function (o) {
        var ret = new Proxy(o, {
            set: function (target, property, value) {
                var descriptor = Object.getOwnPropertyDescriptor(target, property);
                if (!descriptor) {
                    var p = target.__proto__;
                    while (!descriptor && p) {
                        descriptor = Object.getOwnPropertyDescriptor(p, property);
                        p = p.__proto__;
                    }
                }
                if ((target.__proxify_skip__) || (property == "__proxify_skip__")) {
                    target[property] = value;
                    return true;
                }
                else if (descriptor && descriptor.set) {
                    descriptor.set.apply(target, [value]);
                    return true;
                }
                else {
                    throw new ProxifyError_1.ProxifyError("Writing to property " + property + " is not alowed");
                }
            },
            get: function (target, property) {
                var descriptor = Object.getOwnPropertyDescriptor(target, property);
                if (!descriptor) {
                    var p = target.__proto__;
                    while (!descriptor && p) {
                        descriptor = Object.getOwnPropertyDescriptor(p, property);
                        p = p.__proto__;
                    }
                }
                var out;
                if (descriptor && descriptor.get) {
                    out = descriptor.get.apply(target, []);
                }
                else {
                    out = target[property];
                }
                if (out instanceof Object) {
                    if (!out.__no_proxify__ && !target.__proxify_skip__) {
                        return Proxify.wrap(out);
                    }
                }
                return out;
            },
            apply: function (target, that, args) {
                that.__proxify_skip__++;
                var out = target.apply(that, args);
                that.__proxify_skip__--;
                if (out instanceof Object) {
                    if (!out.__no_proxify__) {
                        return Proxify.wrap(out);
                    }
                }
                return out;
            },
            construct: function (target, args) {
                var out = Object.create(target.prototype);
                target.apply(out, args);
                if (out instanceof Object) {
                    if (!out.__no_proxify__) {
                        return Proxify.wrap(out);
                    }
                }
                return out;
            },
        });
        Object.defineProperty(ret, '__proxify_skip__', {
            value: 0,
            writable: true,
            enumerable: false,
            configurable: false
        });
        return ret;
    };
    Proxify.ignore = function (o) {
        var ret = new Proxy(o, {});
        Object.defineProperty(ret, '__no_proxify__', {
            value: true,
            writable: false,
            enumerable: false,
            configurable: false
        });
        return ret;
    };
    return Proxify;
}());
exports.Proxify = Proxify;
