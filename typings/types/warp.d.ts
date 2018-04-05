import WarpServer from 'warp-server';
import { UserClass } from 'warp-server/dist/classes/user';
export declare type WarpOptionsType = {
    apiKey: string;
    masterKey?: string;
    serverURL?: string;
    api?: WarpServer;
    sessionToken?: string;
    currentUser?: UserClass;
    platform?: string;
    timeout?: number;
    maxRequests?: number;
    supportLegacy?: boolean;
};
