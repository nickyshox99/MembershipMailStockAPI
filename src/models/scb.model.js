var dbConn = require('../../config/db.config');
const Cryptof = require('./cryptof.model');

const jwt = require('jsonwebtoken');


//User object create
var SCB = function() {

};

SCB.checkKey = async function(keycheck,result)
{
    try {
        let sqlStr = "Select *  ";        
        sqlStr += " FROM key_check " ;    
        sqlStr += " where key_ ='"+keycheck+"' ";
        
        // console.log(sqlStr);
        const datas = dbConn.query(sqlStr);
        // console.log(datas);
        dbConn.end;
        return datas[0]?datas[0]:[];
        
    } catch (error) {
        return error;
    } 
}

SCB.checkBankIsRunning = async function () {
    try {
        let sqlStr = "Select *  ";        
        sqlStr += " FROM bank_running  " ;    
        sqlStr += " where Bank='SCB' and IsRunning=1 and (RunningDate + INTERVAL 5 minute) < now() ";
        
        // console.log(sqlStr);
        const datas = dbConn.query(sqlStr);
        // console.log(datas);
        dbConn.end;
        return datas?datas:[];
        
    } catch (error) {
        return error;
    } 
}

SCB.updateBankRunning = async function (IsRunning) {
    try {
        let sqlStr = "UPDATE bank_running  ";        
        sqlStr += " SET IsRunning = ? , " ;    
        sqlStr += " RunningDate = now() where Bank='SCB' ";
        
        // console.log(sqlStr);
        const datas = dbConn.query(sqlStr,[IsRunning]);
        // console.log(datas);
        dbConn.end;
        return datas;
        
    } catch (error) {
        return error;
    } 
}

SCB.updateBankData = async function (id,meta_data,balance) {
    try {
        let sqlStr = "UPDATE admin_bank SET";        
        sqlStr += " meta_data = ? " ;
        sqlStr += " , balance = ? " ;
        sqlStr += " WHERE id=? ";
        
        // console.log(sqlStr);
        const datas = dbConn.query(sqlStr,[JSON.stringify(meta_data),balance,id]);
        // console.log(datas);
        dbConn.end;
        return datas;
        
    } catch (error) {
        return error;
    } 
}

module.exports = SCB;