import { 
    IStorageAdapter, 
    StorageConfigType
} from '../../../types/storage';

 export default class BrowserStorageAdapter implements IStorageAdapter {

    _prefix: string;
    _client: typeof localStorage = localStorage;

    constructor(config: StorageConfigType) {
        // Get params
        const { prefix }  = config;

        // Set key and url
        this._prefix = prefix;
    }

    _getKey(key: string) {
        return `${this._prefix}:${key}`;
    }

    set(key: string, value: string | void): void {
        if(typeof value !== 'undefined') this._client.setItem(this._getKey(key), value);
    }

    get(key: string): string | undefined {
        const item = this._client.getItem(this._getKey(key));

        if(item === null) return undefined;
        return item;
    }

    remove(key: string): void {
        this._client.removeItem(this._getKey(key));
    }
 }