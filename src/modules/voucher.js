const https = require('https');
const axios = require('axios');

axios.defaults.httpsAgent = new https.Agent({  
    ciphers: 'ALL',
    secureProtocol: 'TLSv1_2_method'
  });

class Voucher {
  
    constructor() {        
        this.mobile ="";
        this.voucher ="";
        this.voucher_hash ="";
        this.USER_AGENT = 'Chrome/{Chrome Rev} Mobile Safari/{WebKit Rev}'; 
    }

    async setconfig(mobile, voucher)
    {
        this.mobile = mobile.trim();
        const splitVoucher = voucher.split("?v=");
        this.voucher = splitVoucher[1];
        this.voucher_hash = splitVoucher[1];
        
    }
    
    async getvoucher()
    {
        return this.voucher;
    }

    async verify()
    {
        try 
        {
            let url = `https://gift.truemoney.com/campaign/vouchers/${this.voucher}/verify?mobile=${this.mobile}`;
            let headers = {
                "Content-Type" : "application/json",
                "User-Agent" : this.USER_AGENT
            };

            const response = await axios.get(url
                , 
                { headers }
                );
            return response.data;
        } catch (error) {
            return error;
        }
        
    }

    async redeem()
    {
        try 
        {
            let url = `https://gift.truemoney.com/campaign/vouchers/${this.voucher}/redeem`;
            let headers = {
                "Content-Type" : "application/json",
                "User-Agent" : this.USER_AGENT
            };

            let data = {
                'mobile' : this.mobile,
                'voucher_hash' : this.voucher_hash
            }

            const response = await axios.post(url,data
                , 
                { headers }
                );
            return response.data;
        } catch (error) {
            return error;
        }
        
    }

    async redeem2()
    {
        try 
        {
            let url = `https://gift.truemoney.com/campaign/vouchers/${this.voucher}/verify?mobile=${this.mobile}`;

            let headers = {
                "Content-Type" : "application/json",
                "User-Agent" : this.USER_AGENT
            };

            let response = await axios.get(url
                , 
                { headers }
            );

            let data = {
                'mobile' : this.mobile,
                'voucher_hash' : this.voucher_hash
            }

            response = await axios.post(url,data
                , 
                { headers }
                );
            
        } catch (error) {
            return error;
        }
    }

}

module.exports = Voucher;