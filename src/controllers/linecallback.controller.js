'use strict';
const jwt = require('jsonwebtoken');

const IpAllowList = require('../models/ipallowlist.model');

const MainModel = require('../models/main.model');


const Secret = require('../../config/secret');

// const bcrypt = require('bcrypt');
// const saltRounds = 60;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';

const OffsetTime = require('../../config/offsettime');

const offsetTime = OffsetTime.offsetTime;
const offsetTime24hrs = OffsetTime.offsetTime24hrs;

var session = require('express-session');
const { count } = require('console');

exports.linecallback = async function(req, res) {
    
    // Assuming you are expecting a JSON payload
    const message = req.body.message;

    // Do something with the received message
    console.log('Received message: ', message);

    // Respond to the LINE Notify server
    res.json({ status: 'success' }); 

};
