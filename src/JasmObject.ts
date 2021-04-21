export interface JasmObject {
    [key: string]: JasmObject,
    value: any
}

export const valueSymbol = Symbol("Value for JasmObjects");