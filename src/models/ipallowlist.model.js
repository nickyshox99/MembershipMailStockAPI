'use strict';

var dbConn = require('../../config/db.config');
const Secret = require('../../config/secret');

const jwt = require('jsonwebtoken');
const tableName = 'ip_allowed'
const tableKey = 'id'

var IpAllowList = function() 
{
    
};

IpAllowList.findById = async function(ip_address, result) {        
    // const datas = dbConn.raw("Select * from " + tableName + " WHERE ip_address='"+ ip_address +"'" );
    //By Pass
    const datas = await dbConn.raw("Select id from " + tableName +" limit 0,1");    
    // console.log(datas);
    return datas[0];
};

IpAllowList.findBlockedById = async function(ip_address, result) {        
    // const datas = dbConn.raw("Select * from " + tableName + " WHERE ip_address='"+ ip_address +"'" );
    //By Pass
    const datas = await dbConn.raw("Select id from ip_blocked WHERE ip_address='"+ip_address+"' limit 0,1");    
    // console.log(datas);
    return datas[0];
};

IpAllowList.getIPv4Address = async function(req, result) {        
    // let ipv4Address = "127.0.0.1";

    try 
    {        
        let inputIp = req.headers['x-forwarded-for'];
        if (inputIp==null) 
        {            
            inputIp=req.socket.remoteAddress;
        }
        
        const ipAddresses = inputIp?remoteAddress.split(','):[];
        let ipv4Address = '127.0.0.1';

        await ipAddresses.forEach(ip => {
            ip = ip.trim();
            if (ip.includes(':')) {
            // Skip IPv6 address
            return;
            }
            ipv4Address = ip;
        });

        // const ipAddressTmp = remoteAddress;
        // const ipv4Regex = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/;
        // const ipv4Match = ipAddressTmp.match(ipv4Regex);
        // const ipv4Address = ipv4Match ? ipv4Match[0] : "127.0.0.1";

        // const ipv4MappedRegex = /^\s*::ffff:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\s*$/;
        // const ipv4MappedRegex = /^::ffff:((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$/;
        // const match = remoteAddress.match(ipv4MappedRegex);
        // if (match) {
        //     ipv4Address = match[1];
        // }

        return ipv4Address;

    } catch (error) {
        return '127.0.0.1';
    }

    
};

IpAllowList.findIPCallBack = async function(ip_address, result) {        
    const datas = await dbConn.raw("Select * from allow_ip  WHERE ipaddress='"+ ip_address +"'" );        
    // console.log(datas);
    return datas[0];
};


module.exports = IpAllowList;