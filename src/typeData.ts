import { JasmType, TJasmTypesData } from './types';

const int8TypeData = {
  size: 1,
  alignment: 1,
};

const int16TypeData = {
  size: 2,
  alignment: 2,
};

const int32TypeData = {
  size: 4,
  alignment: 4,
};

const int64TypeData = {
  size: 8,
  alignment: 8,
};

const float32TypeData = {
  size: 4,
  alignment: 4,
};

const float64TypeData = {
  size: 8,
  alignment: 8,
};

export const jasmTypeData: TJasmTypesData = {
  [JasmType.int8_t]: int8TypeData,
  [JasmType.uint8_t]: int8TypeData,
  [JasmType.int16_t]: int16TypeData,
  [JasmType.uint16_t]: int16TypeData,
  [JasmType.int32_t]: int32TypeData,
  [JasmType.uint32_t]: int32TypeData,
  [JasmType.int64_t]: int64TypeData,
  [JasmType.uint64_t]: int64TypeData,
  [JasmType.float]: float32TypeData,
  [JasmType.double]: float64TypeData,
  [JasmType.bool]: int8TypeData,
  [JasmType.char]: int8TypeData,
  [JasmType.schar]: int8TypeData,
  [JasmType.uchar]: int8TypeData,
  [JasmType.short]: int16TypeData,
  [JasmType.ushort]: int16TypeData,
  [JasmType.int]: int32TypeData,
  [JasmType.uint]: int32TypeData,
  [JasmType.enum]: int32TypeData,
  [JasmType.long]: int32TypeData,
  [JasmType.ulong]: int32TypeData,
  [JasmType.llong]: int64TypeData,
  [JasmType.ullong]: int64TypeData,
  [JasmType.pointer]: int32TypeData,
  [JasmType.size_t]: int32TypeData,
};
