const https = require('https');
const axios = require('axios');

const jwt = require('jsonwebtoken');
const AdminList = require('../models/adminlist.model');
const MemberList = require('../models/memberlist.model');
const AgentMain = require('../models/agentapi/agentmain.model');
const MainModel = require('../models/main.model');

const AdminSetting = require('../models/adminsetting.model');

const PromotionManage = require('../models/promotionmanage.model');
const PromotionSetting = require('../models/promotionsetting.model');

const Secret = require('../../config/secret');

var crypto = require('crypto'); 

var session = require('express-session');
const { count } = require('console');
const timerHelper = require('./timehelper');
const { getDateTimeNowString } = require('./timehelper');
const TransactionList = require('../models/transactionlist.model');

class UserRemove {
  
    constructor() {        
       
    }

    changeTimeToVersion(dateValue)
	{		
		let strDate = timerHelper.getDateTimeNowShortStringNumberOnly();
		return strDate;
	}

    async removeUser()
    {
        try 
        {   
			let tmpStart = new Date();
            tmpStart = new Date(tmpStart.getTime() - (60 * 60 * 1000 * 24 * 30)); // 30 Days

            let sqlStr =`INSERT INTO sl_users_log  (id, mobile_no, lineid, password, fullname, turn, turn_date, bet, credit, credit_free, credit_free_check, credit_aff, bank_name, bank_acc_no, bank_id, accept_promotion, aff, last_check_aff, create_at, last_login,  knowus, level, line_userid, alias_id, alias_credit, truewalletid) 
                        SELECT id, mobile_no, lineid, password, fullname, turn, turn_date, bet, credit, credit_free, credit_free_check, credit_aff, bank_name, bank_acc_no, bank_id, accept_promotion, aff, last_check_aff, create_at, last_login,  knowus, level, line_userid, alias_id, alias_credit, truewalletid FROM sl_users WHERE last_login <='${timerHelper.convertDatetimeToString(tmpStart)}' `;
            await MainModel.query(sqlStr);

			sqlStr =`DELETE FROM sl_users WHERE last_login <='${timerHelper.convertDatetimeToString(tmpStart)}' `;
			await MainModel.query(sqlStr);

        } catch (error) {
            console.log(error.message);
        }
    }

    async removeLog()
    {
        try 
        {   
            let sqlStr
            
			let tmpStart = new Date();
            tmpStart = new Date(tmpStart.getTime() - (60 * 60 * 1000 * 24 * 30)); // 30 Days
          
			sqlStr =`DELETE FROM notice_admin WHERE date <='${timerHelper.convertDatetimeToString(tmpStart)}' `;
			MainModel.query(sqlStr);

            sqlStr =`DELETE FROM notice_user WHERE date <='${timerHelper.convertDatetimeToString(tmpStart)}' `;
			MainModel.query(sqlStr);

            sqlStr =`DELETE FROM transfer_ref WHERE date <='${timerHelper.convertDatetimeToString(tmpStart)}' `;
			MainModel.query(sqlStr);
            

        } catch (error) {
            console.log(error.message);
        }
    }

   
}

module.exports = UserRemove;