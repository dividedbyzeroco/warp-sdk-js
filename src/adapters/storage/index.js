// @flow
/**
 * Reference
 */
import Error from '../../utils/error';
import type { IStorageAdapter, StorageConfigType } from '../../types/storage';
import BrowserStorageAdapter from './browser';
import APIStorageAdapter from './api';

export default class Storage {

    static Platform = Object.freeze({
        'browser': BrowserStorageAdapter,
        'api': APIStorageAdapter
    });

    /**
     * Static use
     * @param {String} platform
     */
    static use(platform: string, config: StorageConfigType): IStorageAdapter {
        // Get storage platform
        const storage = this.Platform[platform];

        // Check if platform exists
        if(typeof storage === 'undefined')
            throw new Error(Error.Code.MissingConfiguration, `Storage \`${platform}\` is not supported`);
        else
            return new storage(config);
    }

}