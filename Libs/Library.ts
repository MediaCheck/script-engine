import {Machine} from "../Core/Machine";

/*
 *
 * Base library interface with its life cycle
 * 
 */
export interface Library {
    name: string;
    init(): any;
    external(machine: Machine): {[key: string]: any;};
    clean(): any;
}