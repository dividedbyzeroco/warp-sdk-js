import { IStorageAdapter, StorageConfigType } from '../../../types/storage';
export default class BrowserStorageAdapter implements IStorageAdapter {
    _prefix: string;
    _client: typeof localStorage;
    constructor(config: StorageConfigType);
    _getKey(key: string): string;
    set(key: string, value: string | void): void;
    get(key: string): string | undefined;
    remove(key: string): void;
}
