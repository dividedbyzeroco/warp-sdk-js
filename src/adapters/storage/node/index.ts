import { 
    IStorageAdapter, 
    StorageConfigType
} from '../../../types/storage';

 export default class NodeStorageAdapter implements IStorageAdapter {

    _prefix: string;
    _client: {[name: string]: string | undefined} = {};

    constructor(config: StorageConfigType) {
        // Get params
        const { prefix }  = config;

        // Set key and url
        this._prefix = prefix;
    }

    _getKey(key: string) {
        return `${this._prefix}:${key}`;
    }

    set(key: string, value: string | undefined): void {
        this._client[this._getKey(key)] = value;
    }

    get(key: string): string | undefined {
        const item = this._client[this._getKey(key)];

        if(item === null) return undefined;
        return item;
    }

    remove(key: string): void {
        delete this._client[this._getKey(key)];
    }
 }