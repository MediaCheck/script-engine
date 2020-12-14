"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var acorn = require("acorn");
var escodegen = require("escodegen");
var JSSafeCode = (function () {
    function JSSafeCode() {
    }
    JSSafeCode.checkNode = function (position, goDir) {
        var val = position.start.line + ":" + position.start.column + "-" + position.end.line + ":" + position.end.column;
        if (goDir) {
            val += "-" + goDir;
        }
        return {
            type: 'ExpressionStatement',
            expression: {
                type: 'CallExpression',
                callee: {
                    type: 'Identifier',
                    name: '__check__'
                },
                arguments: [{
                        type: 'Literal',
                        value: val
                    }
                ]
            }
        };
    };
    JSSafeCode.trycatch = function (block) {
        block.body = [{
                type: 'BlockStatement',
                body: [{
                        type: 'TryStatement',
                        block: {
                            type: 'BlockStatement',
                            body: block.body
                        },
                        handler: {
                            type: 'CatchClause',
                            param: {
                                type: 'Identifier',
                                name: 'e'
                            },
                            body: {
                                type: 'BlockStatement',
                                body: [{
                                        type: 'ExpressionStatement',
                                        expression: {
                                            type: 'CallExpression',
                                            callee: {
                                                type: 'Identifier',
                                                name: '__runtimeError__'
                                            },
                                            arguments: [{
                                                    type: 'Identifier',
                                                    name: 'e'
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    }]
            }];
    };
    JSSafeCode.blockenize = function (node, prop) {
        var block = null;
        if (node[prop]) {
            if (node[prop].type == "BlockStatement") {
                block = node[prop];
                if (!(block.body instanceof Array)) {
                    block.body = [block.body];
                }
            }
            else {
                var prevBody = node[prop];
                if (!(prevBody instanceof Array)) {
                    prevBody = [prevBody];
                }
                block = {
                    type: 'BlockStatement',
                    start: node.start,
                    end: node.end,
                    range: [node.start, node.end],
                    body: prevBody
                };
                node[prop] = block;
            }
        }
        if (block) {
            JSSafeCode.trycatch(block);
        }
        return block;
    };
    JSSafeCode.parseSwitcher = function (node, propName) {
        if (node[propName]) {
            if (node[propName] instanceof Array) {
                for (var i = 0; i < node[propName].length; i++) {
                    JSSafeCode.parseNode(node[propName][i]);
                }
            }
            else {
                JSSafeCode.parseNode(node[propName]);
            }
        }
    };
    JSSafeCode.parseNode = function (node) {
        if (node.type == "IfStatement" || node.type == "Program" || node.type == "WhileStatement" || node.type == "ForStatement" || node.type == "FunctionExpression") {
            JSSafeCode.blockenize(node, "body");
            JSSafeCode.blockenize(node, "consequent");
            JSSafeCode.blockenize(node, "alternate");
            if (node.type == "Program" && node.body && !(node.body instanceof Array)) {
                node.body = [node.body];
            }
        }
        if (node.body instanceof Array) {
            var newArray = [];
            var checked = false;
            for (var i = 0; i < node.body.length; i++) {
                var callFunc = false;
                if (node.body[i].loc) {
                    if (node.body[i].type && node.body[i].type == "ExpressionStatement") {
                        if (node.body[i].expression && node.body[i].expression.type && node.body[i].expression.type == "CallExpression") {
                            newArray.push(JSSafeCode.checkNode(node.body[i].loc, "in"));
                            checked = true;
                            callFunc = true;
                        }
                    }
                    if (!callFunc) {
                        newArray.push(JSSafeCode.checkNode(node.body[i].loc));
                        checked = true;
                    }
                }
                newArray.push(node.body[i]);
                if (node.body[i].loc && callFunc) {
                    newArray.push(JSSafeCode.checkNode(node.body[i].loc, "out"));
                    checked = true;
                }
            }
            if (!checked && node.loc) {
                newArray.push(JSSafeCode.checkNode(node.loc));
            }
            node.body = newArray;
        }
        var propertiesList = [];
        for (var property in node) {
            if (node.hasOwnProperty(property)) {
                if (typeof node[property] == 'object') {
                    if (node[property] instanceof Array) {
                        var array = node[property];
                        var isNodeGroup = true;
                        for (var i = 0; i < array.length; i++) {
                            if (!node[property][i].type) {
                                isNodeGroup = false;
                            }
                        }
                        if (isNodeGroup) {
                            propertiesList.push(property);
                        }
                    }
                    else {
                        if (node[property] && node[property].type) {
                            propertiesList.push(property);
                        }
                    }
                }
            }
        }
        for (var i = 0; i < propertiesList.length; i++) {
            JSSafeCode.parseSwitcher(node, propertiesList[i]);
        }
    };
    JSSafeCode.prepareCode = function (source) {
        var ast = acorn.parse(source, {
            ranges: true,
            locations: true
        });
        JSSafeCode.parseNode(ast);
        return escodegen.generate(ast);
    };
    return JSSafeCode;
}());
exports.JSSafeCode = JSSafeCode;
