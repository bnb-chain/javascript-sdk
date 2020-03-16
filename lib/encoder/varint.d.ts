export declare const UVarInt: {
    encode: (n: number, buffer?: any, offset?: number | undefined) => any;
    decode: (bytes: any) => number;
    encodingLength: (n: number) => number;
};
export declare const VarInt: {
    encode: (n: number, buffer?: any, offset?: number | undefined) => any;
    decode: (bytes: any) => number;
    encodingLength: (n: number) => number;
};
