'use strict';

var dbConn = require('../../config/db.config');

const Cryptof = require('./cryptof.model');

const jwt = require('jsonwebtoken');
const tableName = 'subscription_group_stock'
const tableKey = 'id'

//User object create
let SubscriptionGroupStock = async function () {

};

SubscriptionGroupStock.findAll = async function (searchword, result) {

    try {
        searchword = searchword ? searchword : "";

        let sqlStr = "Select " + tableName + ".*, " + tableName + ".id as id , subscription_type.subscription_name,subscription_type.subscription_img  ";
        sqlStr += " ,(SELECT end_at FROM subscription_group_payment_stock WHERE subscription_group_payment_stock.subscription_group_stock_id=" + tableName + ".id ORDER BY subscription_group_payment_stock.end_at DESC  LIMIT 1  ) as end_at ";
        sqlStr += " ,(SELECT count(*) FROM subscription_group_user_stock WHERE subscription_group_user_stock.subscription_group_stock_id=" + tableName + ".id ) as CountMember ";
        sqlStr += " ,(SELECT count(*) FROM subscription_group_user_stock WHERE subscription_group_user_stock.subscription_group_stock_id=" + tableName + ".id AND subscription_group_user_stock.user_id IS NOT NULL AND subscription_group_user_stock.user_id != '' ) as CountUsedMember ";
        sqlStr += " FROM " + tableName;
        sqlStr += " LEFT JOIN subscription_type ON " + tableName + ".subscription_type_id = subscription_type.id ";
        sqlStr += " where 1=1 AND (group_name like '%" + searchword + "%') ";

        let datas = await dbConn.raw(sqlStr);

        return datas[0];
    } catch (error) {
        console.log(error);
        return [];
    }

};

SubscriptionGroupStock.findAllForReport = async function (searchword, result) {

    try {
        searchword = searchword ? searchword : "";

        let sqlStr = "Select " + tableName + ".*, " + tableName + ".id as id , subscription_type.subscription_name,subscription_type.subscription_img  ";
        sqlStr += " ,(SELECT end_at FROM subscription_group_payment_stock WHERE subscription_group_payment_stock.subscription_group_stock_id=" + tableName + ".id ORDER BY subscription_group_payment_stock.end_at DESC  LIMIT 1  ) as end_at ";
        sqlStr += " ,(SELECT count(*) FROM subscription_group_user_stock WHERE subscription_group_user_stock.subscription_group_stock_id=" + tableName + ".id AND subscription_group_user_stock.subscription_group_stock_id != 0 ) as CountMember ";
        sqlStr += " ,(SELECT count(*) FROM subscription_group_user_stock WHERE subscription_group_user_stock.subscription_group_stock_id=" + tableName + ".id AND subscription_group_user_stock.subscription_group_stock_id != 0 AND subscription_group_user_stock.user_id IS NOT NULL AND subscription_group_user_stock.user_id != '' ) as CountUsedMember ";
        sqlStr += " FROM " + tableName;
        sqlStr += " LEFT JOIN subscription_type ON " + tableName + ".subscription_type_id = subscription_type.id ";
        sqlStr += " where 1=1 AND (subscription_group_stock.group_name like '%" + searchword + "%') ";

        let datas = await dbConn.raw(sqlStr);

        return datas[0];
    } catch (error) {
        console.log(error);
        return [];
    }

};

SubscriptionGroupStock.findAllActive = async function (searchword, result) {

    try {
        searchword = searchword ? searchword : "";

        let sqlStr = "Select subscription_group_stock.*, subscription_group_stock.id as id , subscription_type.subscription_name,subscription_type.subscription_img  ";
        sqlStr += " FROM subscription_group_stock";
        sqlStr += " LEFT JOIN subscription_type ON subscription_group_stock.subscription_type_id = subscription_type.id ";
        sqlStr += " where 1=1 AND (subscription_group_stock.group_name like '%" + searchword + "%') ";
        let datas = await dbConn.raw(sqlStr);
        return datas[0];
    } catch (error) {
        console.log(error);
        return [];
    }
};   
SubscriptionGroupStock.findById = async function (id, result) {

    try {
        let sqlStr = "Select subscription_group_stock.*, subscription_group_stock.id as id , subscription_type.subscription_name,subscription_type.subscription_img  ";
        sqlStr += " FROM subscription_group_stock";
        sqlStr += " LEFT JOIN subscription_type ON subscription_group_stock.subscription_type_id = subscription_type.id ";
        sqlStr += " where 1=1 AND (subscription_group_stock.id = " + id + ") ";

        const datas = await dbConn.raw(sqlStr);
        return datas[0][0];
    } catch (error) {
        console.log(error);
        return [];
    }
};

SubscriptionGroupStock.getSubscribeMemberByGroupById = async function (id, result) {

    try {
        let sqlStr = "Select subscription_group_user_stock.*, subscription_group_user_stock.id as id , subscription_group_user_stock.user_id,subscription_group_user_stock.email,subscription_type.subscription_name,subscription_type.subscription_img  ";
        sqlStr += " ,line_contact.display_name as line_display_name ";
        sqlStr += " ,line_contact.picture_url as line_profile_url ";
        sqlStr += " FROM subscription_group_stock";
        sqlStr += " INNER JOIN subscription_type ON subscription_group_stock.subscription_type_id = subscription_type.id ";
        sqlStr += " INNER JOIN subscription_group_user_stock ON subscription_group_stock.id = subscription_group_user_stock.subscription_group_stock_id ";
        sqlStr += " LEFT JOIN line_contact ON line_contact.user_id = subscription_group_user_stock.user_id ";
        sqlStr += " where 1=1 AND (subscription_group_stock.id = " + id + ") ";

        const datas = await dbConn.raw(sqlStr);
        return datas[0];
    } catch (error) {
        console.log(error);
        return [];
    }
};

SubscriptionGroupStock.getSubscribePaymentById = async function (group_id, result) {

    try {
        let sqlStr = "Select subscription_group_payment_stock.id as id ,subscription_group_payment_stock.* ";
        sqlStr += " FROM subscription_group_payment_stock ";
        sqlStr += " INNER JOIN subscription_group_stock ON subscription_group_stock.id = subscription_group_payment_stock.subscription_group_stock_id ";
        sqlStr += " where 1=1 AND (subscription_group_stock.id = " + group_id + ") ";

        const datas = await dbConn.raw(sqlStr);
        return datas[0];
    } catch (error) {
        console.log(error);
        return [];
    }

};

SubscriptionGroupStock.getGroupOfMemberByMemberId = async function (user_id, result) {

    try {
        let sqlStr = "Select group_name, subscription_group_user_stock.*, subscription_group_user_stock.id as id , subscription_group_user_stock.user_id,subscription_group_user_stock.email,subscription_type.subscription_name,subscription_type.subscription_img  ";
        sqlStr += " FROM subscription_group_stock";
        sqlStr += " INNER JOIN subscription_type ON subscription_group_stock.subscription_type_id = subscription_type.id ";
        sqlStr += " INNER JOIN subscription_group_user_stock ON subscription_group_stock.id = subscription_group_user_stock.subscription_group_stock_id ";
        sqlStr += " where 1=1 AND (subscription_group_user_stock.user_id = '" + user_id + "') ";
            
        const datas = await dbConn.raw(sqlStr);
        return datas[0];
    } catch (error) {
        console.log(error);
        return [];
    }
};



function compareMeta(inputData, metaData) {
    // console.log("compareMeta");
    // console.log(inputData);
    // console.log(metaData);
    if (inputData != '' && inputData != metaData) {
        inputData = Cryptof.encryption(metaData);
    }
    // console.log(inputData);
    return inputData;
}

SubscriptionGroupStock.create = async function (objData, result) {
    console.log(objData);
    try {
        const datas = await dbConn.raw(
            "INSERT INTO " + tableName + " (" +
            "group_name, update_at, update_by, subscription_type_id, head_email, password, invite_url" +
            ") VALUES (?,?,?,?,?,?,?)",
            [
                objData.group_name,
                objData.update_at,
                objData.update_by,
                objData.subscription_type_id,
                objData.head_email,
                objData.password || '',
                objData.invite_url || ''
            ]
        );

        return datas[0];
    } catch (error) {
        console.log(error);
        return { errorMessage: error.message };
    }
};


SubscriptionGroupStock.updateByID = async function (objData, result) {

    const rowid = objData.id;

    try {
        const datas = await dbConn.raw(
            "UPDATE " + tableName + " SET " +
            "group_name = ?, " +
            "update_at = ?, " +
            "update_by = ?, " +
            "subscription_type_id = ?, " +
            "head_email = ?, " +
            "password = ?, " +
            "invite_url = ?, " +            
            "status = ? " +
            "WHERE id = ?",
            [
                objData.group_name,
                objData.update_at,
                objData.update_by,
                objData.subscription_type_id,
                objData.head_email,
                objData.password || '',
                objData.invite_url || '',
                objData.status || 1,  // ถ้าไม่ได้ส่งมา ให้ default = 1
                rowid
            ]
        );


        return datas[0];
    } catch (error) {
        console.log(error);
        return { errorMessage: error.message };
    }

};

SubscriptionGroupStock.deleteByID = async function (objData, result) {

    try {

        let lstID = objData.listId.join(",");

        const datas = await dbConn.raw("DELETE FROM " + tableName + " WHERE id in (" + lstID + ")");

        return datas[0];
    } catch (error) {
        console.log(error);
        return { errorMessage: error.message };
    }

};

SubscriptionGroupStock.inactiveByID = async function (objData, result) {

    try {

        let lstID = objData.listId.join(",");

        const datas = await dbConn.raw("UPDATE " + tableName + " SET " +
            " `status` = (status-1)*-1 "
            + " WHERE id in (" + lstID + ") "
        );


        return datas[0];
    } catch (error) {
        console.log(error);
        return { errorMessage: error.message };
    }

};

SubscriptionGroupStock.checkDuplicateMember = async function (objData, result) {

    try {
        let sqlStr = "Select count(*) as totalCount ";
        sqlStr += " FROM subscription_group_user_stock";
        sqlStr += " where 1=1 AND (subscription_group_stock_id = " + objData.subscription_group_stock_id + ") ";
        sqlStr += " AND (user_id = '" + objData.user_id + "') ";
        sqlStr += " AND (email = '" + objData.email + "') ";

        const datas = await dbConn.raw(sqlStr);
        return datas[0];
    } catch (error) {
        console.log(error);
        return [];
    }
};

SubscriptionGroupStock.addMemberToGroup = async function (objData, result) {

    console.log(objData);
    try {

        // const datas2 = await dbConn.raw(`
        //     DELETE FROM subscription_group_user_stock WHERE subscription_group_user_stock.email=? 
        //     and subscription_group_user_stock.subscription_group_stock_id IN (
        //     SELECT subscription_group_stock.id FROM subscription_group_stock
        //     WHERE subscription_group_stock.subscription_type_id=?
        //     ) `
        //     , [
        //         objData.email,
        //         objData.subscription_type_id,
        //     ]);

        const datas = await dbConn.raw("INSERT INTO  subscription_group_user_stock (" +
            "subscription_group_stock_id "
            + ",update_at"
            + ",update_by"
            + ",user_id "
            + ",email "
            + ",password "
            + ",note "
            + ",invite_url "
            + " ) VALUES (?,?,?,?,?,?,?,?)"
            , [
                objData.subscription_group_stock_id
                , objData.update_at
                , objData.update_by
                , objData.user_id || ''
                , objData.email || ''
                , objData.password || ''
                , objData.note || ''
                ,objData.invite_url || ''
            ]);

        return true;
    } catch (error) {
        console.log(error);
        return { errorMessage: error.message };
    }


};

SubscriptionGroupStock.setMemberToHeaderGroup = async function (objData, result) {


    try {
        const datas2 = await dbConn.raw("UPDATE " + tableName + " SET "
            + "is_header_group=0"
            + ",update_at=? "
            + ",update_by=? "
            + "WHERE subscription_group_stock_id = ? "
            , [
                objData.isHeader
                , objData.update_at
                , objData.update_by
                , objData.subscription_group_stock_id
            ]);

        const datas = await dbConn.raw("UPDATE " + tableName + " SET "
            + "is_header_group=?"
            + ",update_at=? "
            + ",update_by=? "
            + "WHERE subscription_group_stock_id = ? and email=? "
            , [
                objData.isHeader
                , objData.update_at
                , objData.update_by
                , objData.subscription_group_stock_id
                , objData.email
            ]);

        return datas[0];
    } catch (error) {
        console.log(error);
        return { errorMessage: error.message };
    }

};

SubscriptionGroupStock.deleteMemberFromGroupByID = async function (objData, result) {

    try {

        let lstID = objData.listId.join(",");

        const datas = await dbConn.raw("DELETE FROM subscription_group_user_stock WHERE id in (" + lstID + ")");

        return datas[0];
    } catch (error) {
        console.log(error);
        return { errorMessage: error.message };
    }

};

SubscriptionGroupStock.deletePaymentHistoryByID = async function (objData, result) {

    try {

        let lstID = objData.listId.join(",");

        const datas = await dbConn.raw("DELETE FROM subscription_group_payment_stock WHERE id in (" + lstID + ")");

        return datas[0];
    } catch (error) {
        console.log(error);
        return { errorMessage: error.message };
    }

};



SubscriptionGroupStock.addPaymentNoteGroup = async function (objData, result) {


    try {

        const datas = await dbConn.raw("INSERT INTO  subscription_group_payment_stock (" +
            "subscription_group_stock_id "
            + ",start_at"
            + ",end_at"
            + ",update_at"
            + ",update_by"
            + ",paid_amount "
            + ",paid_by "
            + ",ref_img1 "
            + ",ref_img2 "
            + " ) VALUES (?,?,?,?,?,?,?,?,?)"
            , [
                objData.subscription_group_stock_id
                , objData.start_at
                , objData.end_at
                , objData.update_at
                , objData.update_by
                , objData.paid_amount
                , objData.paid_by
                , objData.ref_img1
                , objData.ref_img2
            ]);

        return true;
    } catch (error) {
        console.log(error);
        return { errorMessage: error.message };
    }


};

SubscriptionGroupStock.updateMemberData = async function (objData, result) {
    
    try {
        const datas = await dbConn.raw("UPDATE subscription_group_user_stock SET " +
            "email = ?, " +
            "password = ?, " +
            "user_id = ?, " +
            "invite_url = ?, " +
            "note = ? " +
            "WHERE id = ?"
            , [
                objData.email,
                objData.password,
                objData.user_id || '',
                objData.invite_url || '',
                objData.note || '',
                
                objData.id
            ]);

        return true;
    } catch (error) {
        console.log(error);
        return { errorMessage: error.message };
    }
};

module.exports = SubscriptionGroupStock;