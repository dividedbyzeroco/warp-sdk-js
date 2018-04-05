import { IStorageAdapter, StorageConfigType } from '../../types/storage';
import BrowserStorageAdapter from './browser';
import APIStorageAdapter from './api';
import NodeStorageAdapter from './node';
export default class Storage {
    static Platform: Readonly<{
        'browser': typeof BrowserStorageAdapter;
        'api': typeof APIStorageAdapter;
        'node': typeof NodeStorageAdapter;
    }>;
    /**
     * Static use
     * @param {String} platform
     */
    static use(platform: string, config: StorageConfigType): IStorageAdapter;
}
