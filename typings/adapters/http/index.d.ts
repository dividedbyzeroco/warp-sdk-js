import { IHttpAdapter, HttpConfigType } from '../../types/http';
import BrowserHttpAdapter from './browser';
import APIHttpAdapter from './api';
import NodeHTTPAdapter from './node';
export default class Http {
    static Platform: Readonly<{
        'browser': typeof BrowserHttpAdapter;
        'api': typeof APIHttpAdapter;
        'node': typeof NodeHTTPAdapter;
    }>;
    /**
     * Static use
     * @param {String} platform
     */
    static use(platform: string, config: HttpConfigType): IHttpAdapter;
}
