import { jasmTypeData } from './typeData';
import {
  IJasm,
  isJasmBaseObject,
  isJasmType,
  JasmType,
  TJasmBaseObject,
  TJasmStruct,
  TJasmObject,
  TJasmObjectConstructor,
  TJasmStructDefinition,
  TJasmTypeData,
  TJasmObjectDeclaration,
  isJasmObjectConstructor,
  TJasmObjectProxy,
  $getValue,
  $getAddress,
  $baseAddress,
  $type,
  $deref,
  $offset,
  IJasmTypeMethods,
  $setValue,
} from './types';

export class Jasm implements IJasm {
  public static textDecoder = new TextDecoder();
  public static textEncoder = new TextEncoder();
  private dataview!: DataView;

  constructor(private memory: WebAssembly.Memory) {
    this.attachToMemory();
  }

  private attachToMemory() {
    this.dataview = new DataView(this.memory.buffer);
  }

  private isDettachedFromMemory() {
    return !this.dataview.buffer.byteLength;
  }

  private reattachToMemory() {
    if (this.isDettachedFromMemory()) {
      this.attachToMemory();
    }
  }

  /* Structs */
  public static struct(struct: TJasmStructDefinition): TJasmStruct {
    const compiledStruct: TJasmStruct = {
      members: [],
      alignment: 0,
      size: 0,
      isUnion: struct.isUnion || false,
    };
    let structOffset = 0;

    for (let i = 0; i < struct.members.length; i++) {
      const member = struct.members[i];
      if (member.name.length < 1) {
        continue;
      }

      const typeData = Jasm.getTypeData(member.type);

      /* Add necessary padding to calculate member offset
               NOTE: as unions offset is always 0, this won't ever execute */
      const deltaOffset = structOffset % typeData.alignment;
      if (deltaOffset !== 0) {
        structOffset += typeData.alignment - deltaOffset;
      }

      const compiledMemberOffset = structOffset;
      const compiledMemberLength =
        member.length && member.length > 0 ? member.length : 1;
      const compiledMemberSize = typeData.size * compiledMemberLength;

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
        type: member.type,
        length: compiledMemberLength,
        offset: compiledMemberOffset,
        pointsTo: member.pointsTo ?? null,
      };
    }

    /* Calculate structure padding at end */
    const structDeltaOffset = compiledStruct.size % compiledStruct.alignment;
    if (compiledStruct.size !== 0 && structDeltaOffset !== 0) {
      compiledStruct.size += compiledStruct.alignment - structDeltaOffset;
    }

    return compiledStruct;
  }

  public static getTypeData(type: JasmType | TJasmStruct): TJasmTypeData {
    return isJasmType(type) ? jasmTypeData[type] : type;
  }

  /* Objects */
  public create({ type, length = 1, pointsTo = null }: TJasmObjectDeclaration) {
    const typeData = Jasm.getTypeData(type);
    const baseObject = {
      [$baseAddress]: 0,
      [$offset]: (offset: number) =>
        this._createProxy(
          baseObject,
          baseObject[$baseAddress] + offset * typeData.size
        )(),
    } as TJasmBaseObject;

    return this._create(baseObject, { type, length, pointsTo }, baseObject, 0);
  }

  private _createProxy(
    rootObject: TJasmBaseObject,
    address: number
  ): TJasmObjectProxy {
    return () => {
      rootObject[$baseAddress] = address;
      return rootObject;
    };
  }

  private _create(
    object: TJasmObject | TJasmBaseObject,
    { type, length, pointsTo }: Required<TJasmObjectDeclaration>,
    rootObject: TJasmBaseObject,
    rootAddressOffset: number
  ): TJasmObjectConstructor {
    /* Other symbols */
    const typeData = Jasm.getTypeData(type);
    object[$getAddress] = isJasmBaseObject(object)
      ? () => object[$baseAddress]
      : () => rootObject[$getAddress]() + rootAddressOffset;
    object[$type] = typeData;

    /* Define valueSymbol */
    const isArray = length > 1;
    if (isJasmType(type)) {
      if (!isArray) {
        object[$getValue] = () => this[type].getSingle(object[$getAddress]());
        object[$setValue] = (value: any) =>
          (this[type].setSingle as any)(object[$getAddress](), value);
      } else {
        object[$getValue] = () =>
          this[type].getArray(object[$getAddress](), length);
        object[$setValue] = (values: any) =>
          this[type].setArray(object[$getAddress](), values);
      }
    } else {
      if (!isArray) {
        object[$getValue] = () =>
          type.members.reduce(
            (acc, member) => ({
              ...acc,
              [member.name]: object[member.name][$getValue](),
            }),
            {}
          );
        object[$setValue] = (values: Record<string, any>) =>
          Object.entries(values).forEach(([key, value]) =>
            object[key][$setValue](value)
          );

        type.members.forEach((member) => {
          object[member.name] = {} as TJasmObject;
          this._create(
            object[member.name],
            member,
            rootObject,
            rootAddressOffset + member.offset
          );
        });
      } else {
        object[$getValue] = () =>
          [...Array(length).keys()].map((i) => object[i][$getValue]());
        object[$setValue] = (values: Record<string, any>[]) =>
          [...Array(length).keys()].forEach((i) =>
            object[i][$setValue](values[i])
          );
      }
    }

    /* Define children if array */
    if (isArray) {
      [...Array(length).keys()].forEach((i) => {
        object[i] = {} as TJasmObject;
        this._create(
          object[i],
          { type, length: 1, pointsTo },
          rootObject,
          rootAddressOffset + typeData.size * i
        );
      });
    }

    /* Define dereference operator */
    if (!isArray && type === JasmType.pointer && pointsTo) {
      const dereferencedObjectConstructor = isJasmObjectConstructor(pointsTo)
        ? pointsTo
        : this.create(pointsTo);
      const pointedToTypeData = Jasm.getTypeData(pointsTo.type);
      object[$deref] = (offset: number) =>
        dereferencedObjectConstructor.at(
          object[$getValue]() + offset * pointedToTypeData.size
        )();
    }

    return {
      at: (address: number) => this._createProxy(rootObject, address),
      type,
    };
  }

  /* String utilities */
  public readString(address: number): string {
    this.reattachToMemory();
    let string = '';
    for (let i = address, char; (char = this.dataview.getUint8(i)); i++) {
      string += String.fromCharCode(char);
    }
    return string;
  }

  public copyString(address: number, string: string) {
    this.reattachToMemory();
    let i;
    for (i = 0; i < string.length; i++) {
      this.dataview.setUint8(address + i, string.charCodeAt(i));
    }
    this.dataview.setUint8(address + i, 0);
  }

  public getStringLength(address: number): number {
    return this.getStringEndAddress(address) - address;
  }

  private getStringEndAddress(address: number): number {
    this.reattachToMemory();
    let endAddress;
    for (
      endAddress = address;
      this.dataview.getUint8(endAddress);
      endAddress++
    );
    return endAddress;
  }

  /* Type methods */
  private createTypeMethods<T>(
    type: TJasmTypeData,
    setter: (address: number, value: T) => void,
    getter: (address: number) => T
  ): IJasmTypeMethods<T> {
    return {
      getSingle: (address: number): T => {
        this.reattachToMemory();
        return getter(address);
      },
      setSingle: (address: number, value: T): void => {
        this.reattachToMemory();
        return setter(address, value);
      },
      getArray: (address: number, length: number): T[] => {
        this.reattachToMemory();
        const values: T[] = [];
        for (let offset = 0; offset < length; offset++) {
          values[offset] = getter(address + offset * type.size);
        }
        return values;
      },
      setArray: (address: number, values: T[]): void => {
        this.reattachToMemory();
        for (let offset = 0; offset < values.length; offset++) {
          setter(address + offset * type.size, values[offset]);
        }
      },
    };
  }

  public [JasmType.int8_t] = this.createTypeMethods<number>(
    jasmTypeData[JasmType.int8_t],
    (address, value) => this.dataview.setInt8(address, value),
    (address) => this.dataview.getInt8(address)
  );
  public [JasmType.uint8_t] = this.createTypeMethods<number>(
    jasmTypeData[JasmType.uint8_t],
    (address, value) => this.dataview.setUint8(address, value),
    (address) => this.dataview.getUint8(address)
  );
  public [JasmType.int16_t] = this.createTypeMethods<number>(
    jasmTypeData[JasmType.int16_t],
    (address, value) => this.dataview.setInt16(address, value, true),
    (address) => this.dataview.getInt16(address, true)
  );
  public [JasmType.uint16_t] = this.createTypeMethods<number>(
    jasmTypeData[JasmType.uint16_t],
    (address, value) => this.dataview.setUint16(address, value, true),
    (address) => this.dataview.getUint16(address, true)
  );
  public [JasmType.int32_t] = this.createTypeMethods<number>(
    jasmTypeData[JasmType.int32_t],
    (address, value) => this.dataview.setInt32(address, value, true),
    (address) => this.dataview.getInt32(address, true)
  );
  public [JasmType.uint32_t] = this.createTypeMethods<number>(
    jasmTypeData[JasmType.uint32_t],
    (address, value) => this.dataview.setUint32(address, value, true),
    (address) => this.dataview.getUint32(address, true)
  );
  public [JasmType.int64_t] = this.createTypeMethods<bigint>(
    jasmTypeData[JasmType.int64_t],
    (address, value) => this.dataview.setBigInt64(address, value, true),
    (address) => this.dataview.getBigInt64(address, true)
  );
  public [JasmType.uint64_t] = this.createTypeMethods<bigint>(
    jasmTypeData[JasmType.uint64_t],
    (address, value) => this.dataview.setBigUint64(address, value, true),
    (address) => this.dataview.getBigUint64(address, true)
  );
  public [JasmType.float] = this.createTypeMethods<number>(
    jasmTypeData[JasmType.float],
    (address, value) => this.dataview.setFloat32(address, value, true),
    (address) => this.dataview.getFloat32(address, true)
  );
  public [JasmType.double] = this.createTypeMethods<number>(
    jasmTypeData[JasmType.double],
    (address, value) => this.dataview.setFloat64(address, value, true),
    (address) => this.dataview.getFloat64(address, true)
  );
  public [JasmType.bool] = this.createTypeMethods<boolean>(
    jasmTypeData[JasmType.bool],
    (address, value) => this.dataview.setUint8(address, value ? 1 : 0),
    (address) => Boolean(this.dataview.getUint8(address))
  );
  public [JasmType.char] = this[JasmType.int8_t];
  public [JasmType.schar] = this[JasmType.int8_t];
  public [JasmType.uchar] = this[JasmType.uint8_t];
  public [JasmType.short] = this[JasmType.int16_t];
  public [JasmType.ushort] = this[JasmType.uint16_t];
  public [JasmType.int] = this[JasmType.int32_t];
  public [JasmType.uint] = this[JasmType.uint32_t];
  public [JasmType.enum] = this[JasmType.int32_t];
  public [JasmType.long] = this[JasmType.int32_t];
  public [JasmType.ulong] = this[JasmType.uint32_t];
  public [JasmType.llong] = this[JasmType.int64_t];
  public [JasmType.ullong] = this[JasmType.uint64_t];
  public [JasmType.pointer] = this[JasmType.uint32_t];
  public [JasmType.size_t] = this[JasmType.uint32_t];
}
