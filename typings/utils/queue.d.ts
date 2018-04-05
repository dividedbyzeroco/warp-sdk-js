export default class Queue {
    _requestInterval: number;
    _maxRequests: number;
    _timeout: number;
    _requests: number;
    constructor(maxRequests: number, requestInterval: number, timeout: number);
    _sleep(): Promise<void>;
    push(request: Promise<any>): Promise<any>;
}
