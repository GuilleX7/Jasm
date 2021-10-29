import { JasmType } from "./JasmType";

export interface JasmStructMember {
    type: JasmType | JasmStruct | JasmCompiledStruct,
    name: string,
    length?: number
}

export interface JasmStruct {
    members: JasmStructMember[],
    isUnion?: boolean
}

export interface JasmCompiledStructMember {
    type: JasmType | JasmCompiledStruct,
    name: string,
    length: number,
    offset: number,
    absoluteOffset: number
}

export interface JasmCompiledStruct {
    members: JasmCompiledStructMember[],
    alignment: number,
    size: number,
    isUnion: boolean
}

export const isJasmStruct = (x: any): x is JasmStruct => x && "members" in x && !("alignment" in x && "size" in x);