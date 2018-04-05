import WarpServer from 'warp-server';
import { UserClass } from 'warp-server/dist/classes/user';
import { Warp } from '../../../index';
import { IHttpAdapter, HttpConfigType, LogInOptionsType, BecomeOptionsType, LogOutOptionsType, FindOptionsType, GetOptionsType, SaveOptionsType, DestroyOptionsType, RunOptionsType } from '../../../types/http';
export default class APIHttpAdapter implements IHttpAdapter {
    _api: WarpServer;
    _sessionToken: string | undefined;
    _currentUser: UserClass | undefined;
    constructor(config: HttpConfigType);
    readonly metadata: {
        client: string;
        sdkVersion: any;
        isMaster: boolean;
    };
    getWarp(sessionToken?: string, currentUser?: UserClass): Warp;
    logIn({username, email, password}: LogInOptionsType): Promise<object>;
    become({sessionToken}: BecomeOptionsType): Promise<object>;
    logOut({sessionToken}: LogOutOptionsType): Promise<object>;
    find({className, select, include, where, sort, skip, limit}: FindOptionsType): Promise<Array<object>>;
    get({className, id, select, include}: GetOptionsType): Promise<object>;
    save({sessionToken, className, keys, id}: SaveOptionsType): Promise<object>;
    destroy({sessionToken, className, id}: DestroyOptionsType): Promise<object>;
    run({sessionToken, functionName, keys}: RunOptionsType): Promise<any>;
    _getCurrentUser(sessionToken: string | undefined): Promise<any>;
}
