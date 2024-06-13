'use strict';

var dbConn = require('../../config/db.config');
const Secret = require('../../config/secret');

const jwt = require('jsonwebtoken');
const tableName = 'admins'
const tableKey = 'adminName'

//User object create
var AddressList = function(userlist) {

};

AddressList.getAllProvince = async function(result) {   
    try {        
        const datas = await dbConn.raw("Select * from provinces");    
        return datas[0];
    } catch (error) {        
        console.log(error);
        return {errorMessage : error.message};
    }
    
};


AddressList.getAllDistrict = async function(result) {   
    try {        
        const datas = await dbConn.raw("Select * from district");    
        return datas[0];
    } catch (error) {        
        console.log(error);
        return {errorMessage : error.message};
    }
    
};

AddressList.getAllSubDistrict = async function(result) {   
    try {        
        const datas = await dbConn.raw("Select * from subdistricts");    
        return datas[0];
    } catch (error) {        
        console.log(error);
        return {errorMessage : error.message};
    }
    
};

module.exports = AddressList;