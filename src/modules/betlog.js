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
const timerHelper = require('../modules/timehelper');
const { getDateTimeNowString } = require('../modules/timehelper');
const TransactionList = require('../models/transactionlist.model');

const OffsetTime = require('../../config/offsettime');

const offsetTime = OffsetTime.offsetTime;
const offsetTime24hrs = OffsetTime.offsetTime24hrs;

class Betlog {
  
    constructor() {        
       
    }

    changeTimeToVersion(dateValue)
	{		
		let strDate = timerHelper.getDateTimeNowShortStringNumberOnly();
		return strDate;
	}

    async getBetLog()
    {
        try 
        {   
			let sqlStr ="SELECT * FROM betlog_running WHERE Active=1 and TypeCron='betlog' LIMIT 0,1 ";
			let ActiveBetLog = MainModel.query(sqlStr);
			if (ActiveBetLog.length<=0) 
			{
				return;
			}

            sqlStr ="SELECT * FROM latest_bet_update ORDER BY datetime_update desc LIMIT 0,1 ";  			
            let header = MainModel.query(sqlStr);
            if (header.length>0)
            {
                
                let tmpHDID =header[0]['id'];
			    let tmpLatestUpdateTime = timerHelper.convertDatetimeToStringNoT(header[0]['datetime_update']);
			    let hdstatus = header[0]['hd_status'];

                const now = new Date();
                let lastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
                if(tmpLatestUpdateTime < lastWeek )
                {
                    let tmpData = {						
                        "datetime_update" : timerHelper.convertDatetimeToStringNoT(lastWeek),
						"hd_status" : 0,
						"version" : this.changeTimeToVersion(lastWeek)
                    };           
                    MainModel.insert("latest_bet_update",tmpData);
                    
                }
				else 			
				{
					if(hdstatus==1)	
					{				
						let tmpDate2 = new Date(header[0]['datetime_update']);
						let nextTime = new Date(tmpDate2.getTime() + (60 * 60 * 1000));
						
						let tmpData = {						
							"datetime_update" : timerHelper.convertDatetimeToStringNoT(nextTime),
							"hd_status" : 0,
							"version" : this.changeTimeToVersion(nextTime)
						}; 
						
						MainModel.insert("latest_bet_update",tmpData);
					}
				}
            }
            else
            {
				const now = new Date();
                let tmpDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
			    let tmpData = {						
                        "datetime_update" : timerHelper.convertDatetimeToStringNoT(tmpDate),
						"hd_status" : 0,
						"version" : this.changeTimeToVersion(tmpDate)
                };

                MainModel.insert("latest_bet_update",tmpData);
            }

            sqlStr = "SELECT * FROM latest_bet_update WHERE hd_status=0 ORDER BY datetime_update desc LIMIT 0,1 ";
            let HDData = MainModel.query(sqlStr);			
			
			if (HDData.length>0) 
            {   
				let tmpFromtime = new Date(HDData[0]['datetime_update']);
                // let fromDateTime = timerHelper.convertDatetimeToStringNoT(HDData[0]['datetime_update']);
				let fromDateTime = tmpFromtime;
				let tmpTotime = new Date(tmpFromtime.getTime() + (60 * 60 * 1000));
			    // let toDateTime = timerHelper.convertDatetimeToStringNoT(tmpTotime);
				let toDateTime = tmpTotime;

                console.log(timerHelper.getDateTimeNowStringNoT()+ " GetBetLog");

				let checkTime = new Date(HDData[0]['datetime_update']);
				let tmpNow = new Date();
				checkTime.setMinutes( 0, 0, 0);
				tmpNow.setMinutes( 0, 0, 0);
				if (checkTime>tmpNow) {
					return;
				}
                
                let headerID = HDData[0]['id'];                
                let calculate_point = AdminSetting.findById("calculate_point");                
                let calSetting = JSON.parse(calculate_point['value']);
                const pointPerCredit = calSetting.percredit? parseFloat(calSetting.percredit):0;


                //เอาเฉพาะ username ที่ยังไม่ได้อัพเดท
				sqlStr = " SELECT sl_users.id as username FROM sl_users WHERE id not in (SELECT latest_bet_update_detail.username FROM latest_bet_update ";
				sqlStr += "INNER JOIN latest_bet_update_detail ON latest_bet_update_detail.latest_hid = latest_bet_update.id ";
				sqlStr += "WHERE ";
				sqlStr += ` latest_bet_update.id=${headerID} ) limit 0,3`;

				
                let UserData = MainModel.query(sqlStr);
                let countUpdateUser = 0;
				
                for (let index = 0; index < UserData.length; index++) {					
                    const element = UserData[index];
					
                    let tmpUsername = element['username'];
                    let insertListData=[];
                    let countListData = 0;

					// console.log(tmpUsername);

					console.log(tmpUsername,fromDateTime,toDateTime);
                    let res = await AgentMain.getBetLog("",tmpUsername,fromDateTime,toDateTime,0,1000);

					let cTime = new Date(fromDateTime);
                	cTime = new Date(cTime.getTime() + (offsetTime));
					
					// console.log(res);
                    if (res.msgerror) 
                    {						
						const msg = res.msgerror;
						console.log(msg);
						if (msg.includes("user not found")) 
						{
							let tmpInsertData ={
								"latest_hid" : headerID,
								"username" : tmpUsername
							};
	
							MainModel.insert("latest_bet_update_detail",tmpInsertData);
							countUpdateUser++;
						}
                    }
                    else
                    {

                        let tmpDataList =[] ;
						tmpDataList.push(res);
						for (let iDataList = 0; iDataList < tmpDataList.length; iDataList++) 
                        {                            
                            let item = tmpDataList[iDataList];
                            let tmpPoint = 0.0;
							if (item['total']==null||item['total']==0) 
							{
								
							}							
							else
							{
								if(pointPerCredit > 0)
								{
									tmpPoint = Math.abs(item['winloss']/pointPerCredit) ;	
								}
								
								let tmpInsertData = {
									"date" : timerHelper.convertDatetimeToStringNoT(cTime),
									"username" : tmpUsername,
									"turnover" : item['turnover'],
									"valid_amount" : item['valid_amount'],
									"stake_count" : 0,
									"winloss" : item['winloss'],
									"commission" : item['commission'],
									"total" : item['total'],
									"ag_commission" : 0 ,
									"point" : tmpPoint,								
									"productId" : item['provider']?item['provider']:'',
									"gamecode" : '',
									"gamename" : '',									
								};
														
								insertListData.push(tmpInsertData);
								countListData++;
							}
                        }

                        if (insertListData.length > 0) 
						{					
							//Insert to table bet_log							
                            for (let index = 0; index < insertListData.length; index++) {
                                const element = insertListData[index];
                                MainModel.insert("bet_log",element);
                            }
						}

                        let tmpInsertData ={
							"latest_hid" : headerID,
							"username" : tmpUsername
                        };

                        MainModel.insert("latest_bet_update_detail",tmpInsertData);
                        countUpdateUser++;

                    }
                }

                sqlStr = " SELECT sl_users.id as username FROM sl_users WHERE id not in (SELECT latest_bet_update_detail.username FROM latest_bet_update ";
                sqlStr += "INNER JOIN latest_bet_update_detail ON latest_bet_update_detail.latest_hid = latest_bet_update.id ";
                sqlStr += "WHERE ";
                sqlStr += ` latest_bet_update.id=${headerID} )`;

                UserData = MainModel.query(sqlStr);
                let completeVersion = 0;

                if (UserData.length==0) 
                {
                    let tmpData = {
                        "hd_status" : 1,
                    };

					let condition = {
						"id" : headerID
					}

                    MainModel.update("latest_bet_update",tmpData,condition,"");
                    let completeVersion = 1;
					
					this.runCalculationCommissionByHDID(headerID);
                }
                else
                {
                    
                }

            }

        } catch (error) {
            console.log(error);
        }
    }

    async runCalculationCommissionByHDID(headerID)
    {
        try {

			console.log(timerHelper.getDateTimeNowStringNoT()+' runCalculationCommissionByHDID : '+headerID);

            let sqlStr =`SELECT * FROM latest_bet_update WHERE id=${headerID} `;
		    let HDData = MainModel.query(sqlStr);

            if (HDData.length==0) 
            {
                return;    
            }

            let adminAffiliate_bet = AdminSetting.findById("affiliate_bet");        
            let tmp3 = JSON.parse(adminAffiliate_bet['value']);

            let TypeCredit ="";
            let Credit1 = 0.0;
            let Credit2 = 0.0;
            let enable = 0;

            if(tmp3)
            {
                TypeCredit = tmp3.TypeCredit;
                Credit1 = parseFloat(tmp3.Credit1.replace("%",""));
                Credit2 = parseFloat(tmp3.Credit2.replace("%",""));
                enable = tmp3.enable;
            }

            let refund_setting= {
                'Percent':0.00,   
            };
            
            let tmprefund = AdminSetting.findById("refund");        
            refund_setting = JSON.parse(tmprefund['value']);

            let percentCom = refund_setting['Percent'];
            let refundEnabled = false;
            if (refund_setting['enable']) {
				refundEnabled = refund_setting['enable'];
			}

            if ((refundEnabled || enable==1)) 
            {
                let sdate = new Date(HDData[0]['datetime_update']);
                sqlStr ="SELECT * FROM bet_log WHERE date='"+timerHelper.convertDatetimeToString(sdate) +"' and calcomis = 0 ";
                let betList = MainModel.query(sqlStr);
                

				let cTime = new Date(sdate);
				cTime = new Date(cTime.getTime() + (offsetTime));

				// console.log(betList);

                for (let i = 0; i < betList.length; i++) {                    
                    
                    let thisUsername = betList[i]['username'];
					let turnOver = betList[i]['turnover'];
					let winloss = betList[i]['winloss'];
                    let loss = 0;

                    if (winloss<0) {
						loss = Math.abs(winloss);
					}
					
                    let amountForCal = 0;
					if (TypeCredit=='unit') 
					{						
						//ยอดเสีย						
						amountForCal = loss;
					}
					else if (TypeCredit=='percent') 
					{
						//ใช้ยอดเดิมพัน
						amountForCal = turnOver;
					}

                    if (amountForCal>0)
					{
						// console.log(thisUsername + " : " +amountForCal);
						sqlStr = `SELECT * FROM sl_users WHERE id = '${thisUsername}'`;
						let afflv1 = MainModel.query(sqlStr);
						
						if (enable==1 && afflv1[0]['aff'] && TypeCredit!='') 
						{		
							sqlStr = `SELECT * FROM sl_users WHERE id = '${afflv1[0]['aff']}' `;
							let rowlv1 =  MainModel.query(sqlStr);

							if (Credit2 > 0 ) 
							{
								if(rowlv1[0]['aff'])
								{
									//เพิ่มให้ lv 2
									sqlStr = `SELECT * FROM sl_users WHERE id = '${rowlv1[0]['aff']}' `;
									let afflv2 = MainModel.query(sqlStr);

									let row_user = afflv2[0];

									let giveCredit = amountForCal * Credit2 / 100;
														
									let id = TransactionList.generateRequestID("");

									tmp_data = {
										"id" 				: id,										
										'agent'				: row_user['agent'],
										'username'			: row_user['id'],
										'uid'				: row_user['uid'],
										'mobile_no'			: row_user['mobile_no'],
										'admin_bank'		: "SYSTEM",
										'credit'			: giveCredit,
										'credit_bonus'		: 0,
										'credit_before'		: row_user['credit'],
										'credit_after'		: row_user['credit']+ giveCredit,
										'transaction_type'	: "AFF",
										'bank_acc_name'		: row_user['fullname'],
										'bank_acc_no'		: row_user['bank_acc_no'],
										'bank_name'			: row_user['bank_name'],
										'bank_time'			: null,
										'bank_desc'			: "",
										'promotion'			: null,
										'promotion_id'		: null,
										'approve'			: "SYSTEM",
										'approve_date'		: timerHelper.convertDatetimeToStringNoT(cTime),
										'approve_status'	: 1,
										'score'				: 0,
										'date'				: timerHelper.convertDatetimeToStringNoT(cTime),
										'note'				: "ได้รับเงินจากการเล่นของเพื่อน LV2 : "+thisUsername,
										'am_bank_bank_acc'	: null,
										'am_bank_name'		: null,
										'am_bank_bank'		: null,
									};

                                    MainModel.insert("report_transaction",tmp_data);									

									sqlStr=` UPDATE sl_users SET 
									credit_aff = credit_aff + ${giveCredit} 
									WHERE 
									id='${row_user['id']}' 
									`;
									
                                    MainModel.query(sqlStr);

									countlv2+=1;
								}							
							}

							if (Credit1 > 0 ) {
								//เพิ่มให้ lv 1
																
								let row_user = rowlv1[0];
								let giveCredit = amountForCal * Credit1 / 100;
							
								// date = date("Y-m-d H:i:s");
													
								let id = TransactionList.generateRequestID("");

								tmp_data = {
									"id" 				: id,									
									'agent'				: row_user['agent'],
									'username'			: row_user['id'],
									'uid'				: row_user['uid'],
									'mobile_no'			: row_user['mobile_no'],
									'admin_bank'		: "SYSTEM",
									'credit'			: giveCredit,
									'credit_bonus'		: 0,
									'credit_before'		: row_user['credit'],
									'credit_after'		: row_user['credit']+ giveCredit,
									'transaction_type'	: "AFF",
									'bank_acc_name'		: row_user['fullname'],
									'bank_acc_no'		: row_user['bank_acc_no'],
									'bank_name'			: row_user['bank_name'],
									'bank_time'			: null,
									'bank_desc'			: "",
									'promotion'			: null,
									'promotion_id'		: null,
									'approve'			: "SYSTEM",
									'approve_date'		: timerHelper.convertDatetimeToStringNoT(cTime),
									'approve_status'	: 1,
									'score'				: 0,
									'date'				: timerHelper.convertDatetimeToStringNoT(cTime),
									'note'				: "ได้รับเงินจากการเล่นของเพื่อน LV1 : "+thisUsername,
									'am_bank_bank_acc'	: null,
									'am_bank_name'		: null,
									'am_bank_bank'		: null,
								};
								
                                MainModel.insert("report_transaction",tmp_data);

								sqlStr=` UPDATE sl_users SET 
								credit = credit + ${giveCredit} 
								WHERE 
								id='${row_user['id']}' 
								`;

                                MainModel.query(sqlStr);								
								countlv1+=1;
							
								
							}


						}

						if (refundEnabled) 
						{
							let giveCredit2 = amountForCal * percentCom / 100;
							sqlStr = ` UPDATE sl_users SET 
							credit_free = credit_free + ${giveCredit2} 
							WHERE 
							id='${thisUsername}' 
							`;
							MainModel.query(sqlStr);	
						}
					}
                    
                    sqlStr = ` UPDATE bet_log SET calcomis = 1
                        WHERE 
                        id='${betList[i]['id']}' 
                        `;
					MainModel.query(sqlStr);
                }
            }
            

        } catch (error) {			
            console.log(error);
        }
        
    }

}

module.exports = Betlog;