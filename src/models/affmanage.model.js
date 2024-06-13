var dbConn = require('../../config/db.config');

const MemberList = require('./memberlist.model');
const TransactionList = require('./transactionlist.model');
const TransactionManage = require('./transactionmanage.model');
const AdminSetting = require('./adminsetting.model');
const timerHelper = require('../modules/timehelper');
const MainModel = require('./main.model');

const OffsetTime = require('../../config/offsettime');

const offsetTime = OffsetTime.offsetTime;
const offsetTime24hrs = OffsetTime.offsetTime24hrs;

var Aff = function() {
    
};

Aff.calculateAff = async function(transactionId , credit, result){

    let cTime = new Date();
    cTime = new Date(cTime.getTime() + (offsetTime));

    let returnResult = {
        aff_user 			: null,
        aff_user_credit 	: 0,
    };

    try 
    {
        const tmpMeta = AdminSetting.findById("affiliate");
        let metasettingAff = JSON.parse(tmpMeta.value);    

        if (metasettingAff.enable==1) 
        {
            const minDeposit 	= metasettingAff['MinDeposit']?parseFloat(metasettingAff['MinDeposit']) : 0;
            let credit1 		= metasettingAff['Credit1']? parseFloat(metasettingAff['Credit1']) : 0;
            let credit2 		= metasettingAff['Credit2']?parseFloat(metasettingAff['Credit2']): 0;
            const minTransfer 	= metasettingAff['MinTransfer']?parseFloat(metasettingAff['MinTransfer']) : 0;
            const maxCredit 	= metasettingAff['MaxCredit']?parseFloat(metasettingAff['MaxCredit']) : 0;
            const typeCredit 	= metasettingAff['TypeCredit']?metasettingAff['TypeCredit'] : "percent";

            const onlyFirstDep 	= metasettingAff['OnlyFirstDep']?metasettingAff['OnlyFirstDep'] : 0;

            if(onlyFirstDep==1)
            {
                let sqlStr = `SELECT * FROM report_transaction WHERE username='${row_user['id']}' AND transaction_type LIKE '%DEP%' AND approve_status=1 ORDER BY date LIMIT 0,1`;
                let reportData = await MainModel.query(sqlStr);
                if(reportData.length >0)
                {
                    return returnResult;
                }
            }

            let transactionList = TransactionList.findById(transactionId);
            if (transactionList) 
            {
                if (credit >= minDeposit) 
                {
                    if (typeCredit=="unit") 
                    {
                        
                    }    
                    else
                    {
                        credit1 = credit * (credit1/100);
                        if (credit1>maxCredit) 
                        {
                            credit1 = maxCredit;    
                        }

                        credit2 = credit * (credit2/100);
                        if (credit2>maxCredit) 
                        {
                            credit2 = maxCredit;    
                        }
                    }

                    let username = transactionList.username;
                    const mainUserData = MemberList.findById(username);

                    if (mainUserData) 
                    {
                        const affUsername = mainUserData.aff?mainUserData.aff:'';
                        if (affUsername!='') 
                        {
                            returnResult = {
                                aff_user 			: affUsername,
                                aff_user_credit 	: credit1,
                            };

                            const userAff = MemberList.findById(affUsername);
                            if (userAff) 
                            {
                                
                                const idReq = TransactionList.generateRequestID("depositaffg");
                                TransactionManage.create(idReq,userAff,"SYSTEM",0,credit1,0,0,"AFFG",userAff.bank_acc_no,userAff.bank_name
                                        ,null,"",null,null,null,"SYSTEM",1
                                        ,timerHelper.convertDatetimeToStringNoT(cTime),0,timerHelper.convertDatetimeToStringNoT(cTime)
                                        ,"ได้รับจากยอดฝากของเพื่อนลำดับที่ 1 "+username
                                        ,null,null,null,null,username,credit,"");                            
                                //Update credit
                                MemberList.increaseCreditAff(userAff.id,credit1);

                                const affUsername2 = userAff.aff?userAff.aff:'';                            
                                if (userAff.aff && affUsername2!='' ) 
                                {                                    
                                    const userAff2 = MemberList.findById(affUsername2);                                    

                                    if (userAff2) 
                                    {
                                        const idReq2 = TransactionList.generateRequestID("depositaffg2");
                                        TransactionManage.create(idReq2,userAff2,"SYSTEM",0,credit2,0,0,"AFFG2",userAff2.bank_acc_no,userAff2.bank_name
                                            ,null,"",null,null,null,"SYSTEM",1
                                            ,timerHelper.convertDatetimeToStringNoT(cTime),0,timerHelper.convertDatetimeToStringNoT(cTime)
                                            ,"ได้รับจากยอดฝากของเพื่อนลำดับที่ 2 "+username
                                            ,null,null,null,username,userAff.id,credit,"");
    
                                        //Update credit
                                        MemberList.increaseCreditAff(userAff2.id,credit2);
                                    }
                                   
                                }
                            }
                        }
                    }
                }
            }
        }

        return returnResult;

    } 
    catch (error) 
    {
        console.log(error);
        return {
            aff_user 			: null,
            aff_user_credit 	: 0,
        };
    }
    
}


Aff.calculateAffByUsername = async function(row_user , credit, result){

    let cTime = new Date();
    cTime = new Date(cTime.getTime() + (offsetTime));

    let returnResult = {
        aff_user 			: null,
        aff_user_credit 	: 0,
    };

    try 
    {
        const tmpMeta = AdminSetting.findById("affiliate");
        let metasettingAff = JSON.parse(tmpMeta.value);    

        //console.log(metasettingAff);
        if (metasettingAff.enable==1) 
        {
            const minDeposit 	= metasettingAff['MinDeposit']?parseFloat(metasettingAff['MinDeposit']) : 0;
            let credit1 		= metasettingAff['Credit1']? parseFloat(metasettingAff['Credit1']) : 0;
            let credit2 		= metasettingAff['Credit2']?parseFloat(metasettingAff['Credit2']): 0;
            const minTransfer 	= metasettingAff['MinTransfer']?parseFloat(metasettingAff['MinTransfer']) : 0;
            const maxCredit 	= metasettingAff['MaxCredit']?parseFloat(metasettingAff['MaxCredit']) : 0;
            const typeCredit 	= metasettingAff['TypeCredit']?metasettingAff['TypeCredit'] : "percent";

            const onlyFirstDep 	= metasettingAff['OnlyFirstDep']?metasettingAff['OnlyFirstDep'] : 0;
            
            if (true) 
            {
                if(onlyFirstDep==1)
                {
                    let sqlStr = `SELECT * FROM report_transaction WHERE username='${row_user['id']}' AND transaction_type LIKE '%DEP%' AND approve_status=1 ORDER BY date LIMIT 0,1`;
                    let reportData = await MainModel.query(sqlStr);
                    if(reportData.length >0)
                    {
                        return returnResult;
                    }
                }


                if (credit >= minDeposit) 
                {
                    if (typeCredit=="unit") 
                    {
                        
                    }    
                    else
                    {
                        credit1 = credit * (credit1/100);
                        if (credit1>maxCredit) 
                        {
                            credit1 = maxCredit;    
                        }

                        credit2 = credit * (credit2/100);
                        if (credit2>maxCredit) 
                        {
                            credit2 = maxCredit;    
                        }
                    }

                    let username = row_user.id;
                    const mainUserData = MemberList.findById(username);                    

                    if (mainUserData) 
                    {
                        const affUsername = mainUserData.aff?mainUserData.aff:'';
                        
                        if (affUsername && affUsername!='') 
                        {
                            returnResult = {
                                aff_user 			: affUsername,
                                aff_user_credit 	: credit1,
                            };

                            const userAff = MemberList.findById(affUsername);
                            if (userAff) 
                            {
                                
                                const idReq = TransactionList.generateRequestID("depositaffg");
                                TransactionManage.create(idReq,userAff,"SYSTEM",0,credit1,0,0,"AFFG",userAff.bank_acc_no,userAff.bank_name
                                        ,null,"",null,null,null,"SYSTEM",1
                                        ,timerHelper.convertDatetimeToStringNoT(cTime),0,timerHelper.convertDatetimeToStringNoT(cTime)
                                        ,"ได้รับจากยอดฝากของเพื่อนลำดับที่ 1 "+username
                                        ,null,null,null,null,username,credit,"");                            
                                //Update credit
                                MemberList.increaseCreditAff(userAff.id,credit1);

                                const affUsername2 = userAff.aff?userAff.aff:'';                            
                                if (userAff.aff && affUsername2!='' ) 
                                {                                    
                                    const userAff2 = MemberList.findById(affUsername2);                                    

                                    if (userAff2) 
                                    {
                                        const idReq2 = TransactionList.generateRequestID("depositaffg2");
                                        TransactionManage.create(idReq2,userAff2,"SYSTEM",0,credit2,0,0,"AFFG2",userAff2.bank_acc_no,userAff2.bank_name
                                            ,null,"",null,null,null,"SYSTEM",1
                                            ,timerHelper.convertDatetimeToStringNoT(cTime),0,timerHelper.convertDatetimeToStringNoT(cTime)
                                            ,"ได้รับจากยอดฝากของเพื่อนลำดับที่ 2 "+username
                                            ,null,null,null,username,userAff.id,credit,"");
    
                                        //Update credit
                                        MemberList.increaseCreditAff(userAff2.id,credit2);
                                    }
                                   
                                }
                            }
                            

                        }
                    }
                }
            }
        }

        return returnResult;

    } 
    catch (error) 
    {
        console.log(error);
        return {
            aff_user 			: null,
            aff_user_credit 	: 0,
        };
    }
    
}

module.exports = Aff;