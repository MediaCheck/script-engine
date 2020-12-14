/**
 * Created by davidhradek on 10.01.17.
 */
import {Proxify} from "../Helpers/Proxify";
import {ProxifyError} from "../Helpers/ProxifyError";

declare const Proxy:any;

class SomeClass {

    public someObj:any = null;

    constructor () {
        this.someObj = {};
    }

    public someFunc() {
        this.someObj = {};
        this.someFunc2();
        this.someObj["a"] = "b";
    }

    public someFunc2() {
        return this.someObj;
    }

    public someFunc3() {
        let a = this.someFunc2();
        a.a = "c";
        return a;
    }

    set val(val:number) {
        this.someObj.num = val;

    }

    get val():number {
        this.someFunc2().getted = true;
        return this.someObj.num;
    }

}

let PSomeClass = Proxify.wrap(SomeClass);

try {

    let test = new PSomeClass();

    console.log("");
    console.log("typeof PSomeClass : "+typeof PSomeClass);
    console.log("PSomeClass instanceof SomeClass : "+(PSomeClass instanceof SomeClass));

    console.log("typeof test : "+typeof test);
    console.log("test instanceof SomeClass : "+(test instanceof SomeClass));
    console.log("test instanceof PSomeClass : "+(test instanceof PSomeClass));
    console.log("");

    console.log("After construct:");
    console.log("   ",test);
    if (JSON.stringify(test) == '{"someObj":{}}') console.log("    > OK");

    console.log("Call someFunc():");
    test.someFunc();
    console.log("   ",test);
    if (JSON.stringify(test) == '{"someObj":{"a":"b"}}') console.log("    > OK");

    console.log("Call someFunc3() and set to x:");
    let x = test.someFunc3();
    console.log("   ",test);
    if (JSON.stringify(test) == '{"someObj":{"a":"c"}}') console.log("    > OK");

    console.log("Setting x.a = \"d\":");
    try {
        x.a = "d";
    } catch (e) {
        console.log("   ",test);
        if (e instanceof ProxifyError)
            console.log("    > OK");
        else
            console.error(e);
    }

    console.log("Setting test.someObj.a = \"e\":");
    try {
        test.someObj.a = "e";
    } catch (e) {
        console.log("   ",test);
        if (e instanceof ProxifyError)
            console.log("    > OK");
        else
            console.error(e);
    }

    console.log("Set setter 11 to test.val:");
    test.val = 11;
    console.log("   ",test);
    if (JSON.stringify(test) == '{"someObj":{"a":"c","num":11}}') console.log("    > OK");

    console.log("Get getter test.val:");
    test.val;
    console.log("   ",test);
    if (JSON.stringify(test) == '{"someObj":{"a":"c","num":11,"getted":true}}') console.log("    > OK");

    console.log("Trying set some to test.__proto__:");
    try {
        test.__proto__.someFunc3 = function () {
            console.log("HACKED!!!! HACKED!!!!");
        };
        test.someFunc3();
    } catch (e) {
        console.log("   ",test);
        if (e instanceof ProxifyError)
            console.log("    > OK");
        else
            console.error(e);
    }

} catch (e) {
    console.error(e);
}
