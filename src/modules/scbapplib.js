
const axios = require('axios');

class Scb_app_lib {
  
    constructor() {        
        this.api_url = "https://fasteasy.scbeasy.com:8443";
		this.encrypt = "https://elizaencrypt.online/pin/encrypt";		
        
        // this.useragent = "Android/10;FastEasy/3.66.2/6960";                
        // this.tilesVersion = "6";
        
        // this.useragent = "Android/10;FastEasy/3.53.0/5618";        
        // this.tilesVersion = "41";

        // this.useragent = "Android/11;FastEasy/3.63.0/6637";        
        // this.tilesVersion = "39";

        // this.useragent = "Android/11;FastEasy/3.68.1/7148";                
        // this.tilesVersion = "69";

        this.useragent = "Android/11;FastEasy/3.68.1/7148";                
        this.tilesVersion = "70";
                
        this.pin = "";
        this.deviceId = "";

        
    }

    async TransferAuto(token, accountFrom, acc, bank_id, amount) 
    {
        try {
            // ...
            let api_data;
            if (bank_id == 0) {
                bank_id = "014";
            }

            if (bank_id != "014" && bank_id != "0") {
                // ORFT
                api_data = {
                    accountFrom: accountFrom,
                    accountTo: acc,
                    accountToBankCode: bank_id,
                    amount: amount,
                    transferType: "ORFT",
                    annotation: "",
                    accountFromType: 2,
                };
            } else {
                // 3RD
                api_data = {
                    accountFrom: accountFrom,
                    accountTo: acc,
                    accountToBankCode: bank_id,
                    amount: amount,
                    transferType: "3RD",
                    annotation: "",
                    accountFromType: 2,
                };
            }

            let d = [];

            let resp = await this.Transfer(token, api_data);
                        
            if(resp['status']['code'])
            {
                if(resp['status']['code']==1000)
                {
                    
                    let data = {
                        "accountFrom" 			: api_data["accountFrom"],
                        "accountFromName" 		: resp['data']['accountFromName'],
                        "accountFromType" 		: api_data["accountFromType"],
                        "accountTo" 			: resp['data']['accountTo'],
                        "accountToBankCode" 	: resp['data']['accountToBankCode'],
                        "accountToName" 		: resp['data']['accountToName'],
                        "amount"				: api_data["amount"],
                        "botFee" 				: resp['data']['botFee'],
                        "channelFee" 			: resp['data']['channelFee'],
                        "fee" 					: resp['data']['totalFee'],
                        "feeType" 				: resp['data']['feeType'],
                        "pccTraceNo" 			: resp['data']['pccTraceNo'],
                        "scbFee" 				: resp['data']['scbFee'],
                        "sequence" 				: resp['data']['sequence'],
                        "terminalNo" 			: resp['data']['terminalNo'],
                        "transactionToken" 		: resp['data']['transactionToken'],
                        "transferType" 			: resp['data']['transferType'],
                    };

                    resp = await this.ConfirmTransfer(token, data);

                    if(resp['status']['code']){
                        if(resp['status']['code']==1000){						
                            d = {
                                "status" 		: "success",
                                "message" 		: "โอนเงินเรียบร้อย",
                            };

                        }else{
                            d = {
                                "status" 		: "error",
                                "message" 		: resp['status']['description'],
                            };
                        }
                    }else{
                        d = {
                            "status" 		: "error",
                            "message" 		: resp['status']['description'],
                        };
                    }
                }
                else
                {
                    d = {
                        "status" 		: "error",
                        "message" 		: resp['status']['description'],
                    };
                }
            }
            else
            {
                d = {
                    "status" 		: "error",
                    "message" 		: resp['status']['description'],
                };
            }

            return d;
        } catch (error) {
            console.log(error.message)
            let d = {
				'status' : 'error',
				'message' : error.message
            };
            return d;
        }
        
            
    }

    async GetName(token, accountFrom, bank_acc_no, bank_id) 
    {
        try {
            // ...
            let api_data;
            if (bank_id == 0) {
            bank_id = "014";
            }

            if (bank_id != "014" && bank_id != "0") {
            // ORFT
            api_data = {
                accountFrom: accountFrom,
                accountTo: bank_acc_no,
                accountToBankCode: bank_id,
                amount: 1,
                transferType: "ORFT",
                annotation: "",
                accountFromType: 2,
            };
            } else {
            // 3RD
            api_data = {
                accountFrom: accountFrom,
                accountTo: bank_acc_no,
                accountToBankCode: bank_id,
                amount: 1,
                transferType: "3RD",
                annotation: "",
                accountFromType: 2,
            };
            }

            let d = [];
            let fullname ="";
            let fname ="";
            let lname ="";
            let get_name = false;

            let resp = await this.Transfer(token, api_data);
            console.log("getname");
            // console.log(resp.data);
            if(resp['status']['code'])
            {
                if(resp['status']['code']==1000)
                {
                    fullname = resp['data']['accountToName'] ? resp['data']['accountToName'] : null;
                    let tmp = fullname.split(" ");

                    if(tmp.lenght == 2){				
                        fname = (tmp[0]) ? tmp[0] : "";
                        lname = (tmp[1]) ? tmp[1] : "";
                    }else if(tmp.lenght == 3){
                        fname = (tmp[0]) && (tmp[1]) ? tmp[0]+" "+tmp[1] : "";
                        lname = (tmp[2]) ? tmp[2] : "";
                    }else{
                        fname = fullname;
                        lname = "";
                    }				
                    get_name = true;
                }
            }

            if(get_name)
            {
                d = {
                    'status' : 'success',
                    'message' : 'ok',
                    'data'	: {
                        'fname' 	: fname,
                        'lname'		: lname,
                        'fullname'	: fullname
                    }
                };
            }
            else
            {
                d = {
                    'status' : 'success',
                    'message' : 'ไม่สามารถดึงชื่อได้'+ resp['status']['description'] ? resp['status']['description'] : "",
                };
            }
            
            return d;
        
        } catch (error) {
            console.log(error.message)
            let d = {
				'status' : 'error',
				'message' : error.message
            };
            return d;
        }
    }

    async Login(api_refresh, deviceId)
    {
        try {
            let header = {
                "Api-Refresh":api_refresh,			
            };
            
            let data = {
                "deviceId" : deviceId,
            };
    
            let url = this.api_url+"/v1/login/refresh";		
            let res = await this.Curl("POST", url, header, data, false);
            
            return res;
        } catch (error) {
            console.log(error.message);
            return "";
        }
        
    }

    async Login2(deviceId, pin)
    {
        try {
            this.pin = pin;
            this.deviceId = deviceId;

            // console.log(pin);
            // console.log(deviceId);
            // return;

            let header = {
                'Accept-Language':'th',
                'scb-channel': 'APP',
                'User-Agent': this.useragent,
                'Content-Type': 'application/json; charset=UTF-8',
                'Host': 'fasteasy.scbeasy.com:8443',
                // 'Connection': 'Keep-Alive',
                'Connection': 'close',                
                // 'Accept-Encoding': 'gzip',
            };

            let data = {
                "tilesVersion" : this.tilesVersion,
                "userMode" : "INDIVIDUAL",
                // "isLoadGeneralConsent" : "1",
                "isLoadGeneralConsent" : "0",
                "deviceId" : this.deviceId,
                "jailbreak" : "0"
            };

            let url = this.api_url+ "/v3/login/preloadandresumecheck";
            let resp = await this.Curl2("POST",url,data,header);

            console.log("Login2");       
            // console.log(resp.headers['api-auth']);
            // console.log(resp.headers);
            // console.log(resp.data);
            
            // let jsonString= JSON.stringify(resp.headers);
            // let jsonString2= JSON.stringify(resp.data);            

            // const regex = /(?<=Api-Auth: ).+/;
            // let Auth3 = jsonString.match(regex);
            // let Auth2 = jsonString2.match(regex);
            // let Auth= resp.match('/(?<=Api-Auth: ).+/');
            
            let Auth = "";
            
            if(resp.headers['api-auth'])
            {
                Auth = resp.headers['api-auth'];
            }           
            else
            {
                return '';
            }
                
            header = {
                'Accept-Language':'th',
                'scb-channel': 'APP',
                'User-Agent': this.useragent,
                'Content-Type': 'application/json; charset=UTF-8',
                'Host': 'fasteasy.scbeasy.com:8443',
                'Accept-Encoding': 'gzip',
                'Api-Auth': Auth,				
            };

            data = {
                "loginModuleId" : "PseudoFE"
            };

            url = this.api_url+ "/isprint/soap/preAuth";
            resp = await this.Curl2("POST",url,data,header);

            // console.log(resp.data);
            // return;

            let getData = resp.data;                      
            let pseudoOaepHashAlgo = getData['e2ee']['pseudoOaepHashAlgo'];
            let pseudoSid = getData['e2ee']['pseudoSid'];
            let pseudoRandom = getData['e2ee']['pseudoRandom'];
            let pseudoPubKey = getData['e2ee']['pseudoPubKey'];

            header = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };

            data = "Sid=" + pseudoSid + "&ServerRandom=" + pseudoRandom + "&pubKey=" +pseudoPubKey + "&pin=" + this.pin + "&hashType=" + pseudoOaepHashAlgo;
            url = this.encrypt;
            let pseudoPin = await this.Curl2("POST",url,data,header);
            // console.log("pseudoPin");
            // console.log(pseudoPin.data);

            header = {
                'Accept-Language':'th',
                'scb-channel': 'APP',
                'User-Agent': this.useragent,
                'Content-Type': 'application/json; charset=UTF-8',
                'Host': 'fasteasy.scbeasy.com:8443',
                'Accept-Encoding': 'gzip',
                'Api-Auth': Auth,				
            };

            data = {
                "pseudoPin" : pseudoPin.data,
                "tilesVersion" : this.tilesVersion,
                "pseudoSid" : pseudoSid,
                "deviceId" : this.deviceId
            };

            url = this.api_url+ "/v1/fasteasy-login";
            resp = await this.Curl2("POST",url,data,header);

            console.log("fasteasy-login");
            // console.log(resp.headers);
            // console.log(resp.data);

            // jsonString= JSON.stringify(resp.headers);
            // jsonString2= JSON.stringify(resp.data); 

            // Auth3 = jsonString.match(regex);
            // Auth2 = jsonString2.match(regex);

            // Auth= resp.match('/(?<=Api-Auth: ).+/');
            // Auth = Auth[0];

            if(resp.headers['Api-Auth'])
            {
                Auth = resp.headers['Api-Auth'];
            }           
            else if(resp.headers['api-auth'])
            {
                Auth = resp.headers['api-auth'];
            }
            else
            {
                return '';
            }
            console.log("Login token : "+Auth);
            return Auth;

        } catch (error) {
            console.log(error.message);
            return "";
        }

        

    }

    async Transaction(token,data)
    {
        try {
            let header = {
                "Accept-Language":"th",
                "scb-channel":"APP",
                "Api-Auth" : token,
                "user-agent" : this.useragent,
                "Content-Type": "application/json; charset=UTF-8",
                "Host" : "fasteasy.scbeasy.com:8443",
            };
            
            let url = this.api_url+"/v2/deposits/casa/transactions";		
            let res = await this.Curl("POST", url, header, data, false);
            
            return res.data;
        } catch (error) {
            console.log(error.message);
            return {
                status : 'error',
                message : error.message
            };
        }
       
    }

    async Transfer(token,data)
    {
        try {
            let header = {
                "Accept-Language":"th",
                "scb-channel":"APP",
                "Api-Auth" : token,
                "user-agent" : this.useragent,
                "Content-Type": "application/json; charset=UTF-8",
                "Host" : "fasteasy.scbeasy.com:8443",
            };
            
            let url = this.api_url+"/v2/transfer/verification";		
            let res = await this.Curl("POST", url, header, data, false);
            // console.log(res.data);
            
            return res.data;
        } catch (error) {
            console.log(error.message);
            return {
                status : 'error',
                message : error.message
            };
        }
       
    }

    async ConfirmTransfer(token,data)
    {
        try {
            let header = {
                "Accept-Language":"th",
                "scb-channel":"APP",
                "Api-Auth" : token,
                "user-agent" : this.useragent,
                "Content-Type": "application/json; charset=UTF-8",
                "Host" : "fasteasy.scbeasy.com:8443",
            };
            
            let url = this.api_url+"/v3/transfer/confirmation";		
            let res = await this.Curl("POST", url, header, data, false);
            
            return res.data;
        } catch (error) {
            console.log(error.message);
            return {
                status : 'error',
                message : error.message
            };
        }
        
    }
    
    async TransferAutoTrueWallet(token,accountFrom,toMobileNo,amount)
    {
        try {

            let header = {
                "Accept-Language":"th",
                "scb-channel":"APP",
                "Api-Auth" : token,
                "user-agent" : this.useragent,
                "Content-Type": "application/json; charset=UTF-8",
                "Host" : "fasteasy.scbeasy.com:8443",
            };

            data = {
                "annotation": null,
                "billerId": 8,
                "depAcctIdFrom": accountFrom,
                "note": "TOPUP",
                "pmtAmt": amount,
                "serviceNumber": toMobileNo,
            }
            
            let url = this.api_url+"/v2/topup/billers/8/additionalinfo'";		
            let res = await this.Curl("POST", url, header, data, false);            
            let resp = [];

            if (res.data) {
                resp = res.data;
            }
            else
            {
                return {
                    status : 'error',
                    message : 'No Response Data',
                };
            }

            if(resp['status']['code'])
            {                
                if(resp['status']['code']==1000)
                {
                    
                    let data = {                        
                        "billRef1" 		: resp['data']['refNo1'],
                        "billRef2" 		: resp['data']['refNo2'],
                        "billRef3" 		: resp['data']['refNo3'],
                        "billerId"      : "8",
                        "depAcctIdFrom" : accountFrom,
                        "feeAmt"        : 0.0,
                        'misc1'         : '',
                        'misc2'         : '',
                        "mobileNumber"	: resp['data']['refNo1'],
                        'note'          : '',
                        'pmtAmt'        : amount,
                        'serviceNumber' : resp['data']['refNo1'],
                        'transactionToken' : resp['data']['transactionToken'],
                    };

                    resp = await this.ConfirmTransferTrueWallet(token, data);

                    if(resp['status']['code']){
                        if(resp['status']['code']==1000){						
                            d = {
                                "status" 		: "success",
                                "message" 		: "โอนเงินเรียบร้อย",
                            };

                        }else{
                            d = {
                                "status" 		: "error",
                                "message" 		: resp['status']['description'],
                            };
                        }
                    }else{
                        d = {
                            "status" 		: "error",
                            "message" 		: resp['status']['description'],
                        };
                    }
                }
                else
                {
                    d = {
                        "status" 		: "error",
                        "message" 		: resp['status']['description'],
                    };
                }
            }
            else
            {
                d = {
                    "status" 		: "error",
                    "message" 		: resp['status']['description'],
                };
            }

            return d;
                        
        } catch (error) {
            console.log(error.message);
            return {
                status : 'error',
                message : error.message
            };
        }
       
    }

    async ConfirmTransferTrueWallet(token,data)
    {
        try {
            let header = {
                "Accept-Language":"th",
                "scb-channel":"APP",
                "Api-Auth" : token,
                "user-agent" : this.useragent,
                "Content-Type": "application/json; charset=UTF-8",
                "Host" : "fasteasy.scbeasy.com:8443",
            };
            
            let url = this.api_url+"/v2/topup";		
            let res = await this.Curl("POST", url, header, data, false);
            
            return res.data;
        } catch (error) {
            console.log(error.message);
            return {
                status : 'error',
                message : error.message
            };
        }
        
    }

    async Profile(token,accountNo)
    {
        // console.log(token);
        // console.log(accountNo);
        try {            

            let header = {
                "Accept-Language":"th",
                "scb-channel":"APP",
                "Api-Auth" : token,
                "user-agent" : this.useragent,
                "Content-Type": "application/json; charset=UTF-8",
                "Host" : "fasteasy.scbeasy.com:8443",
            };
    
            const data = {
                depositList: [
                    {
                        accountNo: accountNo
                    }
                ],
                latestTransactionFlag: false,
                numberRecentTxn: 2,
                tilesVersion: this.tilesVersion
            };
            
            let url = this.api_url+"/v2/deposits/summary";		
            let res = await this.Curl("POST", url, header, data, false);
            console.log("Get Profile");
            // console.log(header);
            // console.log(data);
            // console.log(res.data);
            return res.data;
        } catch (error) {
            console.log(error.message);
            return {
                status : 'error',
                message : error.message
            };
        }
        
    }

    async Curl(method, url, header, data, cookie) {
        try {
            header['User-Agent']='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36';
            const response = await axios({
                method: method,
                url: url,
                headers: header,
                data: data,                
          });
          return response;
        } catch (error) {
          console.log(error);
            return {
                status : 'error',
                message : error.message
            };
        }
    }

    async Curl2(method, url, data, header = [], check_header = false) {
        try {
          const response = await axios({
            method: method,
            url: url,
            headers: header,
            data: data,            
          });          
          return response;
        } catch (error) {
            console.log(error);
            return {
                status : 'error',
                message : error.message
            };
        }
    }


}

module.exports = Scb_app_lib;