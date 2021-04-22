export const valueSymbol = Symbol("Value for JasmObjects");
export const addressSymbol = Symbol("Address for JasmObjects");
export const sizeSymbol = Symbol("Size for JasmObjects");
export const alignmentSymbol = Symbol("Alignment for JasmObjects");

export interface JasmObject {
    [key: string]: JasmObject,
    [valueSymbol]: any,
    readonly [addressSymbol]: number, 
    readonly [sizeSymbol]: number,
    readonly [alignmentSymbol]: number
}