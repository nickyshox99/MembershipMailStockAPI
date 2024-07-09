const fs = require("fs");
const path = require("path");
const axios = require("axios");
const Secret = require("../../config/secret");

const OffsetTime = require("../../config/offsettime");

const offsetTime = OffsetTime.offsetTime;
const offsetTime24hrs = OffsetTime.offsetTime24hrs;

class LineChatAPI {
    constructor() {
        this.channelToken = null;        
        this.api = 'https://api.line.me/v2/';
        this.apiData = 'https://api-data.line.me/v2/';
        
    }

    setToken(inChannelToken) {
        this.channelToken = inChannelToken;
    }

    async getBotProfile() {
        try {
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.channelToken}`,
        };
        
        const url = `${this.api}bot/info/`;
    
        const res = await axios.get(url, {
            headers: headers,
        });
    
        return res.data;
        } catch (error) {   
            console.log(error.message);                   
            return {error: error.message};
        }
    }

    async getProfile(userId) {
            try {
            let headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.channelToken}`,
            };
            
            const url = `${this.api}bot/profile/${userId}`;
        
            const res = await axios.get(url, {
                headers: headers,
            });
        
            return res.data;
            } catch (error) {     
                console.log(error.message);     
                return {error: error.message};
            }
    }

    async getBotFollower() {
        try {
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.channelToken}`,
        };
        
        const url = `${this.api}bot/followers/ids`;
    
        const res = await axios.get(url, {
            headers: headers,
        });
    
        return res.data;
        } catch (error) {          
            console.log(error.message);
            return {error: error.message};
        }
    }

    async pushMessage(toUser,message) {
        try {

            let body = {
                to : toUser,
                messages : [
                    {
                        "type":"text",
                        "text": message,
                    },
                ],
            };

            let headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.channelToken}`,
            };
            
            const url = `${this.api}bot/message/push`;
        
            const res = await axios.post(url,body ,{
                headers: headers,
            });
    
            return res.data;
        } catch (error) {          
            console.log(error.message);
            return {error: error.message};
        }
    }

    async replyMessage(replyToken,message) {
        try {

            let body = {
                replyToken : replyToken,
                messages : [
                    {
                        "type":"text",
                        "text": message,
                    },
                ],
            };

            let headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.channelToken}`,
            };
            
            const url = `${this.api}bot/message/reply`;
        
            const res = await axios.post(url,body ,{
                headers: headers,
            });
    
            return res.data;
        } catch (error) {          
            console.log(error.message);
            return {error: error.message};
        }
    }

    async pushSticker(toUser,packageId,stickerId) {
        try {

            let body = {
                to : toUser,
                messages : [
                    {
                        "type":"sticker",
                        "packageId":packageId.toString(),
                        "stickerId":stickerId.toString(),
                    },                   
                ],
            };

            

            let headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.channelToken}`,
            };
            
            const url = `${this.api}bot/message/push`;
        
            const res = await axios.post(url,body ,{
                headers: headers,
            });
    
            return res.data;
        } catch (error) {          
            console.log(error.message);
            return {error: error.message};
        }
    }

    async pushImage(toUser,originalContentUrl,previewImageUrl) {
        try {

            let body = {
                to : toUser,
                messages : [
                    {
                        "type":"image",
                        "originalContentUrl":originalContentUrl,
                        "previewImageUrl":previewImageUrl,
                    },                   
                ],
            };

            

            let headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.channelToken}`,
            };
            
            const url = `${this.api}bot/message/push`;
        
            const res = await axios.post(url,body ,{
                headers: headers,
            });
    
            return res.data;
        } catch (error) {          
            console.log(error.message);
            return {error: error.message};
        }
    }

    async pushVideo(toUser,originalContentUrl,previewImageUrl) {
        try {

            let cTime = new Date();
            cTime = new Date(cTime.getTime() + offsetTime);

            let trackingId = cTime.getFullYear().toString()+'-'+cTime.getMonth().toString()+'-'+cTime.getDate().toString()+'-'+cTime.getHours().toString()+'-'+cTime.getHours().toString()+'-'+cTime.getMinutes().toString()+'-'+cTime.getSeconds().toString()+toUser;
            let body = {
                to : toUser,
                messages : [
                    {
                        "type":"video",
                        "originalContentUrl":originalContentUrl,
                        "previewImageUrl":previewImageUrl,
                        "trackingId": trackingId ,
                    },                   
                ],
            };

            let headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.channelToken}`,
            };
            
            const url = `${this.api}bot/message/push`;
        
            const res = await axios.post(url,body ,{
                headers: headers,
            });
    
            return res.data;
        } catch (error) {          
            console.log(error.message);
            return {error: error.message};
        }
    }
    
    async getContent(contentId) {
        try {
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.channelToken}`,
            };
            
            const url = `${this.apiData}bot/message/${contentId}/content`;
        
            const response = await axios({
                method: 'get',
                url,
                headers,
                responseType: 'stream', // Stream the response data
            });

            const contentType = response.headers['content-type'];
            let extension = '.jpg'; // Default extension
            
            // Determine the file extension based on content type
            if (contentType.includes('image/jpeg')) {
                extension = '.jpg';
            } else if (contentType.includes('image/png')) {
                extension = '.png';
            } else if (contentType.includes('text/plain')) {
                extension = '.txt';
            } else if (contentType.includes('application/pdf')) {
                extension = '.pdf';
            } else if (contentType.includes('video/mp4')) {
                extension = '.mp4';
            } else {                
                return { error: "Unsupported content type "+contentType };
            }

            // Specify the file path and name for the image
            const imagePath = path.join(__dirname, '..', '..', 'assets', `line_${contentId}${extension}`);

            if (fs.existsSync(imagePath)) {
                return imagePath;
            } else {
                // Create a writable stream to write the image data to the file
                const writer = fs.createWriteStream(imagePath);
                            
                // Pipe the response data directly to the file stream
                response.data.pipe(writer);

                // Return a promise to indicate when the file write is complete
                return new Promise((resolve, reject) => {
                    writer.on('finish', () => {
                        //console.log("Image saved successfully");
                        resolve(imagePath);
                    });
                    writer.on('error', (err) => {
                        reject(err);
                    });
                });
            }
        } catch (error) {
            console.log(error.message);
            return { error: error.message };
        }
    }


    async getContent2(contentId) {
        try {
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.channelToken}`,
            };
                        
            const url = `${this.apiData}bot/message/${contentId}/content`;
                    
            const response = await axios({
                method: 'get',
                url,
                headers,
                responseType: 'stream', // Stream the response data
            });

            const contentType = response.headers['content-type'];
            let extension = '.jpg'; // Default extension
            
            // Determine the file extension based on content type
            if (contentType.includes('image/jpeg')) {
                extension = '.jpg';
            } else if (contentType.includes('image/png')) {
                extension = '.png';
            } else if (contentType.includes('text/plain')) {
                extension = '.txt';
            } else if (contentType.includes('application/pdf')) {
                extension = '.pdf';
            } else if (contentType.includes('video/mp4')) {
                extension = '.mp4';
            } else {                
                return { error: "Unsupported content type "+contentType };
            }

            // Specify the file path and name for the image
            const imagePath = path.join(__dirname, '..', '..', 'assets', `line_${contentId}${extension}`);
            const contentUrl = Secret.apiDomain+'getfile/'+ `line_${contentId}${extension}`;

            if (fs.existsSync(imagePath)) 
            {
                return {                     
                    imagePath : imagePath,
                    contentUrl: contentUrl,
                    newData : null ,
                    newFileName: null,
                };
            }
            else
            {
                // return {                  
                //     newData : response.data ,
                //     imagePath : imagePath,
                // };

                // Create a writable stream to write the image data to the file
                const writer = fs.createWriteStream(imagePath);
                            
                // Initialize an array to accumulate the binary data chunks
                let chunks = [];

                // Listen for 'data' events to accumulate binary data
                response.data.on('data', (chunk) => {
                    chunks.push(chunk);
                });

                // Pipe the response data directly to the file stream
                response.data.pipe(writer);

                // Return a promise to indicate when the file write is complete
                return new Promise((resolve, reject) => {
                    writer.on('finish', () => {
                        //console.log("Image saved successfully");
                        const newData = Buffer.concat(chunks); // Combine all chunks into a single buffer
                        resolve(
                            {                                 
                                imagePath : imagePath,
                                contentUrl: contentUrl,
                                newData : newData ,
                                newFileName: `line_${contentId}${extension}`,
                            }
                        );
                    });
                    writer.on('error', (err) => {
                        reject(err);
                    });
                });
            }
            
            

        } catch (error) {                             
            console.log(error.message);
            return {error: error.message}; 
        }
    }
    
    
    
}

module.exports = LineChatAPI;