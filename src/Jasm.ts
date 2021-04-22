import { isJasmType, JasmType } from "./JasmType.js";
import { isJasmStruct, JasmCompiledStruct, JasmStruct } from "./JasmStruct.js";
import { JasmObject, addressSymbol, valueSymbol, alignmentSymbol, sizeSymbol } from "./JasmObject.js";

export class Jasm {
    private dataview!: DataView;
    private view8u!: Uint8Array;
    private textDecoder!: TextDecoder;
    private textEncoder!: TextEncoder;

    constructor(memory: WebAssembly.Memory) {
        this.setMemory(memory);
        this.textDecoder = new TextDecoder();
        this.textEncoder = new TextEncoder();
    }

    public setMemory(memory: WebAssembly.Memory) {
        this.dataview = new DataView(memory.buffer);
        this.view8u = new Uint8Array(memory.buffer);
    }

    /* Fixed integer types */
    public [JasmType.int8_t] = {
        getSingle: (pointer: number, offset: number = 0): number => this.dataview.getInt8(pointer + offset),
        setSingle: (pointer: number, value: number, offset: number = 0): void => { this.dataview.setInt8(pointer + offset, value) },
        getArray: (pointer: number, length: number): number[] => { const _array = []; for (let i = 0; i < length; i++) { _array[i] = this.dataview.getInt8(pointer + i) } return _array; },
        setArray: (pointer: number, values: number[]): void => { for (let i = 0; i < values.length; i++) { this.dataview.setInt8(pointer + i, values[i]) } },
        alignment: 1,
        size: 1
    }

    public [JasmType.uint8_t] = {
        getSingle: (pointer: number, offset: number = 0): number => this.dataview.getUint8(pointer + offset),
        setSingle: (pointer: number, value: number, offset: number = 0): void => { this.dataview.setUint8(pointer + offset, value) },
        getArray: (pointer: number, length: number): number[] => { const _array = []; for (let i = 0; i < length; i++) { _array[i] = this.dataview.getUint8(pointer + i) } return _array; },
        setArray: (pointer: number, values: number[]): void => { for (let i = 0; i < values.length; i++) { this.dataview.setUint8(pointer + i, values[i]) } },
        alignment: 1,
        size: 1
    }

    public [JasmType.int16_t] = {
        getSingle: (pointer: number, offset: number = 0): number => this.dataview.getInt16(pointer + offset * this.int16_t.alignment, true),
        setSingle: (pointer: number, value: number, offset: number = 0): void => { this.dataview.setInt16(pointer + offset * this.int16_t.alignment, value, true) },
        getArray: (pointer: number, length: number): number[] => { const _array = []; for (let i = 0; i < length; i++) { _array[i] = this.dataview.getInt16(pointer + i * this.int16_t.alignment, true) } return _array; },
        setArray: (pointer: number, values: number[]): void => { for (let i = 0; i < values.length; i++) { this.dataview.setInt16(pointer + i * this.int16_t.alignment, values[i], true) } },
        alignment: 2,
        size: 2
    }

    public [JasmType.uint16_t] = {
        getSingle: (pointer: number, offset: number = 0): number => this.dataview.getUint16(pointer + offset * this.uint16_t.alignment, true),
        setSingle: (pointer: number, value: number, offset: number = 0): void => { this.dataview.setUint16(pointer + offset * this.uint16_t.alignment, value, true) },
        getArray: (pointer: number, length: number): number[] => { const _array = []; for (let i = 0; i < length; i++) { _array[i] = this.dataview.getUint16(pointer + i * this.uint16_t.alignment, true) } return _array; },
        setArray: (pointer: number, values: number[]): void => { for (let i = 0; i < values.length; i++) { this.dataview.setUint16(pointer + i * this.uint16_t.alignment, values[i], true) } },
        alignment: 2,
        size: 2
    }

    public [JasmType.int32_t] = {
        getSingle: (pointer: number, offset: number = 0): number => this.dataview.getInt32(pointer + offset * this.int32_t.alignment, true),
        setSingle: (pointer: number, value: number, offset: number = 0): void => { this.dataview.setInt32(pointer + offset * this.int32_t.alignment, value, true) },
        getArray: (pointer: number, length: number): number[] => { const _array = []; for (let i = 0; i < length; i++) { _array[i] = this.dataview.getInt32(pointer + i * this.int32_t.alignment, true) } return _array; },
        setArray: (pointer: number, values: number[]): void => { for (let i = 0; i < values.length; i++) { this.dataview.setInt32(pointer + i * this.int32_t.alignment, values[i], true) } },
        alignment: 4,
        size: 4
    }

    public [JasmType.uint32_t] = {
        getSingle: (pointer: number, offset: number = 0): number => this.dataview.getUint32(pointer + offset * this.uint32_t.alignment, true),
        setSingle: (pointer: number, value: number, offset: number = 0): void => { this.dataview.setUint32(pointer + offset * this.uint32_t.alignment, value, true) },
        getArray: (pointer: number, length: number): number[] => { const _array = []; for (let i = 0; i < length; i++) { _array[i] = this.dataview.getUint32(pointer + i * this.uint32_t.alignment, true) } return _array; },
        setArray: (pointer: number, values: number[]): void => { for (let i = 0; i < values.length; i++) { this.dataview.setUint32(pointer + i * this.uint32_t.alignment, values[i], true) } },
        alignment: 4,
        size: 4
    }

    public [JasmType.int64_t] = {
        getSingle: (pointer: number, offset: number = 0): bigint => this.dataview.getBigInt64(pointer + offset * this.int64_t.alignment, true),
        setSingle: (pointer: number, value: bigint | number, offset: number = 0): void => { this.dataview.setBigInt64(pointer + offset * this.int64_t.alignment, value as bigint, true) },
        getArray: (pointer: number, length: number): bigint[] => { const _array = []; for (let i = 0; i < length; i++) { _array[i] = this.dataview.getBigInt64(pointer + i * this.int64_t.alignment, true) } return _array; },
        setArray: (pointer: number, values: any[]): void => { for (let i = 0; i < values.length; i++) { this.dataview.setBigInt64(pointer + i * this.int64_t.alignment, values[i], true) } },
        alignment: 8,
        size: 8
    }

    public [JasmType.uint64_t] = {
        getSingle: (pointer: number, offset: number = 0): bigint => this.dataview.getBigUint64(pointer + offset * this.uint64_t.alignment, true),
        setSingle: (pointer: number, value: bigint | number, offset: number = 0): void => { this.dataview.setBigUint64(pointer + offset * this.uint64_t.alignment, value as bigint, true) },
        getArray: (pointer: number, length: number): bigint[] => { const _array = []; for (let i = 0; i < length; i++) { _array[i] = this.dataview.getBigUint64(pointer + i * this.uint64_t.alignment, true) } return _array; },
        setArray: (pointer: number, values: any[]): void => { for (let i = 0; i < values.length; i++) { this.dataview.setBigUint64(pointer + i * this.uint64_t.alignment, values[i], true) } },
        alignment: 8,
        size: 8
    }

    /* Floating types */
    public [JasmType.float] = {
        getSingle: (pointer: number, offset: number = 0): number => this.dataview.getFloat32(pointer + offset * this.float.alignment, true),
        setSingle: (pointer: number, value: number, offset: number = 0): void => { this.dataview.setFloat32(pointer + offset * this.float.alignment, value, true) },
        getArray: (pointer: number, length: number): number[] => { const _array = []; for (let i = 0; i < length; i++) { _array[i] = this.dataview.getFloat32(pointer + i * this.float.alignment, true) } return _array; },
        setArray: (pointer: number, values: number[]): void => { for (let i = 0; i < values.length; i++) { this.dataview.setFloat32(pointer + i * this.float.alignment, values[i], true) } },
        alignment: 4,
        size: 4
    }

    public [JasmType.double] = {
        getSingle: (pointer: number, offset: number = 0): number => this.dataview.getFloat64(pointer + offset * this.double.alignment, true),
        setSingle: (pointer: number, value: number, offset: number = 0): void => { this.dataview.setFloat64(pointer + offset * this.double.alignment, value, true) },
        getArray: (pointer: number, length: number): number[] => { const _array = []; for (let i = 0; i < length; i++) { _array[i] = this.dataview.getFloat64(pointer + i * this.double.alignment, true) } return _array; },
        setArray: (pointer: number, values: number[]): void => { for (let i = 0; i < values.length; i++) { this.dataview.setFloat64(pointer + i * this.double.alignment, values[i], true) } },
        alignment: 8,
        size: 8
    }

    /* Basic types */
    public [JasmType.bool] = {
        getSingle: (pointer: number, offset: number = 0): boolean => !!this.dataview.getUint8(pointer + offset),
        setSingle: (pointer: number, value: number | boolean, offset: number = 0): void => { this.dataview.setUint8(pointer + offset, value ? 1 : 0) },
        getArray: (pointer: number, length: number): boolean[] => { const _array = []; for (let i = 0; i < length; i++) { _array[i] = !!this.dataview.getUint8(pointer + i) } return _array; },
        setArray: (pointer: number, values: number[] | boolean[]): void => { for (let i = 0; i < values.length; i++) { this.dataview.setUint8(pointer + i, values[i] ? 1 : 0) } },
        alignment: 1,
        size: 1
    }

    public [JasmType.char] = this.int8_t;
    public [JasmType.schar] = this.int8_t;
    public [JasmType.uchar] = this.uint8_t;
    public [JasmType.short] = this.int16_t;
    public [JasmType.ushort] = this.uint16_t;
    public [JasmType.int] = this.int32_t;
    public [JasmType.uint] = this.uint32_t;
    public [JasmType.enum] = this.int32_t;
    public [JasmType.long] = this.int32_t;
    public [JasmType.ulong] = this.uint32_t;
    public [JasmType.llong] = this.int64_t;
    public [JasmType.ullong] = this.uint64_t;
    public [JasmType.pointer] = this.uint32_t;
    public [JasmType.size_t] = this.uint32_t;

    /* Structs */
    public compileStruct(struct: JasmStruct): JasmCompiledStruct {
        let compiledStruct: JasmCompiledStruct = {
            members: [],
            alignment: 0,
            size: 0,
            isUnion: struct.isUnion || false
        };
        let structOffset = 0;

        for (let i = 0; i < struct.members.length; i++) {
            const member = struct.members[i];
            if (member.name.length < 1) {
                continue;
            }

            const typeData = this.calculateTypeData(member.type);

            /* Add necessary padding to calculate member offset
               NOTE: as unions offset is always 0, this won't ever execute */
            const deltaOffset = structOffset % typeData.alignment;
            if (structOffset !== 0 && deltaOffset !== 0) {
                structOffset += typeData.alignment - deltaOffset;
            }

            const compiledMemberOffset = structOffset;
            const compiledMemberLength = (member.length && member.length > 0) ? member.length : 1;
            const compiledMemberSize = typeData.unitSize * compiledMemberLength;

            /* Set new structure size and save most restrictive alignment */
            if (!struct.isUnion) {
                structOffset += compiledMemberSize;
                compiledStruct.size = structOffset;
            } else if (compiledStruct.size < compiledMemberSize) {
                compiledStruct.size = compiledMemberSize;
            }

            if (compiledStruct.alignment < typeData.alignment) {
                compiledStruct.alignment = typeData.alignment;
            }

            compiledStruct.members[i] = {
                name: member.name,
                type: typeData.resolvedType,
                length: compiledMemberLength,
                offset: compiledMemberOffset,
                absoluteOffset: 0
            };
        }

        /* Calculate structure padding at end */
        const structDeltaOffset = compiledStruct.size % compiledStruct.alignment;
        if (compiledStruct.size !== 0 && structDeltaOffset !== 0) {
            compiledStruct.size += compiledStruct.alignment - structDeltaOffset;
        }

        this.calculateAbsoluteOffsets(compiledStruct, 0);
        return compiledStruct;
    }

    private calculateTypeData(type: JasmType | JasmStruct | JasmCompiledStruct) {
        let alignment = 0;
        let unitSize = 0;
        let resolvedType;

        /* Structs are a special case: its alignment must be computed */
        if (isJasmType(type)) {
            resolvedType = type;
            alignment = this[type].alignment;
            unitSize = this[type].size;
        } else {
            resolvedType = (isJasmStruct(type)) ? this.compileStruct(type) : type;
            alignment = resolvedType.alignment;
            unitSize = resolvedType.size;
        }

        return {
            alignment, unitSize, resolvedType
        }
    }

    private calculateAbsoluteOffsets(compiledStruct: JasmCompiledStruct, structOffset: number): void {
        for (const compiledMember of compiledStruct.members) {
            compiledMember.absoluteOffset = compiledMember.offset + structOffset;
            if (!isJasmType(compiledMember.type)) {
                this.calculateAbsoluteOffsets(compiledMember.type, compiledMember.absoluteOffset);
            }
        }
    }

    /* Objects */
    public instantiate(type: JasmType | JasmCompiledStruct, basePointer: number, length: number = 1): JasmObject {
        /* Note: object must be a valid JasmObject at the end of the function */
        let object: any = {};

        if (isJasmType(type)) {
            this.instantiateType(object, type, basePointer, length);
        } else {
            this.instantiateStruct(object, type, basePointer, length);
        }

        return object as JasmObject;
    }

    private instantiateType(object: any, type: JasmType, basePointer: number, length: number) {
        if (length === 1) {
            this.instantiateSingleTypeValue(object, type, basePointer);
        } else {
            for (let i = 0; i < length; i++) {
                object[i] = {};
                this.instantiateSingleTypeValue(object[i], type, basePointer, i);
            }
            this.instantiateArrayTypeValue(object, type, basePointer, length);
        }
    }

    private instantiateStruct(object: any, type: JasmCompiledStruct, basePointer: number, length: number) {
        if (length === 1) {
            this.instantiateSingleStructValue(object, type, basePointer);
        } else {
            for (let i = 0; i < length; i++) {
                object[i] = {};
                this.instantiateSingleStructValue(object[i], type, basePointer, i);
            }
            this.instantiateArrayStructValue(object, type, basePointer, length);
        }
    }

    private instantiateSingleStructValue(object: any, type: JasmCompiledStruct, basePointer: number, offset: number = 0) {
        let structBasePointer = basePointer + offset * type.size;

        for (const compiledMember of type.members) {
            object[compiledMember.name] = {};
            if (isJasmType(compiledMember.type)) {
                this.instantiateType(object[compiledMember.name], compiledMember.type, structBasePointer + compiledMember.absoluteOffset, compiledMember.length);
            } else {
                this.instantiateStruct(object[compiledMember.name], compiledMember.type, structBasePointer + compiledMember.absoluteOffset, compiledMember.length);
            }
        }

        Object.defineProperties(object, {
            [valueSymbol]: {
                get: () => { return Object.fromEntries(Object.keys(object).map(key => [key, object[key][valueSymbol]])); },
                set: (value: any) => { Object.keys(value).forEach(key => object[key][valueSymbol] = value[key]) }
            },
            [addressSymbol]: { get: () => structBasePointer },
            [sizeSymbol]: { get: () => type.size },
            [alignmentSymbol]: { get: () => type.alignment }
        });
    }

    private instantiateArrayStructValue(object: any, type: JasmCompiledStruct, basePointer: number, length: number) {
        Object.defineProperties(object, {
            [valueSymbol]: {
                get: () => Object.keys(object).map(key => object[key][valueSymbol]),
                set: (value) => Object.keys(object).forEach(key => object[key][valueSymbol] = value[key])
            },
            [addressSymbol]: { get: () => basePointer },
            [sizeSymbol]: { get: () => type.size },
            [alignmentSymbol]: { get: () => type.alignment }
        });
    }

    private instantiateSingleTypeValue(object: any, type: JasmType, basePointer: number, offset: number = 0) {
        if (!offset) {
            Object.defineProperty(object, valueSymbol, {
                get: () => this[type].getSingle(basePointer),
                set: (value: any) => this[type].setSingle(basePointer, value)
            });
        } else {
            Object.defineProperty(object, valueSymbol, {
                get: () => this[type].getSingle(basePointer, offset),
                set: (value: any) => this[type].setSingle(basePointer, value, offset)
            });
        }

        Object.defineProperties(object, {
            [addressSymbol]: { get: () => basePointer + offset * this[type].alignment },
            [sizeSymbol]: { get: () => this[type].size },
            [alignmentSymbol]: { get: () => this[type].alignment }
        });
    }

    private instantiateArrayTypeValue(object: any, type: JasmType, basePointer: number, length: number) {
        Object.defineProperties(object, {
            [valueSymbol]: {
                get: () => this[type].getArray(basePointer, length),
                set: (value: any) => this[type].setArray(basePointer, value)
            },
            [addressSymbol]: { get: () => basePointer },
            [sizeSymbol]: { get: () => this[type].size },
            [alignmentSymbol]: { get: () => this[type].alignment }
        });
    }

    /* String utilities */
    public getAsciiString(pointer: number): string {
        let _str = "";
        for (let i = pointer, ch; ch = this.dataview.getUint8(i); i++) {
            _str += String.fromCharCode(ch);
        }
        return _str;
    }

    public setAsciiString(pointer: number, str: string) {
        let i;
        for (i = 0; i < str.length && str[i]; i++) {
            this.dataview.setUint8(pointer + i, str.charCodeAt(i));
        }
        this.dataview.setUint8(pointer + i, 0);
    }

    public encodeUtf8String(str: string): Uint8Array {
        return this.textEncoder.encode(str);
    }

    public getUtf8String(pointer: number): string {
        let strEnd;
        for (strEnd = pointer; this.view8u[strEnd]; strEnd++);
        return this.textDecoder.decode(this.view8u.slice(pointer, strEnd));
    }

    public setUtf8String(pointer: number, str: string | Uint8Array) {
        let i;
        if (typeof str === "string") {
            str = this.textEncoder.encode(str);
        }
        for (i = 0; i < str.length; i++) {
            this.dataview.setUint8(pointer + i, str[i]);
        }
        this.dataview.setUint8(pointer + i, 0);
    }
}