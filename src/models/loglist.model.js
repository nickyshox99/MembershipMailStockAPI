var dbConn = require('../../config/db.config');
const Cryptof = require('./cryptof.model');
const MemberList = require('./memberlist.model');

const tableName = 'log'
const tableKey = 'id'

var LogList = function() {
    
};

LogList.create = function(log_text,admin,date,result) {   

    let tmpData = {
        "log_text"	: log_text,
        "admin"		: admin,
        "datetime"	: date,        
    };

    try {
        
        const datas = dbConn.query("INSERT INTO "+tableName+" ("+ 
        "log_text "
        +",admin "
        +",datetime "        
        +" ) VALUES (?,?,?)"
        , [
            tmpData.log_text
            ,tmpData.admin
            ,tmpData.datetime                   
        ]);   
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        dbConn.end;
        return datas;
    } catch (error) {
        console.log(error);
        return error;
    }
};

LogList.findAll = function(result) {   

    let sqlStr = "Select * ";            
    sqlStr += " FROM log ";    
    sqlStr += " ORDER BY datetime desc";
    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    // console.log(datas);
    return datas;
};

module.exports = LogList;