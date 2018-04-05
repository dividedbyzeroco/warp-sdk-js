import { IStorageAdapter, StorageConfigType } from '../../../types/storage';
export default class NodeStorageAdapter implements IStorageAdapter {
    _prefix: string;
    _client: {
        [name: string]: string | undefined;
    };
    constructor(config: StorageConfigType);
    _getKey(key: string): string;
    set(key: string, value: string | undefined): void;
    get(key: string): string | undefined;
    remove(key: string): void;
}
