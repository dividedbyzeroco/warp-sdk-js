// @flow
/**
 * Reference
 */
import Error from '../../utils/error';
import type { IHttpAdapter, HttpConfigType } from '../../types/http';
import BrowserHttpAdapter from './browser';
import APIHttpAdapter from './api';

export default class Http {

    static Platform = Object.freeze({
        'browser': BrowserHttpAdapter,
        'api': APIHttpAdapter
    });

    /**
     * Static use
     * @param {String} platform
     */
    static use(platform: string, config: HttpConfigType): IHttpAdapter {
        // Get http platform
        const http = this.Platform[platform];

        // Check if platform exists
        if(typeof http === 'undefined')
            throw new Error(Error.Code.MissingConfiguration, `Http \`${platform}\` is not supported`);
        else
            return new http(config);
    }

}