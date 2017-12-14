// References
var bcrypt = require('bcryptjs');

module.exports = {
    validate: function(password, hashed) {
        return bcrypt.compareSync(password, hashed);
    }
};