// References
var _ = require('underscore');

// Define Warp Client
var Warp = {
    _http: require('./http'),
    _storage: require('./storage'),
    Object: require('./object'),
    Query: require('./query'),
    Error: require('./error'),
    User: require('./user')
};

_.extend(Warp, {
    _apiKey: null,
    initialize: function(config) {        
        // Check if the API Key has been set
        if(!config.apiKey) throw new Warp.Error(Warp.Error.Code.MissingConfiguration, 'API Key must be set');
        this._apiKey = config.apiKey;
        
        // Prepare http
        this._http.initialize({ apiKey: this._apiKey, baseURL: config.baseURL, storage: this._storage });
        
        // Prepare query and object
        this.Object.initialize(this._http);
        this.Query.initialize(this._http, this.Object);
        this.User.initialize(this._storage);
    }
});

module.exports = Warp;