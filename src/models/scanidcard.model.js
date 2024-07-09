'use strict';

const axios = require('axios');
var dbConn = require('../../config/db.config');
const Secret = require('../../config/secret');

const OffsetTime = require('../../config/offsettime');

const offsetTime = OffsetTime.offsetTime;
const offsetTime24hrs = OffsetTime.offsetTime24hrs;

var ScanIdCard = async function() 
{
    
};

ScanIdCard.sendSlipFileToApi = async function(filePath, apiKey, baseUrl) {        
    const formData = new FormData();
    formData.append('image', fs.createReadStream(filePath));

    return axios.post(baseUrl, formData, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'multipart/form-data'
        }
    });
};

ScanIdCard.sendSlipUrlToApi = async function(filePath, apiKey, baseUrl) {        
    const formData = new FormData();
    formData.append('image', fs.createReadStream(filePath));

    return axios.post(baseUrl, formData, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'multipart/form-data'
        }
    });
};


ScanIdCard.sendSlipUrlToApi = async function(imageUrl, apiKey, baseUrl)  {
    return axios.post(baseUrl, { image_url: imageUrl }, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    });
}

ScanIdCard.sendSlipBase64ToApi = async function(base64, apiKey, baseUrl) {
    return axios.post(baseUrl, { base64: base64 }, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    });
}
ScanIdCard.removeSlipBrTags = async function(response) {
    if (response.result) {
        response.result = response.result.replace(/<br \/>/g, '');
    }
    return response;
}


module.exports = ScanIdCard;