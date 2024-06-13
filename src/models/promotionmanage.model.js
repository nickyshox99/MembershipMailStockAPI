var dbConn = require('../../config/db.config');
const Cryptof = require('./cryptof.model');
const MemberList = require('./memberlist.model');
const TransactionList = require('./transactionlist.model');
const timerHelper = require('./../modules/timehelper');
const MainModel = require('./main.model');

const OffsetTime = require('../../config/offsettime');

const offsetTime = OffsetTime.offsetTime;
const offsetTime24hrs = OffsetTime.offsetTime24hrs;

var PromotionManage = function() {
    
};

PromotionManage.calPromotion = function(userdata,isset_credit,fromexecute=false, result){
    let create_pro = false;
    let bonus = 0;
    let turnover = 0;
    let total_deposit_credit = parseFloat(isset_credit);    
    
    let turnover_type = '';
    let promotion_setting = [];

    let note = '';

    promotionId = userdata.accept_promotion;
    
    if (promotionId!=null && promotionId!=0) 
    {
        let sqlStr = " select *	from meta_promotion_setting where id = "+ promotionId
        const dataPromotion = dbConn.query(sqlStr);
        
        if (dataPromotion.length>0) {

            const tmpSetting = JSON.parse(dataPromotion[0].meta);
            promotion_setting = tmpSetting;
            promotion_setting['status'] 	= dataPromotion[0].status;
            promotion_setting['id'] 		= dataPromotion[0].id;

            if (promotion_setting.length!=0) 
            {
                if (promotion_setting.status==1) 
                {
                    let check_credit = false;    
                    if(promotion_setting['DepositType']=="Min" && isset_credit >= promotion_setting['Deposit']){
						check_credit = true;
					}else if(promotion_setting['DepositType']=="Equal" && isset_credit == promotion_setting['Deposit']){
						check_credit = true;
					}else if(promotion_setting['DepositType']=="Max" && isset_credit <= promotion_setting['Deposit']){
						check_credit = true;
					}

                    if (check_credit) 
                    {
                        can_get_pro = false;
                        can_get_pro = this.check(userdata.id, promotion_setting,fromexecute);                        

                        if (can_get_pro.can_get_pro) 
                        {
                            if(promotion_setting['Rec_type']=="percent"){
                                bonus = (isset_credit * parseFloat(promotion_setting['Rec']))/100;
                            }else{
                                bonus = parseFloat(promotion_setting['Rec']);
                            }
    
                            if(bonus > promotion_setting['Limit']){
                                bonus = parseFloat(promotion_setting['Limit']);
                            }
    
                            total_deposit_credit += bonus;
    
                            if(promotion_setting['LimitType']=="DepositSumBonus"){
                                if(total_deposit_credit > parseFloat(promotion_setting['Limit'])){
                                    total_deposit_credit = parseFloat(promotion_setting['Limit']);
                                }
                            }
                        
                            if(promotion_setting['TurnType']=="percent"){
                                    
                                let cal = (isset_credit + bonus);
                                
                                if(promotion_setting['TurnCal'] == "credit")
                                {
                                    cal = isset_credit;
                                }
                                else if(promotion_setting['TurnCal'] == "bonus")
                                {
                                    cal = bonus;
                                }
                                
                                turnover = (cal) * promotion_setting['TurnOver'];
                            }else{
                                turnover = promotion_setting['TurnOver'];
                            }
                            
                            turnover_type = promotion_setting['TurnTypeWithdraw'];
                            
                            create_pro = true;
                        }
                        else
                        {
                            note = can_get_pro.message;
                        }
                       
                    }
                    else
                    {
                        can_get_pro = false;
                        note = 'Must Deposit '+ promotion_setting['DepositType'] + ' : '+ promotion_setting['Deposit'];
                    }

                }
            }
        }
    }

    return {
        bonus					: bonus,
        total_deposit_credit	: total_deposit_credit,
        turnover				: turnover,
        ForCreateTurn			: {
            bonus				: bonus,
            turnover			: turnover,
            turnover_type		: turnover_type,
            promotion_setting	: promotion_setting ? promotion_setting : [],
            row_user			: userdata,
            create_pro		    : create_pro,
            note                : note,
        }
    };

}

PromotionManage.customTurn = function(userdata,isset_credit,turn_setting, result){
    let bonus					= 0;
    let turnover 				= turn_setting['turn'] ? parseInt(turn_setting['turn']) : 0;
	let turnover_type 			= turn_setting['turnover_type'] ? turn_setting['turnover_type'] : "credit";
	let total_deposit_credit 	= isset_credit;

    let row_user = userdata;
    let tmp_data_promotion = {        
        username		:  row_user['id'],
        uid			    :  row_user['uid'],
        mobile_no 	    :  row_user['mobile_no'],
        value    		:  JSON.stringify({
                            bonus_name 		    : turn_setting['Title'] ? turn_setting['Title'] : "ตั้งเทิร์นด้วยตัวเอง",
                            bonus_amount 		: bonus,
                            turnover 			: turnover,
                            TurnTypeWithdraw 	: turnover_type,
                            MaxWithdraw		    : turn_setting['MaxWithdraw'] ? turn_setting['MaxWithdraw'] : 0,
                            GameType			: "all",
                            pro_id			    : null
                        }),
        Type 			: "CustomTurn",
        status		    : 1,
        date			: new Date()
    };

    this.createDataPromotion(tmp_data_promotion);    
    this.setPromotion(userdata,99999,parseInt(row_user['turn']) + turnover);

    return {
        bonus					: bonus,
        total_deposit_credit	: total_deposit_credit,
        turnover				: turnover
    };
}

PromotionManage.createTurn = function(asset, result){
    let row_user 			= asset['row_user'];
	let promotion_setting 	= asset['promotion_setting'];
	let bonus 				= asset['bonus'];
	let turnover 			= asset['turnover'];
	let turnover_type 		= asset['turnover_type'];
    
    let tmp_data_promotion = {        
        username		:  row_user['id'],
        uid			    :  row_user['uid'],
        mobile_no 	    :  row_user['mobile_no'],
        value    		:  JSON.stringify({
                            bonus_name 		    : promotion_setting['Title'] ? promotion_setting['Title'] : "ตั้งเทิร์นด้วยตัวเอง",
                            bonus_amount 		: bonus,
                            turnover 			: turnover,
                            TurnTypeWithdraw 	: turnover_type,
                            MaxWithdraw		    : promotion_setting['MaxWithdraw'] ? promotion_setting['MaxWithdraw'] : 0,
                            GameType			: "all",
                            pro_id			    : promotion_setting['id'],
                        }),
        Type 			: promotion_setting['Type'],
        proid          : promotion_setting['id'],
        status		    : 1,
        date			: new Date()
    };

    this.createDataPromotion(tmp_data_promotion);
    this.setPromotion(row_user,promotion_setting['id'],row_user['turn'] + turnover);

}

PromotionManage.cancelPromotion = function(userdata, result){
    
    this.setPromotion(userdata,0,0);
    try {        
        const datas = dbConn.query("UPDATE meta_promotion SET "+             
        "status=? "        
        +" WHERE username = ? "
        , [         
            0                        
            , userdata.id]
        );   
        
        dbConn.end;
        return datas;
    } catch (error) {
        console.log(error);
        return error;
    }

}

PromotionManage.setPromotion = function(userdata,promotionId,turn, result){
    try {
        // console.log(rowid);
        // console.log(tmpData);

        // console.log(promotionId?promotionId:99999
        //     ,turn
        //     , timerHelper.getDateTimeNowStringNoT()
        //     , userdata.id);

        const datas = dbConn.query("UPDATE sl_users SET "+             
        "accept_promotion=? "
        + ",turn=? "
        + ",turn_date=? "
        +" WHERE id = ? "
        , [         
            promotionId?promotionId:99999
            ,turn
            , timerHelper.getDateTimeNowStringNoT()
            , userdata.id]
        );   
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        dbConn.end;
        return datas;
    } catch (error) {
        console.log(error);
        return error;
    }
}

PromotionManage.canGetPromotion = function(userdata,promotionId, result){
    let can_get_pro = false;
    if (promotionId==0) 
    {
        can_get_pro = true;
    }
    else
    {
        let sqlStr = " select *	from meta_promotion where and username = '"+ userdata.id +"' and status=1";
        const dataPromotion = dbConn.query(sqlStr);
        if (count(dataPromotion)==0) 
        {
            let promotion_setting = [];
            sqlStr = " select *	from meta_promotion_setting where and id = '"+ promotionId.toString() +"'";    
            const dataPromotionSetting = dbConn.query(sqlStr);
            if (count(dataPromotionSetting)>0) 
            {                
                const tmpSetting = JSON.parse(dataPromotion[0].meta);
                promotion_setting = tmpSetting;
                promotion_setting['status'] 	= dataPromotion[0].status;
                promotion_setting['id'] 		= dataPromotion[0].id;
            }


        }
    }
    can_get_pro = this.check(userdata.id, promotion_setting,false);

    return can_get_pro.can_get_pro;
}

PromotionManage.getDataPromotion = function(username,promotiontype,otherCondition,result) {
    let sqlStr = " select *	from meta_promotion where username = '"+ username +"' and Type='"+promotiontype+"' ";    
    if (otherCondition.length>0) {
        sqlStr += " "+ otherCondition;
    }
    
    // console.log(sqlStr);
    const datas = dbConn.query(sqlStr);
    
    dbConn.end;
    return datas?datas:[];
}



PromotionManage.check = function(userid,promotion_setting,fromexecute=false,result) {

    let cTime = new Date();
    cTime = new Date(cTime.getTime() + (offsetTime));

    let can_get_pro = false;    
    if (!fromexecute) 
    {
        let tmpTurn = MemberList.findById(userid);
        const lastDeposit = TransactionList.findLastDepTransactionByUsername(userid,true);

        if(lastDeposit['credit'])
        {
            if (tmpTurn['turn']!=lastDeposit['credit'] && tmpTurn['turn']>0) 
            {
                return {
                    can_get_pro: false,
                    message : 'Still have old turn',
                };	
            }
        }	
    }

    
    if (promotion_setting['Type']=="NewMember") 
    {
        const tmp_check_promotion = this.getDataPromotion(userid,"NewMember","");        
		let countUsedPro=0;
        for (let index = 0; index < tmp_check_promotion.length; index++) {
            // const elementS = tmp_check_promotion[index];
            // for (const [key, value] of Object.entries(elementS)) 
            // {
            //     tmp_check_promotion[index][key] = value;
            // }
            countUsedPro++;            
        }

        if(countUsedPro==0){
            can_get_pro = true;
        }
        // else if( parseInt(promotion_setting['LimitPerDay'])>0 && parseInt(promotion_setting['LimitPerDay'])>=countUsedPro ){
        //     can_get_pro = true;            
        // }
        else {
            can_get_pro = false;
            return {
                can_get_pro: false,
                message : 'Use promotion over limit',
            };	
        }

    }
    else if (promotion_setting['Type']=="NewDay") 
    {
        const tmp_check_promotion = this.getDataPromotion(userid,"NewDay","and date like '"+ timerHelper.convertDateToString(cTime)+"%'");        
        let countUsedPro=0;
        for (let index = 0; index < tmp_check_promotion.length; index++) {
            const elementS = tmp_check_promotion[index];
            for (const [key, value] of Object.entries(elementS)) 
            {
                tmp_check_promotion[index][key] = value;
            }

            if (tmp_check_promotion[index]['proid']==promotion_setting['id']) 
            {
                countUsedPro++;
            }
        }


        if(countUsedPro==0){
            can_get_pro = true;
        }
        else if(parseInt(promotion_setting['LimitPerDay'])>0 && parseInt(promotion_setting['LimitPerDay'])>countUsedPro ){
            can_get_pro = true;
        }
        else {            
            return {
                can_get_pro: false,
                message : 'Use promotion over limit per day',
            };
        }
    }    
    else if (promotion_setting['Type']=="HappyTime") 
    {
        const tmp_check_promotion = this.getDataPromotion(userid,"HappyTime"," and (TIME(date) >= '"+promotion_setting['From']+"' and TIME(date) <= '"+promotion_setting['To']+"' )");        
        let countUsedPro=0;
        for (let index = 0; index < tmp_check_promotion.length; index++) {
            const elementS = tmp_check_promotion[index];
            for (const [key, value] of Object.entries(elementS)) 
            {
                tmp_check_promotion[index][key] = value;
            }

            if (tmp_check_promotion[index]['proid']==promotion_setting['id']) 
            {
                countUsedPro++;
            }
        }

        const currentTimeString = getCurrentTimeString(cTime);        

        const startTimeString = promotion_setting['From'];
        const endTimeString = promotion_setting['To'];

        const currentTime = new Date(`1970-01-01T${currentTimeString}`);
        const startTime = new Date(`1970-01-01T${startTimeString}`);
        const endTime = new Date(`1970-01-01T${endTimeString}`);
        
        const isInTimeRange = isTimeInRange(startTime, endTime, currentTime);
        
        if (isInTimeRange) {
        
        } else {
            return {
                can_get_pro: false,
                message : 'Out of time promotion can get '+startTimeString+' - '+endTimeString,
            };
        }

        if(countUsedPro==0){
            can_get_pro = true;
        }
        else if(parseInt(promotion_setting['LimitPerDay'])>0 && parseInt(promotion_setting['LimitPerDay'])>countUsedPro ){
            can_get_pro = true;
        }
        else {            
            return {
                can_get_pro: false,
                message : 'Use promotion over limit per day',
            };
        }
    }
    else if (promotion_setting['Type']=="CodeFree") 
    {
        const tmp_check_promotion = this.getDataPromotion(userid,"CodeFree","");        
        let countUsedPro=0;
        countUsedPro = tmp_check_promotion.length;
        
        if(countUsedPro==0){
            can_get_pro = true;
        }
        else
        {
            return {
                can_get_pro: false,
                message : 'Used to promotion',
            };
        }
    }
    else if (promotion_setting['Type']=="CustomPro") 
    {
        can_get_pro= true;
    }
    else if (promotion_setting['Type']=="Normal") 
    {
        const tmp_check_promotion = this.getDataPromotion(userid,"Normal","");        
        let countUsedPro=0;
        for (let index = 0; index < tmp_check_promotion.length; index++) {
            const elementS = tmp_check_promotion[index];
            for (const [key, value] of Object.entries(elementS)) 
            {
                tmp_check_promotion[index][key] = value;
            }

            if (tmp_check_promotion[index]['proid']==promotion_setting['id']) 
            {
                countUsedPro++;
            }
        }

        if(countUsedPro==0){
            can_get_pro = true;
        }
        else if(parseInt(promotion_setting['LimitPerDay'])>0 && parseInt(promotion_setting['LimitPerDay'])>countUsedPro ){
            can_get_pro = true;
        }
        else {
            can_get_pro = false;
            return {
                can_get_pro: false,
                message : 'Use promotion over limit per day',
            };
        }
    }

    return {
        can_get_pro: can_get_pro,
        message : '',
    };	
}

PromotionManage.createDataPromotion = function(data_promotion,result){
    
    try {
        
        const datas = dbConn.query("INSERT INTO meta_promotion ("+ 
        ",username "        
        +",mobile_no "
        +",value "
        +",Type "
        +",status "
        +",date "         
        +",proid "
        +" ) VALUES (?,?,?,?,?,?,?)"
        , [
            data_promotion.username            
            ,data_promotion.mobile_no
            ,data_promotion.value
            ,data_promotion.Type
            ,data_promotion.status
            ,timerHelper.getDateTimeNowStringNoT()
            ,data_promotion.proid?data_promotion.proid:-1
        ]);
        
        // const datas=[];
        // datas['affectedRows'] = 0;
        dbConn.end;
        return datas;
    } catch (error) {
        console.log(error);
        return error;
    }
}


function isTimeInRange(startTime, endTime, currentTime) {
    return startTime <= currentTime && currentTime <= endTime;
  }
  
function getCurrentTimeString(now) {
      
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    return `${hours}:${minutes}:${seconds}`;
}
  


module.exports = PromotionManage;