import * as acorn from "acorn";
import * as escodegen from "escodegen";

/*
 *
 * Helper for translate standard ES5 script into safe code.
 * 
 * Safe code is code, where is called __check__ before any statement.
 * for example:
 *      When you write
 *        "while(true) something(); ""
 *      it will translates code into
 *        "__check__(); while(true) {__check__(); something(); }"
 * 
 *      So you can stop infinity loop to prevent stop rendering thread.
 * 
 * __check__ method is defined in SafeCodeLib. In this lib is implementation of watchdog.
 * Watchdog can automatically kill this code, when timeout gone.
 * __check__ method has one parameter - position. In this parameter is stored position in
 * origin code of expression statement, that is checked in this moment.
 * 
 * The output of this helper is string of prepared source code.
 * 
 * Usage is very simple, there is only one public method. 
 * static prepareCode(source): source
 */
export class JSSafeCode {

    /*
     *
     * Generate check call statement
     * 
     */
    private static checkNode(position:any, goDir?: string) {
        let val = position.start.line + ":" + position.start.column + "-" + position.end.line + ":" + position.end.column;
        if (goDir) {
             val+= "-" + goDir;
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
    }

    /*
     *
     * Generate try/catch statement node
     * 
     */
    private static trycatch(block:any) {
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
    }

    /*
     *
     * Create scope as node body if its not scope
     * 
     */
    private static blockenize(node:any, prop:string) {
        let block = null;

        if (node[prop]) {
            if (node[prop].type == "BlockStatement") {
                block = node[prop];
                if (!(block.body instanceof Array)) {
                    block.body = [block.body];
                }
            } else {
                let prevBody = node[prop];
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
    }

    /*
     *
     * Find ways to go deeper to node
     * 
     */
    private static parseSwitcher(node:any, propName:string) {
        if (node[propName]) {
            if (node[propName] instanceof Array) {
                for (let i = 0; i < node[propName].length; i++) {
                    JSSafeCode.parseNode(node[propName][i]);
                }
            }
            else {
                JSSafeCode.parseNode(node[propName]);
            }
        }
    }

    /*
     *
     * Parse node - go deeper to this node and blockenize its body
     * 
     */
    private static parseNode(node:any) {
        if (node.type == "IfStatement" || node.type == "Program" || node.type == "WhileStatement" || node.type == "ForStatement" || node.type == "FunctionExpression") {
            JSSafeCode.blockenize(node, "body");
            JSSafeCode.blockenize(node, "consequent");
            JSSafeCode.blockenize(node, "alternate");

            if (node.type == "Program" && node.body && !(node.body instanceof Array)) {
                node.body = [node.body];
            }
        }

        // add check
        if (node.body instanceof Array) {
            let newArray = [];
            let checked = false;
            for (let i = 0; i < node.body.length; i++) {
                let callFunc = false;

                if (node.body[i].loc) {
                    //  if expresion is call function
                    if (node.body[i].type && node.body[i].type == "ExpressionStatement") {
                        if (node.body[i].expression && node.body[i].expression.type && node.body[i].expression.type == "CallExpression") {
                            newArray.push(JSSafeCode.checkNode(node.body[i].loc,"in"));
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
                    newArray.push(JSSafeCode.checkNode(node.body[i].loc,"out"));
                    checked = true;
                }
            }

            if (!checked && node.loc) {
                newArray.push(JSSafeCode.checkNode(node.loc));
            }

            node.body = newArray;
        }

        //  find all nodes inside this node (node must have type)
        let propertiesList = [];
        for (const property in node) {
            if (node.hasOwnProperty(property)) {
                if (typeof node[property] == 'object') {
                    if (node[property] instanceof Array) {
                        let array = node[property];
                        let isNodeGroup = true;
                        for (let i = 0; i < array.length; i++) {
                            if (!node[property][i].type) {
                                isNodeGroup = false;
                            }
                        }
                        if (isNodeGroup) {
                            propertiesList.push(property);
                        }
                    } else {
                        if (node[property] && node[property].type) {
                            propertiesList.push(property);
                        }
                    }
                }
            }
        }

        for (let i = 0; i < propertiesList.length; i++) {
            JSSafeCode.parseSwitcher(node, propertiesList[i]);
        }
    }

    /*
     *
     * Prepare safe code for JS engine
     * 
     */
    public static prepareCode(source: string): string {
        let ast = acorn.parse(source, {
            ranges: true,
            locations: true
        });
        JSSafeCode.parseNode(ast);
        return escodegen.generate(ast);
    }
}