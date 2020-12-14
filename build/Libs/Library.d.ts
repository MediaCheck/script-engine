import { Machine } from "../Core/Machine";
export interface Library {
    name: string;
    init(): any;
    external(machine: Machine): {
        [key: string]: any;
    };
    clean(): any;
}
