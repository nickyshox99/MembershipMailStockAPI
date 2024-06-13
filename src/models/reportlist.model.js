'use strict';

var dbConn = require('../../config/db.config');
const Secret = require('../../config/secret');

const AdminList = require('./adminlist.model');
const MainModel = require('../models/main.model');
const timerHelper = require('../modules/timehelper');

const jwt = require('jsonwebtoken');

const OffsetTime  = require('../../config/offsettime');

const offsetTime = OffsetTime.offsetTime;
const offsetTime24hrs = OffsetTime.offsetTime24hrs;

var ReportList = function() {
    
};

ReportList.getReportSMS = function(searchData, result) {

    const searchWord = (searchData.searchWord)?searchData.searchWord:'';
    let sDateFrom = (searchData.dateFrom)?new Date(searchData.dateFrom):new Date();
    let sDateTo = (searchData.dateTo)?new Date(searchData.dateTo):new Date();
    
    // sDateFrom = new Date(sDateFrom.getTime() + (offsetTime)); 
    // sDateTo = new Date(sDateTo.getTime() + (offsetTime) + (offsetTime24hrs));

    sDateTo = new Date(sDateTo.getTime() + (offsetTime24hrs));
    
    let searchQuery='';
    if(sDateFrom != ''){
        searchQuery += " date >= '"+ timerHelper.convertDatetimeToString(sDateFrom)+"'";
    }
    
    if(sDateTo != ''){        
        searchQuery += " and date <= '"+timerHelper.convertDatetimeToString(sDateTo)+"'";
    }

    // if(searchWord != ''){
    //     searchQuery += " and ( mobile_no like '%"+searchWord+"%' or username like '%"+ searchWord +"%'  )";
    // }

    // if(sAgent != ''){
    //     searchQuery += " and ( agent = '"+ sAgent +"'  )";
    // }
    
    let sqlStr = "select * from sms_log  WHERE 1=1 and (" + searchQuery + ") order by date desc";

    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    dbConn.end;
    // console.log(datas);
    return datas;
    
};

ReportList.getReportDeposit = function(searchData, result) {

    // console.log(searchData.dateFrom);

    const searchWord = (searchData.searchWord)?searchData.searchWord:'';
    let sDateFrom = (searchData.dateFrom)?new Date(searchData.dateFrom):new Date();
    let sDateTo = (searchData.dateTo)?new Date(searchData.dateTo):new Date();
    
    // sDateFrom = new Date(sDateFrom.getTime() + (offsetTime)); 
    // sDateTo = new Date(sDateTo.getTime() + (offsetTime) + (offsetTime24hrs));
    sDateTo = new Date(sDateTo.getTime() + (offsetTime24hrs));
    
    // console.log(sDateFrom);

    let searchQuery='';
    if(sDateFrom != ''){
        searchQuery += " and date >= '"+ timerHelper.convertDatetimeToString(sDateFrom)+"'";
    }
    
    if(sDateTo != ''){        
        searchQuery += " and date <= '"+timerHelper.convertDatetimeToString(sDateTo)+"'";
    }

    // if(searchWord != ''){
    //     searchQuery += " and ( mobile_no like '%"+searchWord+"%' or username like '%"+ searchWord +"%'  )";
    // }

    // if(sAgent != ''){
    //     searchQuery += " and ( agent = '"+ sAgent +"'  )";
    // }
    
    let sqlStr = "select username, credit, credit_bonus, date ,approve,mobile_no,bank_acc_name,bank_acc_no,bank_name from report_transaction WHERE 1=1 and approve_status=1 and transaction_type like 'DEP%' " + searchQuery + " order by date desc";

    //console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    dbConn.end;
    // console.log(datas);
    return datas;
    
};

ReportList.getReportSumDeposit = function(searchData, result) {

    // console.log(searchData.dateFrom);

    const searchWord = (searchData.searchWord)?searchData.searchWord:'';
    let sDateFrom = (searchData.dateFrom)?(searchData.dateFrom):new Date();
    let sDateTo = (searchData.dateTo)?(searchData.dateTo):new Date();
        
    
    // console.log(sDateFrom);

    let searchQuery='';
    if(sDateFrom != ''){
        searchQuery += " and date >= '"+ timerHelper.convertDatetimeToString(sDateFrom)+"'";
    }
    
    if(sDateTo != ''){        
        searchQuery += " and date <= '"+timerHelper.convertDatetimeToString(sDateTo)+"'";
    }

    // if(searchWord != ''){
    //     searchQuery += " and ( mobile_no like '%"+searchWord+"%' or username like '%"+ searchWord +"%'  )";
    // }

    // if(sAgent != ''){
    //     searchQuery += " and ( agent = '"+ sAgent +"'  )";
    // }
    
    let sqlStr = "select sum(credit) credit, sum(credit_bonus) credit_bonus,count(*) counts  from report_transaction WHERE 1=1 and approve_status=1 and transaction_type like 'DEP%' " + searchQuery ;

    //  console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    dbConn.end;
    // console.log(datas);
    return datas;
    
};

ReportList.getReportSumDepositByAllianceID = function(searchData, result) {

    // console.log(searchData.dateFrom);

    const searchWord = (searchData.searchWord)?searchData.searchWord:'';
    let sDateFrom = (searchData.dateFrom)?new Date(searchData.dateFrom):new Date();
    let sDateTo = (searchData.dateTo)?new Date(searchData.dateTo):new Date();
    
        
    // console.log(sDateFrom);

    let searchQuery='';
    if(sDateFrom != ''){
        searchQuery += " and date >= '"+ timerHelper.convertDatetimeToString(sDateFrom)+"'";
    }
    
    if(sDateTo != ''){        
        searchQuery += " and date <= '"+timerHelper.convertDatetimeToString(sDateTo)+"'";
    }

    // if(searchWord != ''){
    //     searchQuery += " and ( mobile_no like '%"+searchWord+"%' or username like '%"+ searchWord +"%'  )";
    // }

    // if(sAgent != ''){
    //     searchQuery += " and ( agent = '"+ sAgent +"'  )";
    // }
    
    let sqlStr = "select sum(report_transaction.credit) credit, sum(report_transaction.credit_bonus) credit_bonus,count(*) counts  FROM report_transaction INNER JOIN sl_users ON sl_users.id=report_transaction.username and sl_users.knowus='"+searchData.knowus +"' WHERE 1=1 and approve_status=1 and transaction_type like 'DEP%' " + searchQuery ;

    //  console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    dbConn.end;
    // console.log(datas);
    return datas;
    
};

ReportList.getReportWithdraw = function(searchData, result) {

    const searchWord = (searchData.searchWord)?searchData.searchWord:'';
    let sDateFrom = (searchData.dateFrom)?new Date(searchData.dateFrom):new Date();
    let sDateTo = (searchData.dateTo)?new Date(searchData.dateTo):new Date();
    
    // sDateFrom = new Date(sDateFrom.getTime() + (offsetTime)); 
    // sDateTo = new Date(sDateTo.getTime() + (offsetTime) + (offsetTime24hrs));
    sDateTo = new Date(sDateTo.getTime() + (offsetTime24hrs));
    
    let searchQuery='';
    if(sDateFrom != ''){
        searchQuery += " and date >= '"+ timerHelper.convertDatetimeToString(sDateFrom)+"'";
    }
    
    if(sDateTo != ''){        
        searchQuery += " and date <= '"+timerHelper.convertDatetimeToString(sDateTo)+"'";
    }

    // if(searchWord != ''){
    //     searchQuery += " and ( mobile_no like '%"+searchWord+"%' or username like '%"+ searchWord +"%'  )";
    // }

    // if(sAgent != ''){
    //     searchQuery += " and ( agent = '"+ sAgent +"'  )";
    // }
    
    let sqlStr = "select username, credit, credit_bonus, date ,approve,mobile_no,bank_acc_name,bank_acc_no,bank_name from report_transaction WHERE 1=1 and approve_status=1 and transaction_type like 'WIT%' " + searchQuery + " order by date desc";

    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    dbConn.end;
    // console.log(datas);
    return datas;
    
};

ReportList.getReportTransferOut = function(searchData, result) {

    const searchWord = (searchData.searchWord)?searchData.searchWord:'';
    let sDateFrom = (searchData.dateFrom)?new Date(searchData.dateFrom):new Date();
    let sDateTo = (searchData.dateTo)?new Date(searchData.dateTo):new Date();
    
    // sDateFrom = new Date(sDateFrom.getTime() + (offsetTime)); 
    // sDateTo = new Date(sDateTo.getTime() + (offsetTime) + (offsetTime24hrs));
    sDateTo = new Date(sDateTo.getTime() + (offsetTime24hrs));
    
    let searchQuery='';
    if(sDateFrom != ''){
        searchQuery += " datetime >= '"+ timerHelper.convertDatetimeToString(sDateFrom)+"'";
    }
    
    if(sDateTo != ''){        
        searchQuery += " and datetime <= '"+timerHelper.convertDatetimeToString(sDateTo)+"'";
    }

    // if(searchWord != ''){
    //     searchQuery += " and ( mobile_no like '%"+searchWord+"%' or username like '%"+ searchWord +"%'  )";
    // }

    // if(sAgent != ''){
    //     searchQuery += " and ( agent = '"+ sAgent +"'  )";
    // }
    
    let sqlStr = "select bank_transfer_log.*,b1.bank_name as from_bank_name,b2.bank_name as to_bank_name FROM bank_transfer_log LEFT JOIN bank_info b1 ON b1.bank_id=bank_transfer_log.from_bank_id LEFT JOIN bank_info b2 ON b2.bank_id=bank_transfer_log.to_bank_id  WHERE 1=1 and (" + searchQuery + ") order by datetime desc";

    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    dbConn.end;
    // console.log(datas);
    return datas;
    
};

ReportList.getReportSumWithdraw = function(searchData, result) {

    const searchWord = (searchData.searchWord)?searchData.searchWord:'';
    let sDateFrom = (searchData.dateFrom)?(searchData.dateFrom):new Date();
    let sDateTo = (searchData.dateTo)?(searchData.dateTo):new Date();
 
    
    let searchQuery='';
    if(sDateFrom != ''){
        searchQuery += " and date >= '"+ timerHelper.convertDatetimeToString(sDateFrom)+"'";
    }
    
    if(sDateTo != ''){        
        searchQuery += " and date <= '"+timerHelper.convertDatetimeToString(sDateTo)+"'";
    }

    // if(searchWord != ''){
    //     searchQuery += " and ( mobile_no like '%"+searchWord+"%' or username like '%"+ searchWord +"%'  )";
    // }

    // if(sAgent != ''){
    //     searchQuery += " and ( agent = '"+ sAgent +"'  )";
    // }
    
    let sqlStr = "select sum(credit) credit, sum(credit_bonus) credit_bonus, count(*) counts from report_transaction WHERE 1=1 and approve_status=1 and transaction_type like 'WIT%' " + searchQuery;

    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    dbConn.end;
    // console.log(datas);
    return datas;
    
};

ReportList.getReportSumWithdrawByAllianceID = function(searchData, result) {

    const searchWord = (searchData.searchWord)?searchData.searchWord:'';
    let sDateFrom = (searchData.dateFrom)?new Date(searchData.dateFrom):new Date();
    let sDateTo = (searchData.dateTo)?new Date(searchData.dateTo):new Date();
        
    let searchQuery='';
    if(sDateFrom != ''){
        searchQuery += " and date >= '"+ timerHelper.convertDatetimeToString(sDateFrom)+"'";
    }
    
    if(sDateTo != ''){        
        searchQuery += " and date <= '"+timerHelper.convertDatetimeToString(sDateTo)+"'";
    }

    // if(searchWord != ''){
    //     searchQuery += " and ( mobile_no like '%"+searchWord+"%' or username like '%"+ searchWord +"%'  )";
    // }

    // if(sAgent != ''){
    //     searchQuery += " and ( agent = '"+ sAgent +"'  )";
    // }
    
    let sqlStr = "select sum(report_transaction.credit) credit, sum(report_transaction.credit_bonus) credit_bonus, count(*) counts from report_transaction INNER JOIN sl_users ON sl_users.id=report_transaction.username and sl_users.knowus='"+searchData.knowus +"' WHERE 1=1 and approve_status=1 and transaction_type like 'WIT%' " + searchQuery;

    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    dbConn.end;
    // console.log(datas);
    return datas;
    
};

ReportList.getReportBonus = function(searchData, result) {

    // console.log(searchData.dateFrom);

    const searchWord = (searchData.searchWord)?searchData.searchWord:'';
    let sDateFrom = (searchData.dateFrom)?new Date(searchData.dateFrom):new Date();
    let sDateTo = (searchData.dateTo)?new Date(searchData.dateTo):new Date();
    
    // sDateFrom = new Date(sDateFrom.getTime() + (offsetTime)); 
    // sDateTo = new Date(sDateTo.getTime() + (offsetTime) + (offsetTime24hrs));
    sDateTo = new Date(sDateTo.getTime() + (offsetTime24hrs));
    
    
    // console.log(sDateFrom);

    let searchQuery='';
    if(sDateFrom != ''){
        searchQuery += " and date >= '"+ timerHelper.convertDatetimeToString(sDateFrom)+"'";
    }
    
    if(sDateTo != ''){        
        searchQuery += " and date <= '"+timerHelper.convertDatetimeToString(sDateTo)+"'";
    }

    // if(searchWord != ''){
    //     searchQuery += " and ( mobile_no like '%"+searchWord+"%' or username like '%"+ searchWord +"%'  )";
    // }

    // if(sAgent != ''){
    //     searchQuery += " and ( agent = '"+ sAgent +"'  )";
    // }
    
    let sqlStr = "select username, sum(credit) credit, sum(credit_bonus) credit_bonus, date from report_transaction WHERE 1=1 and approve_status=1 and (transaction_type like 'REFUND' or transaction_type like 'BONUS') " + searchQuery + " group by username,date order by date desc";

    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    dbConn.end;
    // console.log(datas);
    return datas;
    
};

ReportList.getReportSumBonus = function(searchData, result) {

    // console.log(searchData.dateFrom);

    const searchWord = (searchData.searchWord)?searchData.searchWord:'';
    let sDateFrom = (searchData.dateFrom)?(searchData.dateFrom):new Date();
    let sDateTo = (searchData.dateTo)?(searchData.dateTo):new Date();
    
     
    
    // console.log(sDateFrom);

    let searchQuery='';
    if(sDateFrom != ''){
        searchQuery += " and date >= '"+ timerHelper.convertDatetimeToString(sDateFrom)+"'";
    }
    
    if(sDateTo != ''){        
        searchQuery += " and date <= '"+timerHelper.convertDatetimeToString(sDateTo)+"'";
    }

    // if(searchWord != ''){
    //     searchQuery += " and ( mobile_no like '%"+searchWord+"%' or username like '%"+ searchWord +"%'  )";
    // }

    // if(sAgent != ''){
    //     searchQuery += " and ( agent = '"+ sAgent +"'  )";
    // }
    
    let sqlStr = "select sum(credit) credit, sum(credit_bonus) credit_bonus,count(*) counts from report_transaction WHERE 1=1 and approve_status=1 and (transaction_type like 'BONUS') " + searchQuery ;

    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    dbConn.end;
    // console.log(datas);
    return datas;
    
};

ReportList.getReportSumAffCredit = function(searchData, result) {

    // console.log(searchData.dateFrom);

    const searchWord = (searchData.searchWord)?searchData.searchWord:'';
    let sDateFrom = (searchData.dateFrom)?(searchData.dateFrom):new Date();
    let sDateTo = (searchData.dateTo)?(searchData.dateTo):new Date();
    
    // console.log(sDateFrom);

    let searchQuery='';
    if(sDateFrom != ''){
        searchQuery += " and date >= '"+ timerHelper.convertDatetimeToString(sDateFrom)+"'";
    }
    
    if(sDateTo != ''){        
        searchQuery += " and date <= '"+timerHelper.convertDatetimeToString(sDateTo)+"'";
    }

    // if(searchWord != ''){
    //     searchQuery += " and ( mobile_no like '%"+searchWord+"%' or username like '%"+ searchWord +"%'  )";
    // }

    // if(sAgent != ''){
    //     searchQuery += " and ( agent = '"+ sAgent +"'  )";
    // }
    
    let sqlStr = "select sum(credit) credit, sum(credit_bonus) credit_bonus,count(*) counts from report_transaction WHERE 1=1 and approve_status=1 and (transaction_type like 'AFF') " + searchQuery ;

    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    dbConn.end;
    // console.log(datas);
    return datas;
    
};

ReportList.getReportSumRefund = function(searchData, result) {

    const searchWord = (searchData.searchWord)?searchData.searchWord:'';
    let sDateFrom = (searchData.dateFrom)?(searchData.dateFrom):new Date();
    let sDateTo = (searchData.dateTo)?(searchData.dateTo):new Date();
    

    let searchQuery='';
    if(sDateFrom != ''){
        searchQuery += " and date >= '"+ timerHelper.convertDatetimeToString(sDateFrom)+"'";
    }
    
    if(sDateTo != ''){        
        searchQuery += " and date <= '"+timerHelper.convertDatetimeToString(sDateTo)+"'";
    }

    // if(searchWord != ''){
    //     searchQuery += " and ( mobile_no like '%"+searchWord+"%' or username like '%"+ searchWord +"%'  )";
    // }

    // if(sAgent != ''){
    //     searchQuery += " and ( agent = '"+ sAgent +"'  )";
    // }
    
    let sqlStr = "select  sum(credit) credit,count(*) counts  from report_transaction WHERE 1=1 and approve_status=1 and (transaction_type like 'REFUND') "+ searchQuery ;
    //console.log(sqlStr);

    const datas = dbConn.query(sqlStr);
    dbConn.end;
    
    return datas;
    
};

ReportList.getReportAff = function(searchData, result) {

    const searchWord = (searchData.searchWord)?searchData.searchWord:'';
    let sDateFrom = (searchData.dateFrom)?new Date(searchData.dateFrom):new Date();
    let sDateTo = (searchData.dateTo)?new Date(searchData.dateTo):new Date();
    
    // sDateFrom = new Date(sDateFrom.getTime() + (offsetTime)); 
    // sDateTo = new Date(sDateTo.getTime() + (offsetTime) + (offsetTime24hrs));

    sDateTo = new Date(sDateTo.getTime() + (offsetTime24hrs));

   
    let searchQuery='';
    if(sDateFrom != ''){
        searchQuery += " and create_at >= '"+ timerHelper.convertDatetimeToString(sDateFrom)+"'";
    }
    
    if(sDateTo != ''){        
        searchQuery += " and create_at <= '"+timerHelper.convertDatetimeToString(sDateTo)+"'";
    }

    if(searchWord != ''){
        searchQuery += " and ( mobile_no like '%"+searchWord+"%' or username like '%"+ searchWord +"%' or id like '%"+searchWord+"%' or aff like '%"+searchWord+"%'  )";
    }

    // if(sAgent != ''){
    //     searchQuery += " and ( agent = '"+ sAgent +"'  )";
    // }
    
    let sqlStr = `select id,aff,create_at 
    from sl_users 
    where aff IS NOT NULL and aff<>'null' and aff<>'' ${searchQuery} order by create_at desc`;

    // console.log(sqlStr);

    const datas = dbConn.query(sqlStr);
    dbConn.end;
    // console.log(datas);
    return datas;
    
};

ReportList.getReportAffDeposit = function(searchData, result) {

    const searchWord = (searchData.searchWord)?searchData.searchWord:'';
    let sDateFrom = (searchData.dateFrom)?new Date(searchData.dateFrom):new Date();
    let sDateTo = (searchData.dateTo)?new Date(searchData.dateTo):new Date();
    
    // sDateFrom = new Date(sDateFrom.getTime() + (offsetTime)); 
    // sDateTo = new Date(sDateTo.getTime() + (offsetTime) + (offsetTime24hrs));
    sDateTo = new Date(sDateTo.getTime() + (offsetTime24hrs));
    
    let searchQuery='';
    if(sDateFrom != ''){
        searchQuery += " and date >= '"+ timerHelper.convertDatetimeToString(sDateFrom)+"'";
    }
    
    if(sDateTo != ''){        
        searchQuery += " and date <= '"+timerHelper.convertDatetimeToString(sDateTo)+"'";
    }

    if(searchWord != ''){
        searchQuery += " and ( mobile_no like '%"+searchWord+"%' or username like '%"+ searchWord +"%' or aff_id like '%"+ searchWord +"%'  )";
    }

    // if(sAgent != ''){
    //     searchQuery += " and ( agent = '"+ sAgent +"'  )";
    // }
    
    let sqlStr = "select  report_transaction.credit,report_transaction.credit_bonus,report_transaction.username,aff_id,report_transaction.mobile_no,report_transaction.bank_acc_name,report_transaction.bank_acc_no,report_transaction.bank_name,aff_credit,report_transaction.date,report_transaction.note,sl_users.mobile_no mobile_no_aff FROM report_transaction LEFT JOIN sl_users ON sl_users.id=report_transaction.username WHERE 1=1 and approve_status=1 and (transaction_type like 'AFF%') "+ searchQuery ;
    //console.log(sqlStr);

    const datas = dbConn.query(sqlStr);
    dbConn.end;
    
    return datas;
    
};

ReportList.getReportSummaryMember = function(searchData, result) {

    const searchWord = (searchData.searchWord)?searchData.searchWord:'';
    let sDateFrom = (searchData.dateFrom)?new Date(searchData.dateFrom):new Date();
    let sDateTo = (searchData.dateTo)?new Date(searchData.dateTo):new Date();
    
    // sDateFrom = new Date(sDateFrom.getTime() + (offsetTime)); 
    // sDateTo = new Date(sDateTo.getTime() + (offsetTime) + (offsetTime24hrs));
    sDateTo = new Date(sDateTo.getTime() + (offsetTime24hrs));
    
    const adminRow = AdminList.findById(searchData.userid);    

    let sql_firstdep =`,IFNULL((SELECT credit FROM report_transaction 
        WHERE approve_status = 1 
        AND
        (transaction_type like 'DEP%' )
        AND
        username=sl_users.id        
        ORDER BY date desc 
        LIMIT 0,1
        ),0) as first_deposit` ;

    let sql_sumdep = `,IFNULL((SELECT sum(credit) FROM report_transaction 
        WHERE approve_status = 1 
        AND
        (transaction_type like 'DEP%' )
        AND
        username=sl_users.id        
        ),0) as sum_deposit
        `;

    let sql_sumwit = `,IFNULL((SELECT sum(credit) FROM report_transaction 
        WHERE approve_status = 1 
        AND
        (transaction_type = 'WITHDRAW')
        AND
        username=sl_users.id        
        ),0) as sum_withdraw
        `;

    let searchQuery='';
    if(sDateFrom != ''){
        searchQuery += " and sl_users.create_at >= '"+ timerHelper.convertDatetimeToString(sDateFrom)+"'";
    }
    
    if(sDateTo != ''){        
        searchQuery += " and sl_users.create_at <= '"+timerHelper.convertDatetimeToString(sDateTo)+"'";
    }

    let empQueryTotal =`
        SELECT * FROM
        (SELECT sl_users.id,sl_users.knowus,sl_users.agent 
            ${sql_firstdep} 
            ${sql_sumdep} 
            ${sql_sumwit} 
        FROM sl_users  
        WHERE
        sl_users.status=1              
        ${searchQuery} 
        ) tb `;	
    
    // console.log(empQueryTotal);
    const datas = dbConn.query(empQueryTotal);
    dbConn.end;
    // console.log(datas);
    return datas;
    
};

ReportList.getLastTransaction = function(searchData, result) {

    // console.log(searchData.dateFrom);    
    // console.log(sDateFrom);

    let searchQuery='';
    

    // if(searchWord != ''){
    //     searchQuery += " and ( mobile_no like '%"+searchWord+"%' or username like '%"+ searchWord +"%'  )";
    // }

    // if(sAgent != ''){
    //     searchQuery += " and ( agent = '"+ sAgent +"'  )";
    // }
    
    let sqlStr = "select *,bank_info.bank_ico from report_transaction LEFT JOIN bank_info ON bank_info.bank_name = report_transaction.bank_name WHERE 1=1 and approve_status=1 and (transaction_type like 'DEP%' or transaction_type like 'WIT%' ) " + searchQuery + " order by date desc LIMIT 0,10";

    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    dbConn.end;
    // console.log(datas);
    return datas;
    
};

ReportList.getReportBetlog = function(searchData, result) {

    // console.log(searchData.dateFrom);

    const searchWord = (searchData.searchWord)?searchData.searchWord:'';

    let sDateFrom = (searchData.dateFrom)?new Date(searchData.dateFrom):new Date();
    let sDateTo = (searchData.dateTo)?new Date(searchData.dateTo):new Date();
    
    // sDateFrom = new Date(sDateFrom.getTime() + (offsetTime)); 
    // sDateTo = new Date(sDateTo.getTime() + (offsetTime) + (offsetTime24hrs));

    sDateTo = new Date(sDateTo.getTime() + (offsetTime24hrs));
    
    
    // console.log(sDateFrom);

    let searchQuery='';
    if(sDateFrom != ''){
        searchQuery += " and date >= '"+ timerHelper.convertDatetimeToString(sDateFrom)+"'";
    }
    
    if(sDateTo != ''){        
        searchQuery += " and date <= '"+timerHelper.convertDatetimeToString(sDateTo)+"'";
    }

    // if(searchWord != ''){
    //     searchQuery += " and ( mobile_no like '%"+searchWord+"%' or username like '%"+ searchWord +"%'  )";
    // }

    // if(sAgent != ''){
    //     searchQuery += " and ( agent = '"+ sAgent +"'  )";
    // }
    
    let sqlStr = "select * from bet_log WHERE 1=1 " + searchQuery + " order by date desc";

    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    dbConn.end;
    // console.log(datas);
    return datas;
    
};

ReportList.getReportRefund = function(searchData, result) {

    // console.log(searchData.dateFrom);

    const searchWord = (searchData.searchWord)?searchData.searchWord:'';
    let sDateFrom = (searchData.dateFrom)?new Date(searchData.dateFrom):new Date();
    let sDateTo = (searchData.dateTo)?new Date(searchData.dateTo):new Date();
    
    // sDateFrom = new Date(sDateFrom.getTime() + (offsetTime)); 
    // sDateTo = new Date(sDateTo.getTime() + (offsetTime) + (offsetTime24hrs));
    sDateTo = new Date(sDateTo.getTime() + (offsetTime24hrs));
    
    
    // console.log(sDateFrom);

    let searchQuery='';
    if(sDateFrom != ''){
        searchQuery += " and datetime >= '"+ timerHelper.convertDatetimeToString(sDateFrom)+"'";
    }
    
    if(sDateTo != ''){        
        searchQuery += " and datetime <= '"+timerHelper.convertDatetimeToString(sDateTo)+"'";
    }

    // if(searchWord != ''){
    //     searchQuery += " and ( mobile_no like '%"+searchWord+"%' or username like '%"+ searchWord +"%'  )";
    // }

    // if(sAgent != ''){
    //     searchQuery += " and ( agent = '"+ sAgent +"'  )";
    // }
    
    let sqlStr = "select * from report_refund WHERE 1=1 " + searchQuery + " order by datetime desc";

    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    dbConn.end;
    // console.log(datas);
    return datas;
    
};

ReportList.getLastBonusTransaction = function(searchData, result) {

    // console.log(searchData.dateFrom);    
    // console.log(sDateFrom);

    let searchQuery='';
    

    // if(searchWord != ''){
    //     searchQuery += " and ( mobile_no like '%"+searchWord+"%' or username like '%"+ searchWord +"%'  )";
    // }

    // if(sAgent != ''){
    //     searchQuery += " and ( agent = '"+ sAgent +"'  )";
    // }
    
    let sqlStr = "select * from report_transaction WHERE 1=1 and approve_status=1 and (transaction_type like 'BONUS'  ) " + searchQuery + " order by date desc LIMIT 0,10";

    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    dbConn.end;
    // console.log(datas);
    return datas;
    
};


ReportList.getLastDepTransaction = function(searchData, result) {

    // console.log(searchData.dateFrom);    
    // console.log(sDateFrom);

    let searchQuery='';
    

    // if(searchWord != ''){
    //     searchQuery += " and ( mobile_no like '%"+searchWord+"%' or username like '%"+ searchWord +"%'  )";
    // }

    // if(sAgent != ''){
    //     searchQuery += " and ( agent = '"+ sAgent +"'  )";
    // }
    
    let sqlStr = "select *,bank_info.bank_ico from report_transaction LEFT JOIN bank_info ON bank_info.bank_name = report_transaction.bank_name WHERE 1=1 and approve_status=1 and (transaction_type like 'DEP%'  ) " + searchQuery + " order by date desc LIMIT 0,10";

    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    dbConn.end;
    // console.log(datas);
    return datas;
    
};

ReportList.getLastWitTransaction = function(searchData, result) {

    // console.log(searchData.dateFrom);    
    // console.log(sDateFrom);

    let searchQuery='';
    

    // if(searchWord != ''){
    //     searchQuery += " and ( mobile_no like '%"+searchWord+"%' or username like '%"+ searchWord +"%'  )";
    // }

    // if(sAgent != ''){
    //     searchQuery += " and ( agent = '"+ sAgent +"'  )";
    // }
    
    let sqlStr = "select *,bank_info.bank_ico from report_transaction LEFT JOIN bank_info ON bank_info.bank_name = report_transaction.bank_name WHERE 1=1 and approve_status=1 and (transaction_type like 'WIT%'  ) " + searchQuery + " order by date desc LIMIT 0,10";

    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    dbConn.end;
    // console.log(datas);
    return datas;
    
};

ReportList.getLastRegTransaction = function(searchData, result) {

    // console.log(searchData.dateFrom);    
    // console.log(sDateFrom);

    let searchQuery='';
    

    // if(searchWord != ''){
    //     searchQuery += " and ( mobile_no like '%"+searchWord+"%' or username like '%"+ searchWord +"%'  )";
    // }

    // if(sAgent != ''){
    //     searchQuery += " and ( agent = '"+ sAgent +"'  )";
    // }
    
    let sqlStr = "select bank_info.bank_ico,bank_info.bank_name,id,mobile_no,fullname,create_at from sl_users LEFT JOIN bank_info ON bank_info.bank_id = sl_users.bank_id WHERE 1=1 order by create_at desc LIMIT 0,10";

    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    dbConn.end;
    // console.log(datas);
    return datas;
    
};

ReportList.getPaidPayment = async function(searchData, result) {   

    let sDateFrom = (searchData.dateFrom)?searchData.dateFrom:new Date();
    let sDateTo = (searchData.dateTo)?searchData.dateTo:new Date();
    
    let searchQuery="";

    if(sDateFrom != ''){
        searchQuery += " and due_date >= '"+ timerHelper.convertDatetimeToString(sDateFrom)+"'";
    }
    
    if(sDateTo != ''){        
        searchQuery += " and due_date <= '"+timerHelper.convertDatetimeToString(sDateTo)+"'";
    }

    // searchword = searchword?searchword:'';
    let sqlStr = "select count(*) C,sum(total_amount) S from loan_payment WHERE 1=1 AND paid=1 "+ searchQuery;
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    return datas[0];
};

ReportList.getNotPaidPayment = async function(searchData, result) {   

    let sDateFrom = (searchData.dateFrom)?searchData.dateFrom:new Date();
    let sDateTo = (searchData.dateTo)?searchData.dateTo:new Date();
    
    let searchQuery="";

    if(sDateFrom != ''){
        searchQuery += " and due_date >= '"+ timerHelper.convertDatetimeToString(sDateFrom)+"'";
    }
    
    if(sDateTo != ''){        
        searchQuery += " and due_date <= '"+timerHelper.convertDatetimeToString(sDateTo)+"'";
    }

    // searchword = searchword?searchword:'';
    let sqlStr = "select count(*) C,sum(total_amount) S from loan_payment WHERE 1=1 AND paid=0 "+ searchQuery;
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    return datas[0];
};

ReportList.getFinePayment = async function(searchData, result) {   

    let sDateFrom = (searchData.dateFrom)?searchData.dateFrom:new Date();
    let sDateTo = (searchData.dateTo)?searchData.dateTo:new Date();
    
    let searchQuery="";

    if(sDateFrom != ''){
        searchQuery += " and due_date >= '"+ timerHelper.convertDatetimeToString(sDateFrom)+"'";
    }
    
    if(sDateTo != ''){        
        searchQuery += " and due_date <= '"+timerHelper.convertDatetimeToString(sDateTo)+"'";
    }

    // searchword = searchword?searchword:'';
    let sqlStr = "select count(*) C,sum(fine_amount) S from loan_payment WHERE 1=1 AND fine_amount>0"+ searchQuery;
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    return datas[0];
};

ReportList.getPrinciplePayment = async function(searchData, result) {   

    let sDateFrom = (searchData.dateFrom)?searchData.dateFrom:new Date();
    let sDateTo = (searchData.dateTo)?searchData.dateTo:new Date();
    
    let searchQuery="";

    if(sDateFrom != ''){
        searchQuery += " and due_date >= '"+ timerHelper.convertDatetimeToString(sDateFrom)+"'";
    }
    
    if(sDateTo != ''){        
        searchQuery += " and due_date <= '"+timerHelper.convertDatetimeToString(sDateTo)+"'";
    }

    // searchword = searchword?searchword:'';
    let sqlStr = "select count(*) C,sum(principle_amount) S from loan_payment WHERE 1=1 AND principle_amount>0"+ searchQuery;
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    return datas[0];
};

ReportList.getOldSummaryReport = async function(searchData, result) {   

    
    
    try {        
        let sqlStr = "";
        
        sqlStr = "Select  ";     
        sqlStr += " loan_list.id, loan_list.member_id , loan_list.loan_amount , loan_list.create_by, loan_list.period_number,";     
        sqlStr += " loan_list.create_at, loan_list.owner_admin_id , loan_list.staff_id , loan_list.interest_name, ";     
        sqlStr += " loan_list.approve_by, loan_list.close_by , loan_list.closed , loan_list.approve_note , loan_list.close_note,";
        sqlStr += " loan_list.remain_loan, loan_list.remain_interest , loan_list.remain_fine,  ";
        sqlStr += " loan_list.collateral_img1, loan_list.collateral_img2 , loan_list.collateral_img3 , loan_list.collateral_img4 ,";
        sqlStr += " loan_list.loan_longtime_number, loan_list.approve_at , loan_list.close_at , loan_list.reject_by ,";
        sqlStr += " loan_list.rejected, loan_list.reject_at , loan_list.interest , loan_list.effective_rate ,";
        sqlStr += " loan_list.reject_note, loan_list.loan_start_at,";
        sqlStr += " interest_period_list.period_unit, ";
        
        sqlStr += " interest_period_list.period_name,loan_collateral_type.collateral_name, ";     
        sqlStr += " sl_users.id as sl_users_id, sl_users.fullname as sl_users_fullname, ";   
        sqlStr += " sum(loan_payment.total_received_amount) as payment_total_received_amount, ";  
        sqlStr += " sum(loan_payment.fine_amount) as payment_fine_amount, ";
        sqlStr += " sum(loan_payment.interest_amount) as payment_interest_amount, ";
        sqlStr += " COUNT(CASE WHEN loan_payment.paid = 1 THEN 1 ELSE NULL END) as payment_paid_count, ";        
        sqlStr += " COUNT(loan_payment.id) as payment_count ";
        
        sqlStr += " From loan_list ";   
        sqlStr += " LEFT JOIN interest_period_list ON interest_period_list.id=loan_list.period_unit_id ";
        sqlStr += " LEFT JOIN loan_collateral_type ON loan_collateral_type.id=loan_list.collateral_type_id ";
        sqlStr += " LEFT JOIN sl_users ON sl_users.id=loan_list.member_id "; 
        sqlStr += " LEFT JOIN loan_payment ON loan_payment.loan_id=loan_list.id "; 

        sqlStr += " WHERE 1=1 AND loan_list.approved=1";        

        sqlStr += " AND (loan_list.approve_at >='"+ timerHelper.convertDateToString(searchData.dateFrom) +"' AND loan_list.approve_at <='"+timerHelper.convertDateToString(searchData.dateTo)+"' )";

        sqlStr += " GROUP BY ";
        sqlStr += " loan_list.id, loan_list.member_id , loan_list.loan_amount , loan_list.create_by, loan_list.period_number,";     
        sqlStr += " loan_list.create_at, loan_list.owner_admin_id , loan_list.staff_id , loan_list.interest_name, ";     
        sqlStr += " loan_list.approve_by, loan_list.close_by , loan_list.closed , loan_list.approve_note , loan_list.close_note,";
        sqlStr += " loan_list.remain_loan, loan_list.remain_interest , loan_list.remain_fine,  ";
        sqlStr += " loan_list.collateral_img1, loan_list.collateral_img2 , loan_list.collateral_img3 , loan_list.collateral_img4 ,";
        sqlStr += " loan_list.loan_longtime_number, loan_list.approve_at , loan_list.close_at , loan_list.reject_by ,";
        sqlStr += " loan_list.rejected, loan_list.reject_at , loan_list.interest , loan_list.effective_rate ,";
        sqlStr += " loan_list.reject_note, loan_list.loan_start_at,";
        sqlStr += " interest_period_list.period_unit, ";
        sqlStr += " interest_period_list.period_name,loan_collateral_type.collateral_name, ";     
        sqlStr += " sl_users_id, sl_users_fullname  "; 

        sqlStr += " ORDER BY loan_list.create_at DESC";

        
        const datas = await dbConn.raw(sqlStr); 
        
        return datas[0];
    } catch (error) {
        console.log(error);
        return [];
    }
};


module.exports = ReportList;