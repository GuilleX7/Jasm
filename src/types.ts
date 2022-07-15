export const $value = Symbol('Value for JasmObjects');
export const $address = Symbol('Address for JasmObjects');
export const $type = Symbol('Type data for JasmObjects');
export const $ref = Symbol('Dereference for JasmObjects');
export const $baseAddress = Symbol('Base address for JasmBaseObjects');
export const $offset = Symbol('Offset for JasmBaseObjects')
export const $cloneAt = Symbol('Clone for JasmBaseObjects')

export enum JasmType {
  /* Fixed integer types */
  int8_t = 'int8_t',
  uint8_t = 'uint8_t',
  int16_t = 'int16_t',
  uint16_t = 'uint16_t',
  int32_t = 'int32_t',
  uint32_t = 'uint32_t',
  int64_t = 'int64_t',
  uint64_t = 'uint64_t',
  /* Floating types */
  float = 'float',
  double = 'double',
  /* Basic types  */
  bool = 'bool',
  char = 'char',
  schar = 'schar',
  uchar = 'uchar',
  short = 'short',
  ushort = 'ushort',
  int = 'int',
  uint = 'uint',
  enum = 'enum',
  long = 'long',
  ulong = 'ulong',
  llong = 'llong',
  ullong = 'ullong',
  pointer = 'pointer',
  size_t = 'size_t',
}

export interface IJasm extends IJasmTypesMethods {
  create(declaration: TJasmObjectDeclaration): TJasmObjectConstructor;
  readString(address: number): string;
  copyString(address: number, string: string): void;
  getStringLength(address: number): number;
}

export type TJasmTypeData = {
  alignment: number;
  size: number;
};

export type TJasmTypesData = Record<JasmType, TJasmTypeData>;

export interface IJasmTypeMethods<T> {
  getSingle: (address: number) => T;
  setSingle: (address: number, value: T) => void;
  getArray: (address: number, length: number) => T[];
  setArray: (address: number, values: T[]) => void;
}

export interface IJasmTypesMethods {
  [JasmType.int8_t]: IJasmTypeMethods<number>;
  [JasmType.uint8_t]: IJasmTypeMethods<number>;
  [JasmType.int16_t]: IJasmTypeMethods<number>;
  [JasmType.uint16_t]: IJasmTypeMethods<number>;
  [JasmType.int32_t]: IJasmTypeMethods<number>;
  [JasmType.uint32_t]: IJasmTypeMethods<number>;
  [JasmType.int64_t]: IJasmTypeMethods<bigint>;
  [JasmType.uint64_t]: IJasmTypeMethods<bigint>;
  [JasmType.float]: IJasmTypeMethods<number>;
  [JasmType.double]: IJasmTypeMethods<number>;
  [JasmType.bool]: IJasmTypeMethods<boolean>;
  [JasmType.char]: IJasmTypeMethods<number>;
  [JasmType.schar]: IJasmTypeMethods<number>;
  [JasmType.uchar]: IJasmTypeMethods<number>;
  [JasmType.short]: IJasmTypeMethods<number>;
  [JasmType.ushort]: IJasmTypeMethods<number>;
  [JasmType.int]: IJasmTypeMethods<number>;
  [JasmType.uint]: IJasmTypeMethods<number>;
  [JasmType.enum]: IJasmTypeMethods<number>;
  [JasmType.long]: IJasmTypeMethods<number>;
  [JasmType.ulong]: IJasmTypeMethods<number>;
  [JasmType.llong]: IJasmTypeMethods<bigint>;
  [JasmType.ullong]: IJasmTypeMethods<bigint>;
  [JasmType.pointer]: IJasmTypeMethods<number>;
  [JasmType.size_t]: IJasmTypeMethods<number>;
}

export type TJasmObject = {
  [key: string]: TJasmObject;
  [$value]: any;
  readonly [$address]: number;
  readonly [$type]: TJasmTypeData;
  readonly [$ref]: TJasmBaseObject;
};

export type TJasmBaseObject = TJasmObject & {
  [$baseAddress]: number;
  [$offset]: (offset: number) => TJasmBaseObject
  [$cloneAt]: (address: number) => TJasmObjectProxy
};

export type TJasmObjectConstructor = {
  at: (address: number) => TJasmObjectProxy;
};

export type TJasmObjectProxy = () => TJasmBaseObject;

export type TJasmObjectDeclaration = {
  type: JasmType | TJasmStruct;
  length?: number;
  pointsTo?: TJasmObjectDeclaration | TJasmObjectConstructor | null;
};

export type TJasmStructMemberDefinition = TJasmObjectDeclaration & {
  name: string;
};

export type TJasmStructDefinition = {
  members: TJasmStructMemberDefinition[];
  isUnion?: boolean;
};

export type TJasmStructMember = Required<TJasmObjectDeclaration> & {
  name: string;
  offset: number;
};

export type TJasmStruct = {
  members: TJasmStructMember[];
  alignment: number;
  size: number;
  isUnion: boolean;
};

export const isJasmBaseObject = (
  object: TJasmObject | TJasmBaseObject
): object is TJasmBaseObject => $baseAddress in object;

export const isJasmType = (x: unknown): x is JasmType =>
  Object.values(JasmType).includes(x as JasmType);

export const isJasmObjectConstructor = (
  x: TJasmObjectConstructor | TJasmObjectDeclaration
): x is TJasmObjectConstructor => 'at' in x;
