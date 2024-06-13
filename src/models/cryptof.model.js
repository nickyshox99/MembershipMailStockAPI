'use strict';

var dbConn = require('../../config/db.config');
const Secret = require('../../config/secret');

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { resolve } = require('path');

// const algorithm = 'aes-128-cbc';
// const salt = 'my-salt';
const Skey = Secret.SecretKey;
// const iv = crypto.randomBytes(16);

const algorithm = 'aes-256-cbc'; 
// const key = crypto.randomBytes(32);
// const iv = crypto.randomBytes(16);

const key = Buffer.from("4691ca998b68cd36e7cee258696e1e30199b5678f0390e1a45bd8a0199847d99", 'hex');
const iv =  Buffer.from("0887c768d8eafbb6ea0f4b04e22af6c6", 'hex');

// Derive the key from the password using scrypt
// const key = crypto.scryptSync(Secret.SecretKey, salt, 16); // 32 bytes = 256 bits

const keyEncrypt = Buffer.from('GvfrS21Z');
const ivEncrypt = Buffer.from('GvfrS21Z');

var CryptoFunction = function() {
    
};

CryptoFunction.encryption = function(plainText) {    

    // const cipher = crypto.createCipheriv(algorithm, Skey,iv);
    // let encrypted = cipher.update(plainText, 'utf8', 'hex');
    // encrypted += cipher.final('hex');
    // return encrypted;

    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);    
    let encrypted = cipher.update(plainText);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    // return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
    return encrypted.toString('hex');
    
};

CryptoFunction.decryption = function(hideText) {
    
// let decipher = crypto.createDecipheriv(algorithm, Skey,iv);
// let decrypted = decipher.update(plainText, 'hex', 'utf8');
// decrypted += decipher.final('utf8');
// return decrypted;

   //    let iv = Buffer.from(cipherText.iv, 'hex');
    //    let encryptedText = Buffer.from(cipherText.encryptedData, 'hex');
   let encryptedText = Buffer.from(hideText, 'hex');
   let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
   let decrypted = decipher.update(encryptedText);
   decrypted = Buffer.concat([decrypted, decipher.final()]);
   return decrypted.toString();
   
};

CryptoFunction.encryption2 = function(str) {    

    const cipher = crypto.createCipheriv('des-cbc', keyEncrypt, ivEncrypt);
    let encrypted = cipher.update(str, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
    
};

CryptoFunction.decryption2 = function(str) {    

    const decipher = crypto.createDecipheriv('des-cbc', keyEncrypt, ivEncrypt);
    decipher.setAutoPadding(false);
    let decrypted = decipher.update(Buffer.from(str, 'base64'), 'binary', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted.replace(/[\x00-\x1F]/g, '');
};


CryptoFunction.getSalt = async function() {    
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const datas = {
        status : true,
        message : "",
        data : salt,
    };        
    return datas;
};

CryptoFunction.hashPassword = async function(plainPassword,salt) {   
    const hashPassword = await bcrypt.hash(plainPassword, salt);
    const datas = {
        status : true,
        message : "",
        data : hashPassword,
    };
    return datas;
};




module.exports = CryptoFunction;