const axios = require('axios');


const AdminSetting = require('../models/adminsetting.model');
const MainModel = require('../models/main.model');
const LoanList = require('../models/loanlist.model');
const LineModel = require('./lineModel.js');


const Secret = require('../../config/secret');

var crypto = require('crypto'); 

const timerHelper = require('../modules/timehelper');
const { getDateTimeNowString } = require('../modules/timehelper');

const OffsetTime = require('../../config/offsettime');

const offsetTime = OffsetTime.offsetTime;
const offsetTime24hrs = OffsetTime.offsetTime24hrs;

class LineLog {
  
    constructor() {        
       
    }

    changeTimeToVersion(dateValue)
	{		
		let strDate = timerHelper.getDateTimeNowShortStringNumberOnly();
		return strDate;
	}

    async getLineLog()
    {
        try 
        {   
			let sqlStr ="";
			// let ActiveBetLog = MainModel.query(sqlStr);
			// if (ActiveBetLog.length<=0) 
			// {
			// 	return;
			// }

            sqlStr ="SELECT * FROM latest_line_update ORDER BY datetime_update desc LIMIT 0,1 ";  			
            let header = await MainModel.query(sqlStr);
            if (header.length>0)
            {
                
                let tmpHDID =header[0]['id'];
			    let tmpLatestUpdateTime = timerHelper.convertDatetimeToStringNoT(header[0]['datetime_update']);
			    let hdstatus = header[0]['hd_status'];

                let now = new Date();
				now = new Date(now.getTime() + (offsetTime));
                let lastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                if(tmpLatestUpdateTime < lastWeek )
                {
                    let tmpData = {						
                        "datetime_update" : timerHelper.convertDatetimeToStringNoT(lastWeek),
						"hd_status" : 0,
						"version" : this.changeTimeToVersion(lastWeek)
                    };           
                    await MainModel.insert("latest_line_update",tmpData);
                    
                }
				else 			
				{
					if(hdstatus==1)	
					{				
						let tmpDate2 = new Date(header[0]['datetime_update']);
						let nextTime = tmpDate2.setDate(tmpDate2.getDate()+1);
						
						let tmpData = {						
							"datetime_update" : timerHelper.convertDatetimeToStringNoT(nextTime),
							"hd_status" : 0,
							"version" : this.changeTimeToVersion(nextTime)
						}; 
						
						await MainModel.insert("latest_line_update",tmpData);
					}
				}
            }
            else
            {
				let now = new Date();
				now = new Date(now.getTime() + (offsetTime));
                let tmpDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			    let tmpData = {						
                        "datetime_update" : timerHelper.convertDatetimeToStringNoT(tmpDate),
						"hd_status" : 0,
						"version" : this.changeTimeToVersion(tmpDate)
                };

                await MainModel.insert("latest_line_update",tmpData);
            }

            sqlStr = "SELECT * FROM latest_line_update WHERE hd_status=0 ORDER BY datetime_update desc LIMIT 0,1 ";
            let HDData = await MainModel.query(sqlStr);			
			
			if (HDData.length>0) 
            {   
				let tmpFromtime = new Date(HDData[0]['datetime_update']);
                // let fromDateTime = timerHelper.convertDatetimeToStringNoT(HDData[0]['datetime_update']);
				let fromDateTime = tmpFromtime;
				let tmpTotime = fromDateTime.setDate(fromDateTime.getDate()+1);
			    // let toDateTime = timerHelper.convertDatetimeToStringNoT(tmpTotime);
				let toDateTime = tmpTotime;

                console.log(timerHelper.getDateTimeNowStringNoT()+ " GetLineLog");

				let checkTime = new Date(HDData[0]['datetime_update']);
				let tmpNow = new Date();
				tmpNow = new Date(tmpNow.getTime() + (offsetTime));
				checkTime.setHours(0, 0, 0, 0);
				tmpNow.setHours(0, 0, 0, 0);

				if (checkTime>tmpNow) {
					return;
				}
                
                let headerID = HDData[0]['id'];         
				
				let startDate = new Date(HDData[0]['datetime_update']);				
				let endDate = new Date(HDData[0]['datetime_update']);
				endDate.setDate(endDate.getDate() + 1 );
				

				//Send Line
				let dataLoan = await LoanList.getLoanNotPaidAll(startDate,endDate); 

				let dataByStaff = {};
				for (let index = 0; index < dataLoan.length; index++) {
					const element = dataLoan[index];

					const keyId = element.staff_id!=''?element.staff_id:'0';
					if (dataByStaff[keyId]==null) 
					{
						dataByStaff[keyId] = [];
					}

					dataByStaff[keyId].push(
						{
							customerName : element['fullname'],							
							principle_amount : parseFloat(element['principle_amount']),
							interest_amount : parseFloat(element['interest_amount']),
							fine_amount : parseFloat(element['fine_amount']),
							unpaid_previous_principle_amount : parseFloat(element['unpaid_previous_principle_amount']),
							unpaid_previous_interest_amount : parseFloat(element['unpaid_previous_interest_amount']),
							unpaid_previous_fine_amount : parseFloat(element['unpaid_previous_fine_amount']),
							totalAmount : parseFloat(element['total_amount']),
						}
					);
					
				}

				const lineSetting = await AdminSetting.findById("line_token");
                if (lineSetting) {
                    const token = JSON.parse(lineSetting.value);
                    const line_token = token['Cron_day'];
            
                    let response = "";
                    if (line_token) {
						const LineSend = new LineModel();						
						const listStaff = Object.keys(dataByStaff);

						if (listStaff.length>0) {
							let msgformat = "";
							msgformat += "═════════════\n";
							msgformat += "❄ รายการเก็บเงิน ❄\n";              
							msgformat += "ประจำวันที่ : " + timerHelper.convertDateToString(startDate) + "\n";
							msgformat += "═════════════\n";

							console.log(msgformat);
							response = await LineSend.sendMessageNotify(line_token, msgformat);

							
							for (let index = 0; index < listStaff.length; index++) {
								const elementKey = listStaff[index];
								msgformat = "";
								msgformat += "═════════════\n";
								msgformat += "Staff Id :"+ elementKey==0?'ไม่ได้มอบหมาย':elementKey + "\n"; 
								msgformat += "═════════════\n";

								const customerData = dataByStaff[elementKey];
								for (let indexCustomer = 0; indexCustomer < customerData.length; indexCustomer++) {
									const elementCustomer = customerData[indexCustomer];								
									msgformat += "ลูกค้าชื่อ : "+ elementCustomer.customerName + "\n"; 								
									msgformat += "ค่าปรับงวดนี้ : "+ elementCustomer.fine_amount + "\n";
									msgformat += "คงค้างวดก่อน : "+ (elementCustomer.unpaid_previous_principle_amount + elementCustomer.unpaid_previous_interest_amount + elementCustomer.unpaid_previous_fine_amount)  + "\n";
									msgformat += "\n";
									msgformat += "รวมเก็บงวดนี้ : "+ elementCustomer.totalAmount + "\n";
									msgformat += "═════════════\n";
								}							
								console.log(msgformat);
								response = await LineSend.sendMessageNotify(line_token, msgformat);
							}
						}
						
                    }
                }

                let tmpData = {
					"hd_status" : 1,
				};

				let condition = {
					"id" : headerID
				}

				await MainModel.update("latest_line_update",tmpData,condition,"");

            }

        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = LineLog;