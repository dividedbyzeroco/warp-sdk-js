import Error from '../../utils/error';
import { IHttpAdapter, HttpConfigType } from '../../types/http';
import BrowserHttpAdapter from './browser';
import APIHttpAdapter from './api';
import NodeHTTPAdapter from './node';

export default class Http {

    static Platform = Object.freeze({
        'browser': BrowserHttpAdapter,
        'api': APIHttpAdapter,
        'node': NodeHTTPAdapter
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