import { isJasmType, JasmType } from "./JasmType.js";
import { isJasmStruct, JasmCompiledStruct, JasmStruct } from "./JasmStruct.js";

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
        getSingle: (pointer: number): number => this.dataview.getInt8(pointer),
        setSingle: (pointer: number, value: number): void => { this.dataview.setInt8(pointer, value) },
        getArray: (pointer: number, size: number): number[] => { const _array = []; for (let i = 0; i < size; i++) { _array[i] = this.dataview.getInt8(pointer + i) } return _array; },
        setArray: (pointer: number, values: number[]): void => { for (let i = 0; i < values.length; i++) { this.dataview.setInt8(pointer + i, values[i]) } },
        alignment: 1,
        size: 1
    }

    public [JasmType.uint8_t] = {
        getSingle: (pointer: number): number => this.dataview.getUint8(pointer),
        setSingle: (pointer: number, value: number): void => { this.dataview.setUint8(pointer, value) },
        getArray: (pointer: number, size: number): number[] => { const _array = []; for (let i = 0; i < size; i++) { _array[i] = this.dataview.getUint8(pointer + i) } return _array; },
        setArray: (pointer: number, values: number[]): void => { for (let i = 0; i < values.length; i++) { this.dataview.setUint8(pointer + i, values[i]) } },
        alignment: 1,
        size: 1
    }

    public [JasmType.int16_t] = {
        getSingle: (pointer: number): number => this.dataview.getInt16(pointer, true),
        setSingle: (pointer: number, value: number): void => { this.dataview.setInt16(pointer, value, true) },
        getArray: (pointer: number, size: number): number[] => { const _array = []; for (let i = 0; i < size; i++) { _array[i] = this.dataview.getInt16(pointer + i * this.int16_t.alignment, true) } return _array; },
        setArray: (pointer: number, values: number[]): void => { for (let i = 0; i < values.length; i++) { this.dataview.setInt16(pointer + i * this.int16_t.alignment, values[i], true) } },
        alignment: 2,
        size: 2
    }

    public [JasmType.uint16_t] = {
        getSingle: (pointer: number): number => this.dataview.getUint16(pointer, true),
        setSingle: (pointer: number, value: number): void => { this.dataview.setUint16(pointer, value, true) },
        getArray: (pointer: number, size: number): number[] => { const _array = []; for (let i = 0; i < size; i++) { _array[i] = this.dataview.getUint16(pointer + i * this.uint16_t.alignment, true) } return _array; },
        setArray: (pointer: number, values: number[]): void => { for (let i = 0; i < values.length; i++) { this.dataview.setUint16(pointer + i * this.uint16_t.alignment, values[i], true) } },
        alignment: 2,
        size: 2
    }

    public [JasmType.int32_t] = {
        getSingle: (pointer: number): number => this.dataview.getInt32(pointer, true),
        setSingle: (pointer: number, value: number): void => { this.dataview.setInt32(pointer, value, true) },
        getArray: (pointer: number, size: number): number[] => { const _array = []; for (let i = 0; i < size; i++) { _array[i] = this.dataview.getInt32(pointer + i * this.int32_t.alignment, true) } return _array; },
        setArray: (pointer: number, values: number[]): void => { for (let i = 0; i < values.length; i++) { this.dataview.setInt32(pointer + i * this.int32_t.alignment, values[i], true) } },
        alignment: 4,
        size: 4
    }

    public [JasmType.uint32_t] = {
        getSingle: (pointer: number): number => this.dataview.getUint32(pointer, true),
        setSingle: (pointer: number, value: number): void => { this.dataview.setUint32(pointer, value, true) },
        getArray: (pointer: number, size: number): number[] => { const _array = []; for (let i = 0; i < size; i++) { _array[i] = this.dataview.getUint32(pointer + i * this.uint32_t.alignment, true) } return _array; },
        setArray: (pointer: number, values: number[]): void => { for (let i = 0; i < values.length; i++) { this.dataview.setUint32(pointer + i * this.uint32_t.alignment, values[i], true) } },
        alignment: 4,
        size: 4
    }

    public [JasmType.int64_t] = {
        getSingle: (pointer: number): bigint => this.dataview.getBigInt64(pointer, true),
        setSingle: (pointer: number, value: bigint): void => { this.dataview.setBigInt64(pointer, value, true) },
        getArray: (pointer: number, size: number): bigint[] => { const _array = []; for (let i = 0; i < size; i++) { _array[i] = this.dataview.getBigInt64(pointer + i * this.int64_t.alignment, true) } return _array; },
        setArray: (pointer: number, values: bigint[]): void => { for (let i = 0; i < values.length; i++) { this.dataview.setBigInt64(pointer + i * this.int64_t.alignment, values[i], true) } },
        alignment: 8,
        size: 8
    }

    public [JasmType.uint64_t] = {
        getSingle: (pointer: number): bigint => this.dataview.getBigUint64(pointer, true),
        setSingle: (pointer: number, value: bigint): void => { this.dataview.setBigUint64(pointer, value, true) },
        getArray: (pointer: number, size: number): bigint[] => { const _array = []; for (let i = 0; i < size; i++) { _array[i] = this.dataview.getBigUint64(pointer + i * this.uint64_t.alignment, true) } return _array; },
        setArray: (pointer: number, values: bigint[]): void => { for (let i = 0; i < values.length; i++) { this.dataview.setBigUint64(pointer + i * this.uint64_t.alignment, values[i], true) } },
        alignment: 8,
        size: 8
    }

    /* Floating types */
    public [JasmType.float] = {
        getSingle: (pointer: number): number => this.dataview.getFloat32(pointer, true),
        setSingle: (pointer: number, value: number): void => { this.dataview.setFloat32(pointer, value, true) },
        getArray: (pointer: number, size: number): number[] => { const _array = []; for (let i = 0; i < size; i++) { _array[i] = this.dataview.getFloat32(pointer + i * this.float.alignment, true) } return _array; },
        setArray: (pointer: number, values: number[]): void => { for (let i = 0; i < values.length; i++) { this.dataview.setFloat32(pointer + i * this.float.alignment, values[i], true) } },
        alignment: 4,
        size: 4
    }

    public [JasmType.double] = {
        getSingle: (pointer: number): number => this.dataview.getFloat64(pointer, true),
        setSingle: (pointer: number, value: number): void => { this.dataview.setFloat64(pointer, value, true) },
        getArray: (pointer: number, size: number): number[] => { const _array = []; for (let i = 0; i < size; i++) { _array[i] = this.dataview.getFloat64(pointer + i * this.double.alignment, true) } return _array; },
        setArray: (pointer: number, values: number[]): void => { for (let i = 0; i < values.length; i++) { this.dataview.setFloat64(pointer + i * this.double.alignment, values[i], true) } },
        alignment: 8,
        size: 8
    }

    /* Basic types */
    public [JasmType.bool] = {
        getSingle: (pointer: number): boolean => !!this.dataview.getUint8(pointer),
        setSingle: (pointer: number, value: boolean): void => { this.dataview.setUint8(pointer, value ? 1 : 0) },
        getArray: (pointer: number, size: number): boolean[] => { const _array = []; for (let i = 0; i < size; i++) { _array[i] = !!this.dataview.getUint8(pointer + i) } return _array; },
        setArray: (pointer: number, values: boolean[]): void => { for (let i = 0; i < values.length; i++) { this.dataview.setUint8(pointer + i, values[i] ? 1 : 0) } },
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

    /* String types */
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