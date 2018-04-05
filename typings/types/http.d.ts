import { IWarpServer } from 'warp-server/typings/types/api';
import { UserClass } from 'warp-server/typings/classes/user';
export interface IHttpAdapter {
    logIn(options: LogInOptionsType): Promise<object>;
    become(options: BecomeOptionsType): Promise<object>;
    logOut(options: LogOutOptionsType): Promise<object>;
    find(options: FindOptionsType): Promise<Array<object>>;
    get(options: GetOptionsType): Promise<object>;
    save(options: SaveOptionsType): Promise<object>;
    destroy(options: DestroyOptionsType): Promise<object>;
    run(options: RunOptionsType): Promise<any>;
}
export declare const IHttpAdapter: {
    new (conig: HttpConfigType): IHttpAdapter;
};
export declare type HttpConfigType = {
    apiKey?: string;
    masterKey?: string;
    serverURL?: string;
    api?: IWarpServer;
    sessionToken?: string;
    currentUser?: UserClass;
    timeout?: number;
    maxRequests?: number;
};
export declare type LogInOptionsType = {
    username?: string;
    email?: string;
    password: string;
};
export declare type BecomeOptionsType = {
    sessionToken: string;
    revokedAt?: string;
};
export declare type LogOutOptionsType = {
    sessionToken: string;
};
export declare type FindOptionsType = {
    sessionToken?: string;
    className: string;
    select?: Array<string>;
    include?: Array<string>;
    where?: {
        [key: string]: {
            [constraint: string]: any;
        };
    };
    sort?: Array<string>;
    skip?: number;
    limit?: number;
};
export declare type GetOptionsType = {
    sessionToken?: string;
    className: string;
    id: number;
    select?: Array<string>;
    include?: Array<string>;
};
export declare type SaveOptionsType = {
    sessionToken?: string;
    className: string;
    keys: {
        [name: string]: any;
    };
    id?: number;
};
export declare type DestroyOptionsType = {
    sessionToken?: string;
    className: string;
    id: number;
};
export declare type RunOptionsType = {
    sessionToken?: string;
    functionName: string;
    keys?: {
        [name: string]: any;
    };
};
