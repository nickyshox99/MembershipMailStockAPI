const dotenv = require('dotenv');
dotenv.config();

const oSecretkey = { 
    SecretKey: process.env.SECRET_KEY?process.env.SECRET_KEY:'BSTBSTBSTBSTBSTB',
    ExpiresIn: 600,
    ExpiresLabel: '600s',    
    apiDomain:process.env.API_DOMAIN?process.env.API_DOMAIN:'http://18.138.248.245:10600/',
    webDomain:process.env.WEB_DOMAIN?process.env.WEB_DOMAIN:'http://18.138.248.245:10600/',
};

module.exports = oSecretkey;