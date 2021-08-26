export interface IObjStr {
    [key: string]: string | string[];
    nullColor: string;
}
export interface IObjNum {
    [key: string]: number;
}
export interface IItemsData {
    [key: string]: number | string | any[];
    id: string;
    name?: string;
    description?: string;
    rate?: number;
    value?: number;
    weight?: number;
    chart?: Array<number>;
}
export interface ISubGroupsData {
    [key: string]: string | any[];
    name: string;
    items: Array<IItemsData>;
}
export interface IGroupsData {
    [key: string]: string | any[];
    name: string;
    subgroups: Array<ISubGroupsData>;
}
export interface IData {
    [key: string]: number | string | any[];
    id: string;
    performance: string;
    groups: Array<IGroupsData>;
}
