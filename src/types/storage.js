// @flow
export interface IStorageAdapter {
    constructor(config: StorageConfigType): void;
    set(key: string, value: string | void): void;
    get(key: string): string | void;
    remove(key: string): void;
}

export type StorageConfigType = {
    prefix: string
};