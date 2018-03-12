// @flow
/**
 * References
 */
import type { 
    IStorageAdapter, 
    StorageConfigType
} from '../../../types/storage';

 export default class APIStorageAdapter implements IStorageAdapter {

    _prefix: string;
    _client: {[name: string]: string | void} = {};

    constructor(config: StorageConfigType): void {
        // Get params
        const { prefix }  = config;

        // Set key and url
        this._prefix = prefix;
    }

    _getKey(key: string) {
        return `${this._prefix}:${key}`;
    }

    set(key: string, value: string | void): void {
        this._client[this._getKey(key)] = value;
    }

    get(key: string): string | void {
        const item = this._client[this._getKey(key)];

        if(item === null) return undefined;
        return item;
    }

    remove(key: string): void {
        delete this._client[this._getKey(key)];
    }
 }