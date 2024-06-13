var dbConn = require('../../config/db.config');
const timerHelper = require('../modules/timehelper');
const Cryptof = require('./cryptof.model');
const MemberList = require('./memberlist.model');
const MainModel = require('./main.model');


var TransactionManage = async function() {
    
};

TransactionManage.create = async function(reqId,userData,admin_bank,credit,credit_bonus,credit_before,credit_after,transaction_type
    ,bank_acc_no,bank_name,bank_time,bank_desc
    ,promotion,promotion_id,promotion_meta
    ,approve,approve_status,approve_date,score
    ,date,note,am_bank_bank_acc,am_bank_name,am_bank_bank,aff_ref_id,aff_id,aff_credit,manyuser="", result) {   
    
    try {

        const datas = await dbConn.raw("INSERT INTO report_transaction ("+ 
        "id "        
        +",agent "
        +",username "
        +",uid "
        +",mobile_no "
        +",admin_bank "
        +",credit " 
        +",credit_bonus " 
        +",credit_before " 

        +",credit_after " 
        +",transaction_type " 
        +",bank_acc_name " 
        +",bank_acc_no " 
        +",bank_name " 
        +",bank_time " 
        +",bank_desc " 
        +",promotion " 
        +",promotion_id " 
        +",promotion_meta "

        +",approve " 
        +",approve_status " 
        +",approve_date " 
        +",score " 
        +",date " 
        +",note " 
        +",am_bank_bank_acc " 
        +",am_bank_name " 
        +",am_bank_bank " 
        +",aff_ref_id " 

        +",aff_id " 
        +",aff_credit " 
        +",user_list " 
        +",attachImgUrl "     

        +" ) VALUES ("
        +" ?,?,?,?,?,?,?,?,? "
        +" ,?,?,?,?,?,?,?,?,?,? "
        
        +"  ,?,?,?,?,?,?,?,?,?,? "
        +"  ,?,?,?,'' "
        +" )"
        , [
            reqId            
            ,userData.agent
            ,userData.id
            ,' '
            
            ,userData.mobile_no
            ,admin_bank?admin_bank:'-'
            ,credit
            ,credit_bonus
            ,credit_before

            ,credit_after
            ,transaction_type            
            ,userData.fullname
            ,bank_acc_no
            ,bank_name
            ,bank_time
            ,bank_desc
            ,promotion
            ,promotion_id
            ,promotion_meta

            ,approve
            ,approve_status
            ,approve_date
             ,score
             ,date
            ,note
            ,am_bank_bank_acc
            ,am_bank_name
            ,am_bank_bank            
            ,aff_ref_id      

            ,aff_id
            ,aff_credit     
            ,manyuser       
        ]);   
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        // console.log(datas);
        //dbConn.end;
        return true;
    } catch (error) {
        console.log(reqId            
            ,userData.agent
            ,userData.id
            ,' '
            
            ,userData.mobile_no
            ,admin_bank?admin_bank:'-'
            ,credit
            ,credit_bonus
            ,credit_before

            ,credit_after
            ,transaction_type            
            ,userData.fullname
            ,bank_acc_no
            ,bank_name
            ,bank_time
            ,bank_desc
            ,promotion
            ,promotion_id
            ,promotion_meta

            ,approve
            ,approve_status
            ,approve_date
             ,score
             ,date
            ,note
            ,am_bank_bank_acc
            ,am_bank_name
            ,am_bank_bank            
            ,aff_ref_id      

            ,aff_id
            ,aff_credit     
            ,manyuser  );
        console.log(error);        
        return false;
    }
    
};

TransactionManage.withdrawApprove = async function(transaction_id,userData        
    ,approve,approve_status,approve_date
    ,note,am_bank_bank_acc,am_bank_name,am_bank_bank,admin_bank, result) {   
    
        data_ins = {
            "approve_status" 	: approve_status,
            "approve_date" 		: timerHelper.convertDatetimeToString(approve_date),
            "approve" 			: approve,
            "note" 				: note,
            "am_bank_bank_acc"	: am_bank_bank_acc,
            "am_bank_name"		: am_bank_name,
            "am_bank_bank"		: am_bank_bank,
            "admin_bank"		: admin_bank,
        };
                
        return MainModel.update("report_transaction",data_ins,{id:transaction_id});
};



module.exports = TransactionManage;