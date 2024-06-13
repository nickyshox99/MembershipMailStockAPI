const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class Kplus_lib_202204 {
    constructor() {
        this.endpoint = '';
    }

    async getBalance() {
        try {                        
            console.log("getBalance");
            
            let header = {                
            };
            
            let data = {                
            };
    
            let url = `${this.endpoint}/balance`;		
            let response = await this.Curl("GET", url, header, data, false);
            // const response = await axios.get(`${this.endpoint}/balance`);     
            // console.log(response.data);
            return response;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async getTransactions() {
        try {
            let header = {                
            };
            
            let data = {                
            };
    
            let url = `${this.endpoint}/activities`;		
            let response = await this.Curl("GET", url, header, data, false);
            // const response = await axios.get(`${this.endpoint}/activities`);
            return response;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async getTransactions2(startDate,endDate,selectPage,nextPageId) {
        try {
            let header = {     

            };
            
            var data = {
                startdate: startDate,
                enddate: endDate,                
                page: selectPage,     
                nextpageid: nextPageId,                   
            }
    
            let url = `${this.endpoint}/activities2`;	
                        
            let response = await this.Curl("POST", url, header, data, false);            
            return response;
        } catch (error) {
            console.log(error.message);
            return [];
        }
    }

    async getTransactionDetail(rqUid) {
        try {
            let header = {                
            };
            
            let data = {                
            };
    
            let url = `${this.endpoint}/activity-detail/${rqUid}`;		
            let response = await this.Curl("GET", url, header, data, false);
            // const response = await axios.get(`${this.endpoint}/activity-detail/${rqUid}`);
            return response;
        } catch (error) {
            console.log(error);
            return [];            
            
        }
    }

    async transferVerify(toBankCode, toAccount, amount) {
        try {
            let header = {                
            };
            
            let data = {
                toBankCode,
                toAccount,
                amount
            };
    
            let url = `${this.endpoint}/inquire-for-transfer-money/`;		            
            let response = await this.Curl("POST", url, header, data, false);
            // const response = await axios.post(`${this.endpoint}/inquire-for-transfer-money/`, {
            //     toBankCode,
            //     toAccount,
            //     amount
            // });
            return response;
        } catch (error) {
            console.log(error);
            return { status: false, msg: error };
        }
    }

    async transferConfrim(kbankInternalSessionId) {
        try {
            let header = {                
            };
            
            let data = {
               
            };
    
            let url = `${this.endpoint}/transfer-money/${kbankInternalSessionId}`;		            
            let response = await this.Curl("POST", url, header, data, false);
            // const response = await axios.post(`${this.endpoint}/transfer-money/${kbankInternalSessionId}`);
            return response;
        } catch (error) {
            console.log(error);
            return { status: false, msg: error };
        }
    }

    async GetNumberOtherBank(res) {
        try {
            let activityList = res.activityList;
            for (let i = 0; i < activityList.length; i++) {                
                activityList[i].detail = await this.getTransactionDetail(activityList[i].rqUid);
            }
            return activityList;
        } catch (error) {
            console.log(error);
            return { status: false, msg: error };
        }
    }

    async KbankTransferAuto(url, to_bank_id, to_acc_no,amount)
    {
        try {
            this.endpoint = url;
            let res = await this.transferVerify(to_bank_id,to_acc_no,amount);
            
            if (res['errors'])
            {
                let d = {
                    'status' : 'error',
                    'message' : res['errors']['msg']
                };
                return d;
            }

            if (res['kbankInternalSessionId']) 
            {
                res = await this.transferConfrim(res['kbankInternalSessionId']);                       
                if (res['freeText']) {
                    if (res['freeText']=='Success') 
                    {
                        let d = {
                            'status' : 'success',
                            'message' : "",
                        };
                        return d;
                    }	
                    else 
                    {
                        // console.log(res);
                        let d = {
                            'status' : 'error',
                            'message' : "ไม่สามารถโอนได้ "+res['freeText'],
                        };
                        return d;
                    }
                }
                else 
                {
                    let d = {
                        'status' : 'error',
                        'message' : "ไม่สามารถโอนได้ "+ JSON.stringify(res),
                    };
                    return d;
                }

            }
            else {
                let d = {
                    'status' : 'error',
                    'message' : "ไม่สามารถโอนได้ " +JSON.stringify(res),
                };
                return d;
            }
        } catch (error) {
            console.log(error);
            let d = {
                'status' : 'error',
                'message' : error.message,
            };
            return d;
        }
        
    }

    async QR(filepath) {    
        try {
            const formData = new FormData();
            formData.append('image', fs.createReadStream(filepath));    
            const response = await axios.post('http://' + this.endpoint + '/scan-qrcode', formData, {
            headers: formData.getHeaders()
            });
            return response.data;
        } catch (error) {
            console.log(error);
            return { status: false, msg: error };
        }
    }

    async QRBase64(filestreamBase64) {
        try {
          const image = fs.readFileSync(filestreamBase64, 'base64');
      
          const response = await axios.post('http://' + this.endpoint + '/scan-qrcode', {
            image: image
          });
      
          return response.data;
        } catch (error) {
        console.log(error);
          return { status: false, msg: error.response.data };
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


        //   console.log({
        //     method: method,
        //     url: url,
        //     headers: header,
        //     data: data,                
        //     });
        // console.log(response);

          return response.data;
        } catch (error) {
            // console.log(error);
            return {
                status : 'error',
                message : error.message,
                data : [],
            };
        }
    }
}


module.exports = Kplus_lib_202204;