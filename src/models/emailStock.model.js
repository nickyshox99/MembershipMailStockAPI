'use strict';

var dbConn = require('../../config/db.config');


//User object create
let EmailStock = async function () {

};

EmailStock.getEmailStockByUserId = async function (userId) {
    try {
        let sqlStr = "SELECT * FROM `subscription_group_user` WHERE `user_id` = ?";
        const datas = await dbConn.raw(sqlStr,[userId]);


        if (datas[0].length > 0) {
            return datas[0][0];
        } else {
            let sqlStr2 = "SELECT * FROM `subscription_group_user` WHERE (`user_id` = '' OR `user_id` = NULL) AND password is not null AND password <> '' AND email is not null AND email <> '' limit 1";
            const datas2 = await dbConn.raw(sqlStr2,[]);

            return datas2[0][0];
        }

    } catch (error) {
        console.log(error);
        return null;
    }




};

EmailStock.reserveEmailStock = async function (emailStockId,userId) {
    try{
        let sqlStr = "UPDATE `subscription_group_user` SET `user_id` = ? WHERE `id` = ?";
        const datas = await dbConn.raw(sqlStr,[userId,emailStockId]);
        return true;
    }catch(error){
        console.log(error);
        return false;
    }
};

module.exports = EmailStock;