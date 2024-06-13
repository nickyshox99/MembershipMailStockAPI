var dbConn = require('../../config/db.config');
const Cryptof = require('./cryptof.model');
const MemberList = require('./memberlist.model');
const timerHelper = require('../modules/timehelper')
const MainModel = require('./main.model');

const tableName = 'report_transaction'
const tableKey = 'id'


var TransactionList = async function() {
    
};

TransactionList.findById = async function(id, result) {   
    let sqlStr = "Select *  ";        
    sqlStr += " FROM "+tableName;    
    sqlStr += " where 1=1 AND ("+tableKey+" = '"+id+"') ";
    
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    ////dbConn.end;
    return datas[0][0]?datas[0][0]:[];
};

TransactionList.generateRequestID = async function(transactionType="deposit",result)
{
    let prefix="";
    let sqlStr ="";

    const datetimeNow = new Date();
    const rndInt = Math.floor(Math.random() * 1000) + 100;
    const dateStr = datetimeNow.getFullYear().toString() +datetimeNow.getMonth().toString()
        + datetimeNow.getDay().toString()+datetimeNow.getHours().toString()
        + datetimeNow.getMinutes().toString()+datetimeNow.getSeconds().toString()
        + rndInt.toString();

    if (transactionType=="card") 
    {
        prefix= "reqca"+dateStr;
        sqlStr="SELECT id FROM reward_history WHERE reward_type='CARD' and id like '"+ prefix +"%' ";
    }
    else if (transactionType=="deposit") 
    {
        prefix= "reqd"+dateStr;
        sqlStr="SELECT id FROM report_transaction WHERE transaction_type='DEPOSIT' and id like '"+ prefix +"%' ";
    }
    else if (transactionType=="depositaffg") 
    {
        prefix= "reqaffg"+dateStr;
        sqlStr="SELECT id FROM report_transaction WHERE transaction_type='AFFG' and id like '"+ prefix +"%' ";
    }
    else if (transactionType=="depositaffg2") 
    {
        prefix= "reqaffg2"+dateStr;
        sqlStr="SELECT id FROM report_transaction WHERE transaction_type='AFFG2' and id like '"+ prefix +"%' ";
    }
    else if (transactionType=="depositnull") 
    {
        prefix= "reqdepn"+dateStr;
        sqlStr="SELECT id FROM report_transaction WHERE transaction_type='DEPNL' and id like '"+ prefix +"%' ";
    }
    else if (transactionType=="withdraw") 
    {
        prefix= "reqw"+dateStr;
        sqlStr="SELECT id FROM report_transaction WHERE transaction_type='WITHDRAW' and id like '"+ prefix +"%' ";
    }
    else if (transactionType=="bonus") 
    {
        prefix= "reqb"+dateStr;
        sqlStr="SELECT id FROM report_transaction WHERE transaction_type='BONUS' and id like '"+ prefix +"%' ";
    }
    else if (transactionType=="wheel") 
    {
        prefix= "reqwh"+dateStr;
        sqlStr="SELECT id FROM reward_history WHERE reward_type='WHEEL' and id like '"+ prefix +"%' ";
    }
    else if (transactionType=="daily_deposit_claimed") 
    {
        prefix= "reqdlyrw"+dateStr;
        sqlStr="SELECT id FROM reward_history WHERE reward_type='DAILYREWARD' and id like '"+ prefix +"%' ";
    }

    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    
    let requestId = "";
    if (datas[0].length==0) 
    {
        requestId = prefix + '1';
    }
    else
    {
        let lastId = Math.abs(parseInt(datas[0][0].id.replace(prefix,""))+1);
        requestId = prefix + lastId.toString();
    }
    
    ////dbConn.end;
    return requestId;

}

TransactionList.findFirstDepTransactionByUsername = async function(username,notUsedForPromotion=false,result)
{
    let sqlStr = "Select *  ";        
    sqlStr += " FROM "+tableName;    
    sqlStr += " where 1=1 AND (username = '"+username+"' and transaction_type like 'DEP%' AND transaction_type<>'DEPMIN' AND approve_status = 1 ) ";
    
    if (notUsedForPromotion) {
        sqlStr += " AND promotion_meta<>'used for promotion' ";
    }
    sqlStr += " ORDER BY date LIMIT 0,1";
    
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    //dbConn.end;
    return datas[0][0]?datas[0][0]:[];
}

TransactionList.findLastDepTransactionByUsername = async function(username,notUsedForPromotion=false,result)
{
    let sqlStr = "Select *  ";        
    sqlStr += " FROM "+tableName;    
    sqlStr += " where 1=1 AND (username = '"+username+"' and transaction_type like 'DEP%' AND transaction_type<>'DEPMIN' AND approve_status = 1 ) ";
    
    if (notUsedForPromotion) {
        sqlStr += " AND promotion_meta<>'used for promotion' ";
    }
    sqlStr += " ORDER BY date DESC LIMIT 0,1";
    
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    //dbConn.end;
    return datas[0][0]?datas[0][0]:[];
}

TransactionList.findLastTransactionByUsername = async function(username,condition=false,result)
{
    let sqlStr = "Select *  ";        
    sqlStr += " FROM "+tableName;    
    sqlStr += " where 1=1 AND (username = '"+username+"') ";
    
    if (condition) {
        sqlStr += condition;
    }
    sqlStr += " ORDER BY date DESC LIMIT 0,1";
    
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    //dbConn.end;
    return datas[0][0]?datas[0][0]:[];
}

TransactionList.findLastTransaction = async function(condition=false,result)
{
    let sqlStr = "Select *  ";        
    sqlStr += " FROM "+tableName;    
    sqlStr += " where 1=1 ";
    
    if (condition) {
        sqlStr += condition;
    }
    sqlStr += " ORDER BY date DESC LIMIT 0,1";
    
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    //dbConn.end;
    return datas[0][0]?datas[0][0]:[];
}

TransactionList.getWaitWithdrawTransaction = async function(search,result)
{
    let sqlStr = "Select *  ";        
    sqlStr += " FROM "+tableName;    
    sqlStr += " where 1=1 AND approve_status is null AND transaction_type = 'WITHDRAW' order by date desc ";
    
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    
    //dbConn.end;
    return datas[0]?datas[0]:[];
}

TransactionList.countWaitWithdrawTransaction = async function(search,result)
{
    let sqlStr = "Select id  ";        
    sqlStr += " FROM "+tableName;    
    sqlStr += " where 1=1 AND approve_status is null AND transaction_type = 'WITHDRAW' ";
    
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    
    //dbConn.end;
    return datas[0]?datas[0]:[];
}

TransactionList.getTransactionById = async function(id,result)
{
    let sqlStr = "Select *  ";        
    sqlStr += " FROM "+tableName;    
    sqlStr += " where 1=1 AND id='"+id+"'";
    
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    
    //dbConn.end;
    return datas[0]?datas[0]:[];
}

TransactionList.getWaitDepositTransaction = async function(search,result)
{
    let sqlStr = "Select *  ";        
    sqlStr += " FROM "+tableName;    
    sqlStr += " where 1=1 AND (transaction_type = 'DEPNL' or transaction_type = 'DEPERR' or transaction_type = 'DEPMIN' or transaction_type = 'DEPMAN') and approve_status is null order by date desc ";
    
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    
    //dbConn.end;
    return datas[0]?datas[0]:[];
}

TransactionList.approveAutoWaitWithdrawTransactionById = async function(objData, result) {   

    const rowid = objData.id;
      
    try {
            
        const datas = await dbConn.raw("UPDATE " +tableName+" SET "
        +"approve_status=? " 
        +",approve_date=? "
        +",approve=? "
        +",note=? "  
        +",am_bank_bank_acc=? "  
        +",am_bank_name=? "  
        +",am_bank_bank=? "  
        
        +"WHERE "+tableKey+" = ?"
        , [     
            ,objData.approve_status
            ,timerHelper.convertDatetimeToString(new Date())
            ,objData.approve
            ,objData.note            
            ,objData.am_bank_bank_acc     
            ,objData.am_bank_name     
            ,objData.am_bank_bank     
            , rowid]);   
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        //dbConn.end;
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
    
};

TransactionList.approveManaulWaitWithdrawTransactionById = async function(objData, result) {   

    const rowid = objData.id;
      
    try {
            
        const datas = await dbConn.raw("UPDATE " +tableName+" SET "
        +"approve_status=? " 
        +",approve_date=? "
        +",approve=? "
        +",note=? "  
        
        +"WHERE "+tableKey+" = ?"
        , [     
            ,objData.approve_status
            ,timerHelper.convertDatetimeToString(new Date())
            ,objData.approve
            ,objData.note                        
            , rowid]);   
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        //dbConn.end;
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
    
};


TransactionList.updateWaitDepositTransactionById = async function(objData, result) {   

    const rowid = objData.id;
    try {

        console.log("UPDATE " +tableName+" SET "
        +"transaction_type=? " 
        +",approve_status=? "
        +",approve_date=? "
        +",approve=? "        
        +",agent=? "
        +",username=? "
        +",uid=? "
        +",mobile_no=? "
        +",bank_acc_name=? "
        +",bank_acc_no=? "
        +",bank_name=? "
        +",note=? "
        +",credit_before=? "
        +",credit_after=? "
        +"WHERE "+tableKey+" = ?"
        , [     
            objData.transaction_type     
            ,objData.approve_status
            ,objData.approve_date
            ,objData.approve            
            ,objData.agent
            ,objData.username
            ,objData.uid
            ,objData.mobile_no
            ,objData.bank_acc_name
            ,objData.bank_acc_no
            ,objData.bank_name
            ,objData.note
            ,objData.credit_before
            ,objData.credit_after
            , rowid]);
            
        const datas = await dbConn.raw("UPDATE " +tableName+" SET "
        +"transaction_type=? " 
        +",approve_status=? "
        +",approve_date=? "
        +",approve=? "        
        +",agent=? "
        +",username=? "
        +",uid=? "
        +",mobile_no=? "
        +",bank_acc_name=? "
        +",bank_acc_no=? "
        +",bank_name=? "
        +",note=? "
        +",credit_before=? "
        +",credit_after=? "
        +"WHERE "+tableKey+" = ?"
        , [     
            objData.transaction_type     
            ,objData.approve_status
            ,objData.approve_date
            ,objData.approve            
            ,objData.agent
            ,objData.username
            ,objData.uid
            ,objData.mobile_no
            ,objData.bank_acc_name
            ,objData.bank_acc_no
            ,objData.bank_name
            ,objData.note
            ,objData.credit_before
            ,objData.credit_after
            , rowid]);   
        
        // const datas=[];
        // datas['affectedRows'] = 0;


        //dbConn.end;
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
    
};

TransactionList.getWithdrawPIN = async function(PIN , result)
{
    let sqlStr = "Select *  ";        
    sqlStr += " FROM withdraw_pin ";
    sqlStr += " WHERE 1=1 AND (pin = '"+PIN+"') ";
    
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    //dbConn.end;
    return datas[0]?datas[0]:[];
}

TransactionList.getTransactionByUsername = async function(username,result)
{
    let sqlStr = "Select *  ";        
    sqlStr += " FROM "+tableName;    
    sqlStr += " where 1=1 AND (transaction_type like 'DEP%' or transaction_type like 'WIT%' or transaction_type like 'BONUS%' ) and approve_status is not null AND username='"+username+"' ";
    sqlStr += " ORDER BY date DESC LIMIT 0,100";    
    
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    
    //dbConn.end;
    return datas[0]?datas[0]:[];
}

module.exports = TransactionList;