'use strict';

var dbConn = require('../../config/db.config');
const Secret = require('../../config/secret');

const axios = require("axios");
const base64 = require('base64-js');
const querystring = require('querystring');

var LineManage = function() 
{
    
};

LineManage.sendNotify = async function(token,msg,result){    

    console.log("sendNotify");
    // console.log(token,msg);

    try {
        const api = "https://notify-api.line.me/api/notify";

        const header = {
            "Authorization" : "Bearer "+ token,
            "Cache-Control" : "no-cache",
            "Content-type" : "multipart/form-data",
        };
        
        const body = {
            message 			: msg,
            stickerPackageId	: "",
            stickerId			: "",
            imageThumbnail 	    : "",
            imageFullsize 	    : "",
        };

        // let queryStr = querystring.stringify(body);
                
        let response ="";        
        // console.log("send " + api);
        await axios.post(api,body,
            {
                headers: header
            }
        ).then(            
            resp => 
            {   
                response = resp.data;                                   
            }
        )

        if (response.status==200) 
        {            
            // console.log(response);
            // console.log(response.message);
            return response.message;            
        }
        else
        {
            // console.log(response.msgerror);
            return {
                msgerror : response.msgerror
            }
        }
        
    } catch (error) {
        // console.log(error);
        return {
            msgerror : error.message
        }
    }

}



module.exports = LineManage;