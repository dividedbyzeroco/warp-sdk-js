export type JsonFunctionsType = {
    set: (path: string, value: Object) => void;
    append: (path: string, value: Object | Array<any>) => void;
}