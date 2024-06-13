const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class KBiz_lib {
    constructor() {
        this.kbizusername = '';
        this.kbizpassword = '';
        this.endpoint = '';
    }

    async getTransactions() {
        try {
            let header = {        
                'Content-Type': 'application/json',
            };
            
            let data = {     
                username : this.kbizusername,
                password : this.kbizpassword,
            };

            const options = {
                headers: header,
            };
    
            let url = `${this.endpoint}/api/transaction`;		
            console.log(url,data);
            
            //let queryStr = querystring.stringify(body);
            const response = await axios.post(url, data, options);
            
            //console.log(response.data);
            return response.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

   
}


module.exports = KBiz_lib;