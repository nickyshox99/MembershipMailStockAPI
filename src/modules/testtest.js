const https = require('https');
const axios = require('axios');

const jwt = require('jsonwebtoken');
const AdminList = require('../models/adminlist.model');
const AdminBankList = require('../models/adminbanklist.model');
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

const Cryptof = require('../models/cryptof.model');

const Scb_app_lib = require('../modules/scbapplib');
const SCBModel = require('../models/scb.model');

class TestTest {
  
    constructor() {        
       
    }

    changeTimeToVersion(dateValue)
	{		
		let strDate = timerHelper.getDateTimeNowShortStringNumberOnly();
		return strDate;
	}

    async test1()
    {
        try 
        {   
			const scb_app_lib = new Scb_app_lib();
			// scb_app_lib.Login2("091ed861-c767-57ad-4f44-ae0e103be561","121235");
			// scb_app_lib.Login2("1986bc49-61dc-d3a6-ed30-5edea70f4539","210266");
			// scb_app_lib.Login2("0f8105d5-af7f-2173-f712-803be379ee97","254202");

			// let token = [];
			// scb_app_lib.Login2("c4fb8f23-d915-9a51-cc4e-110641560d0e","888999").then(
			//     resp => 
			//     {
			//         token = resp;
			//         console.log("Login token : "+token);
			//         let header = {
			//             "Accept-Language":"th",
			//             "scb-channel":"APP",
			//             "Api-Auth" : token,
			//             "user-agent" : "Android/10;FastEasy/3.64.0/6739",
			//             "Content-Type": "application/json; charset=UTF-8",
			//             "Host" : "fasteasy.scbeasy.com:8443",
			//         };
					
			//         const data = {
			//             depositList: [
			//                 {
			//                     accountNo: "2644292875"
			//                 }
			//             ],
			//             latestTransactionFlag: false,
			//             numberRecentTxn: 2,
			//             tilesVersion: "63"
			//         };
					
			//         let url = "https://fasteasy.scbeasy.com:8443/v2/deposits/summary";
			//         try {
			//             let response;
			//             // header['User-Agent']='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36';
			//             axios({
			//                 method: "POST",
			//                 url: url,
			//                 headers: header,
			//                 data: data,                
			//             }).then(
			//                 resp => 
			//                 {
			//                     response = resp;
			//                     console.log(resp.data);
			//                 }
			//             );
					
			//         } catch (error) {
			//           console.log(error);    
			//         }

			//     }
			// );


			// token = "5e294e26-add6-464c-99bc-b3e64beef70b";
			// let header = {
			//     "Accept-Language":"th",
			//     "scb-channel":"APP",
			//     "Api-Auth" : token,
			//     "user-agent" : "Android/10;FastEasy/3.64.0/6739",
			//     "Content-Type": "application/json; charset=UTF-8",
			//     "Host" : "fasteasy.scbeasy.com:8443",
			// };

			// const data = {
			//     depositList: [
			//         {
			//             accountNo: "2644292875"
			//         }
			//     ],
			//     latestTransactionFlag: false,
			//     numberRecentTxn: 2,
			//     tilesVersion: "63"
			// };

			// let url = "https://fasteasy.scbeasy.com:8443/v2/deposits/summary";
			// try {
			//     let response;
			//     // header['User-Agent']='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36';
			//     axios({
			//         method: "POST",
			//         url: url,
			//         headers: header,
			//         data: data,                
			//     }).then(
			//         resp => 
			//         {
			//             response = resp;
			//             console.log(resp.data);
			//         }
			//     );
				
			// } catch (error) {
			//     console.log(error);    
			// }


			// try {

			//     let response;
			//     let body = {};
			//     axios.get("http://localhost:9500/api/scb/refresh_token/f30c10495f1ffbcf51127b968fbf3742",
			//     {
					
			//     }).then(
			//         resp => 
			//         {
			//             response = resp;
			//             if (response.data) {
			//                 if (response.data.status=="close") 
			//                 {
								
			//                 }
			//                 else
			//                 {
			//                     console.log(response.data);
			//                 }
			//             }
			//         }
			//     );
			
			// }
			// catch (error) 
			// {
			//     console.log(error);
			// }   

			// try {

			//     let response;
			//     let body = {};
			//     axios.get("http://localhost:9500/api/scb/autoapp/f30c10495f1ffbcf51127b968fbf3742",
			//     {
					
			//     }).then(
			//         resp => 
			//         {
			//             response = resp;
			//             if (response.data) {
			//                 if (response.data.status=="close") 
			//                 {
								
			//                 }
			//                 else
			//                 {
			//                     console.log(response.data);
			//                 }
			//             }
			//         }
			//     );
			// }
			// catch (error) 
			// {
			//     console.log(error);
			// }   

			

			let token = [];
			// token = await  scb_app_lib.Login2("c4fb8f23-d915-9a51-cc4e-110641560d0e","888999");
			

			let admin_banks = MainModel.queryFirstRow(`
					select *
					from admin_bank
					where status = 1 and bank_id in (1,5) and (bank_type = 'WITHDRAW' or bank_type = 'BOTH' ) and (work_type = 'NODE' or work_type = 'IBK')
					`);

					if (admin_banks) 
					{						
						let tmpMeta = JSON.parse(admin_banks['meta_data']);						
						admin_banks['meta_data']= tmpMeta;
						for (const [key,value] of Object.entries(tmpMeta))
						{
							admin_banks[key] = value;							
						}

						// let tmp_bank = [];						
						// tmp_bank = admin_banks;
						// const tmp_meta = JSON.parse(admin_banks.meta_data);
						// tmp_bank['meta_data'] = tmp_meta;								

						// console.log(tmp_bank['meta_data']);

						let admin_info = admin_banks;
						let user_info = {
							bank_id : 5
						};
						
						if(user_info['bank_id']=="29")
						{
							
															
						}
						else
						{
							//Bank Account
							if (admin_info) 
							{
								if(admin_info['bank_id']=="5")
								{
									const scb_app_lib = new Scb_app_lib();                                        
									// let scbtoken = token;
									let scbtoken = admin_info['scb_app_token'] ? Cryptof.decryption(admin_info['scb_app_token']) : "";

									//Login ////
									// let resp = await scb_app_lib.Profile(scbtoken, admin_info['bank_acc_number']);
									// let data = [];
									// let i = 0;

									// // console.log(resp.data);
									// if (resp['status'] && resp['status']!='error')  
									// {
									// 	if (resp['status']['code'] == 1000 || resp['status']['code'] == 1011) 
									// 	{                  
									// 		console.log("Still Login");
									// 		//Still Login                  
									// 		admin_info['meta_data']['balance'] = resp['totalAvailableBalance'] ? resp['totalAvailableBalance'] : 0.00;
									// 		SCBModel.updateBankData(admin_info['id'],admin_info['meta_data'],admin_info['meta_data']['balance']);

									// 		if(admin_info['meta_data']['bank_break_enable'] == "true")
									// 		{
									// 			if(admin_info['meta_data']['balance'] >= admin_info['meta_data']['bank_break_credit_check'])
									// 			{
									// 				let bank_break_id = admin_info['meta_data']['bank_break_id'];
									// 				let admin_bank_break = MainModel.query(`
									// 							select *
									// 							from admin_bank
									// 							where status = 1 and id = ${bank_break_id}
									// 				`);
									// 				let tmp_bank_break = [];
									// 				admin_bank_break.forEach(tmp => 
									// 					{
									// 						tmp_bank_break = tmp;
									// 						for (const [key, value] of Object.entries(JSON.parse(tmp['meta_data']))) 
									// 						{
									// 							tmp_bank_break[key] = value;                                                        
									// 						}
									// 						return;
									// 					}
									// 				);

									// 				if(tmp_bank_break)
									// 				{
									// 					let amount 	= (admin_info['meta_data']['bank_break_credit']) && admin_info['meta_data']['bank_break_credit'] != '' ? admin_info['meta_data']['bank_break_credit'] : 0;
									// 					let acc 		= tmp_bank_break['bank_acc_number'];
									// 					let bank_id 	= AdminBankList.getBankInfoByBankID(tmp_bank_break['bank_id'])['scb_id'];

									// 					let resp = await scb_app_lib.TransferAuto(token,admin_info['bank_acc_number'],acc,amount);
									// 					if (resp.status=="success") 
									// 					{                                                    
									// 						returnResult.push(admin_info['bank_acc_number'] + " : พักเงินเรียบร้อย");
									// 						NoticeManage.createAdmin([],"success","พักเงินเรียบร้อย"
									// 						,'พักเงินเข้าบัญชี '+tmp_bank_break['bank_acc_number']+' - '+tmp_bank_break['bank_acc_name']+' จำนวน '+amount
									// 						,'',1
									// 						)

									// 						LogList.create('พักเงินเข้าบัญชี '+tmp_bank_break['bank_acc_number']+' - '+tmp_bank_break['bank_acc_name']+' จำนวน '+amount
									// 						,"SYSTEM",timerHelper.getDateTimeNowString() 
									// 						)
									// 					}
									// 					else
									// 					{
									// 						returnResult.push(admin_info['bank_acc_number'] + " : พักเงินเรียบร้อยไม่สำเร็จ "+resp.message);
									// 					}
									// 				}
													
									// 			}
									// 		}
											
									// 	}
									// 	else
									// 	{
									// 		console.log("New Login");                                        
									// 		token = "";										

									// 		// console.log(admin_info);
									// 		let api_refresh = admin_info['meta_data']['api_refresh']!=''?Cryptof.decryption(admin_info['meta_data']['api_refresh']):'';
									// 		let deviceid  = admin_info['meta_data']['deviceid']!=''?Cryptof.decryption(admin_info['meta_data']['deviceid']):'';
																				
									// 		token = await scb_app_lib.Login2(deviceid,admin_info['meta_data']['password']);
									// 		scbtoken = token;
											
									// 		if (token)
									// 		{                                            
									// 			admin_info['meta_data']['scb_app_token'] = Cryptof.encryption(token);  
												
									// 			resp = await scb_app_lib.Profile(token, admin_info['bank_acc_number']);
									// 			// console.log(resp.data);
									// 			if (resp['status']['code'] == 1000 || resp['status']['code'] == 1011) 
									// 			{
									// 				admin_info['meta_data']['balance'] = resp['totalAvailableBalance'] ? resp['totalAvailableBalance'] : 0.00;
									// 			}                                            
									// 			SCBModel.updateBankData(admin_info['id'],admin_info['meta_data'],admin_info['meta_data']['balance']);												
									// 			console.log(admin_info['bank_acc_number'] + " : Relogin (Balance : $"+ admin_info['meta_data']['balance']  +")");
									// 		}
									// 		else
									// 		{												
									// 			console.log('Login Failed '+ admin_info['bank_acc_number']);
									// 		}
									// 	}
									// }
									// else
									// {										
									// 	console.log('Cannot Login '+ admin_info['bank_acc_number'] +' : '+resp.message);
									// }
									//Login ////


									let amount 	= 5;
									let acc 	= '5234069436';
									const bankInfo = MainModel.getBankInfo(5);
									
									let bank_id = bankInfo['scb_id']?bankInfo['scb_id']:'';

									if (bank_id!='') 
									{                            
										console.log(scbtoken,admin_banks['bank_acc_number'],acc,bank_id,amount);
										scb_app_lib.TransferAuto(scbtoken,admin_banks['bank_acc_number'],acc,bank_id,amount);
										
									}
									
								}    
								else if(admin_info['bank_id']=="1")
								{

									let kPlus =new KPlusClass();
									admin_info['url'] = admin_info['url'] ? Cryptof.decryption(admin_info['url']) : "";       

									let amount 	= withdraw_row['credit'];
									let acc 	= withdraw_row['bank_acc_no'];
									const bankInfo =MainModel.getBankInfo(withdraw_row['bank_id']);
									let bank_id = bankInfo['kbank_id']?bankInfo['kbank_id']:'';
									
									if (bank_id!='') 
									{
										let bank_code = bank_id.toString().padStart(3, "0");
										let response = kPlus.KbankTransferAuto(admin_info['meta_data']['url'] , bank_code ,acc,amount );
										if(response['status'] == "success")
										{
										

										}
									}
								}
								else
								{

								}
							}
						}


					}

        } catch (error) {
            console.log(error);
        }
    }

	async test2()
	{
		let admin_banks = AdminBankList.findAllActive("");
		for (let index = 0; index < admin_banks.length; index++) {
			const element = admin_banks[index];                                
			for(const [key,value] of Object.entries(JSON.parse(element.meta_data)))
			{
				admin_banks[index][key] = value;
			}                                
		}

		let admin_info = [];
		for (let index = 0; index < admin_banks.length; index++) {
			const element = admin_banks[index];
			if (element['work_type']=="NODE" || element['work_type']=="IBK") 
			{
				admin_info = element;
				break;
			}
		}

		if (admin_info['bank_id']==5) 
		{
			const scb_app_lib = new Scb_app_lib();                                
			let scbtoken = admin_info['scb_app_token'] ? Cryptof.decryption(admin_info['scb_app_token']) : "";
			const bankInfo = MainModel.getBankInfo(5);
			let bank_code = bankInfo['scb_id']?bankInfo['scb_id']:'';
			console.log(scbtoken,admin_info['bank_acc_number'],"5234069436",bank_code);
			let tmpData = await scb_app_lib.GetName(scbtoken,admin_info['bank_acc_number'],"5234069436",bank_code);

			if(tmpData['status'] == 'success')
			{													
				let fullname = tmpData['data']['fullname'] ? tmpData['data']['fullname'] : '';
				
				console.log(fullname);
			}
			else
			{
				console.log("can't get fullname");
			}
		}
	}
    

}

module.exports = TestTest;