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
    new(conig: HttpConfigType): IHttpAdapter;
}

export type HttpConfigType = {
    apiKey?: string,
    masterKey?: string,
    serverURL?: string,
    api?: any,
    sessionToken?: string,
    currentUser?: any,
    timeout?: number,
    maxRequests?: number
};

export type LogInOptionsType = {
    username?: string,
    email?: string,
    password: string
};

export type BecomeOptionsType = {
    sessionToken: string,
    revokedAt?: string
};

export type LogOutOptionsType = {
    sessionToken?: string | undefined
};

export type FindOptionsType = {
    sessionToken?: string,
    className: string,
    select?: Array<string>,
    include?: Array<string>,
    where?: {[key: string]: {[constraint: string]: any}},
    sort?: Array<string>,
    skip?: number,
    limit?: number
};

export type GetOptionsType = {
    sessionToken?: string,
    className: string,
    id: number,
    select?: Array<string>,
    include?: Array<string>
};

export type SaveOptionsType = {
    sessionToken?: string,
    className: string,
    keys: {[name: string]: any},
    id?: number
};

export type DestroyOptionsType = {
    sessionToken?: string,
    className: string;
    id: number;
};

export type RunOptionsType = {
    sessionToken?: string,
    functionName: string;
    keys?: {[name: string]: any}
};