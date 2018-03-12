// @flow
export interface IHttpAdapter {
    constructor(config: HttpConfigType): void;
    logIn(options: LogInOptionsType): Promise<Object>;
    become(options: BecomeOptionsType): Promise<Object>;
    logOut(options: LogOutOptionsType): Promise<Object>;
    find(options: FindOptionsType): Promise<Array<Object>>;
    get(options: GetOptionsType): Promise<Object>;
    save(options: SaveOptionsType): Promise<Object>;
    destroy(options: DestroyOptionsType): Promise<Object>;
    run(options: RunOptionsType): Promise<any>;
}

export type HttpConfigType = {
    apiKey?: string,
    masterKey?: string,
    serverURL?: string,
    api?: Object,
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
    sessionToken: string
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