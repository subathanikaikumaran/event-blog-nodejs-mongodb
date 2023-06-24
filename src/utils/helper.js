const bcrypt = require('bcrypt');

function hashPassword(password){
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

function comparePassword(raw, hash){
    // raw - user enterd pwd, hash - from db
    return bcrypt.compareSync(raw, hash);
}

module.exports= {
    hashPassword,
    comparePassword,
};