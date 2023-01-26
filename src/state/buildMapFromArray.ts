const buildMapFromArray = <KeyType, ValueType>(
    arr: ValueType[],
    createKey: (obj: ValueType) => KeyType
): DataByKey<KeyType, ValueType> =>
    Object.fromEntries(arr.map((x: ValueType) => [createKey(x), x]));

export default buildMapFromArray;
