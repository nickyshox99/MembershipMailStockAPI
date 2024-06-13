const axios = require('axios');

class LineModel {
    constructor() {
        this.token = null;
        this.message = null;
        this.response = null;
        this.stickerPackageId = null;
        this.stickerId = null;
        this.img = null;
        this.api = 'https://notify-api.line.me/api/notify';
    }

    setToken(token) {
        this.token = token;
    }

    setError(response) {
        this.response = {
            status: response.status,
            message: response.message
        };
    }

    setMsg(msg) {
        this.message = `\n${msg}`;
    }

    setSPId(spid) {
        this.stickerPackageId = spid;
    }

    setSId(sid) {
        this.stickerId = sid;
    }

    isImg(img) {
        // You can use axios to make a HEAD request to check the image headers
        return axios.head(img)
            .then(response => response.headers['content-type'].startsWith('image'))
            .catch(() => false);
    }

    setImg(img) {
        if (this.isImg(img)) {
            this.img = img;
        }
    }

    clearData()
    {
        this.message = null;
        this.response = null;
        this.stickerPackageId = null;
        this.stickerId = null;
        this.img = null;
    }

    addMsg(msg) {
        this.message += `\n${msg}`;
    }

    getError() {
        return this.response;
    }

    getData() {

        if (this.img!=null) 
        {
            return {                
                imageThumbnail: this.img,
                imageFullsize: this.img
            };
        }
        if (this.stickerId!=null) 
        {
            return {
                
                stickerPackageId: this.stickerPackageId,
                stickerId: this.stickerId,
                
            };
        }
        else
        {
            return {
                message: this.message,                
            };
        }
        
    }

    getHeader() {
        
        if (this.img!=null) 
        {
            const header = {
                "Authorization" : "Bearer "+ this.token,                
                "Content-type" : "multipart/form-data",
            };

            return header;
        }
        else
        {
            const header = {
                "Authorization" : "Bearer "+ this.token,                                
                "Content-type" : "application/x-www-form-urlencoded",
            };

            return header;

        }
        
    }

    async sendNotify() {
        
        const data = this.getData();
        const headers = this.getHeader();
       
        return axios.post(this.api, data, 
            { 
                headers : headers 
            }
        )
        .then(response => response.data)
        .catch(error => {
            return error.response ? error.response.data : error.message;
        });

    }
    

    async sendMessageNotify(line_token, msgformat) {

        this.token = line_token;
        
        const data = msgformat;
        const headers = this.getHeader();
       
        return axios.post(this.api, data, 
            { 
                headers : headers 
            }
        )
        .then(response => response.data)
        .catch(error => {
            return error.response ? error.response.data : error.message;
        });

    }
}

module.exports = LineModel;