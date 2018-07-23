import Queue from '../../../utils/queue';
import { IHttpAdapter, HttpConfigType, LogInOptionsType, BecomeOptionsType, LogOutOptionsType, FindOptionsType, GetOptionsType, SaveOptionsType, DestroyOptionsType, RunOptionsType } from '../../../types/http';
export default class NodeHTTPAdapter implements IHttpAdapter {
    _apiKey: string;
    _masterKey?: string;
    _serverURL: string;
    _requestInterval: number;
    _queue: Queue;
    constructor(config: HttpConfigType);
    logIn({ username, email, password }: LogInOptionsType): Promise<object>;
    become({ sessionToken }: BecomeOptionsType): Promise<object>;
    logOut({ sessionToken }: LogOutOptionsType): Promise<object>;
    find({ className, select, include, where, sort, skip, limit }: FindOptionsType): Promise<Array<object>>;
    get({ className, id, select, include }: GetOptionsType): Promise<object>;
    save({ sessionToken, className, keys, id }: SaveOptionsType): Promise<object>;
    destroy({ sessionToken, className, id }: DestroyOptionsType): Promise<object>;
    run({ sessionToken, functionName, keys }: RunOptionsType): Promise<any>;
    _send(url: string, method: string, sessionToken?: string, body?: {
        [name: string]: any;
    }): Promise<Array<object> | object | void>;
}
