export enum JasmType {
    /* Fixed integer types */
    int8_t = "int8_t",
    uint8_t = "uint8_t",
    int16_t = "int16_t",
    uint16_t = "uint16_t",
    int32_t = "int32_t",
    uint32_t = "uint32_t",
    int64_t = "int64_t",
    uint64_t = "uint64_t",
    /* Floating types */
    float = "float",
    double = "double",
    /* Basic types  */
    bool = "bool",
    char = "char",
    schar = "schar",
    uchar = "uchar",
    short = "short",
    ushort = "ushort",
    int = "int",
    uint = "uint",
    enum = "enum",
    long = "long",
    ulong = "ulong",
    llong = "llong",
    ullong = "ullong",
    pointer = "pointer",
    size_t = "size_t",
}

export const isJasmType = (x: any): x is JasmType => x && Object.values(JasmType).includes(x);