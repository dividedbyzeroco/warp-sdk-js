export interface IStorageAdapter {
    set(key: string, value: string | undefined): void;
    get(key: string): string | undefined;
    remove(key: string): void;
}
export declare const IStorageAdapter: {
    new (config: StorageConfigType): IStorageAdapter;
};
export declare type StorageConfigType = {
    prefix: string;
};
