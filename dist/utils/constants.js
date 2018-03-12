'use strict';Object.defineProperty(exports, "__esModule", { value: true });var InternalKeys = exports.InternalKeys = Object.freeze({
    Id: 'id',
    Timestamps: Object.freeze({
        CreatedAt: 'created_at',
        UpdatedAt: 'updated_at',
        DeletedAt: 'deleted_at' }),

    Auth: Object.freeze({
        User: 'user',
        Username: 'username',
        Email: 'email',
        Password: 'password',
        Session: 'session',
        Origin: 'origin',
        SessionToken: 'session_token',
        RevokedAt: 'revoked_at' }),

    Pointers: Object.freeze({
        LegacyClassName: 'className',
        ClassName: 'class_name',
        Attributes: 'attributes' }) });



var Defaults = exports.Defaults = Object.freeze({
    Query: Object.freeze({
        Sort: [InternalKeys.Id],
        Skip: 0,
        Limit: 100 }) });