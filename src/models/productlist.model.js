'use strict';

var dbConn = require('../../config/db.config');

const Cryptof = require('./cryptof.model');
const adminSettingList = require('./adminsetting.model');

const jwt = require('jsonwebtoken');
const tableName = 'product_list'
const tableKey = 'id'

//User object create
var productList = async function (productSetting) {

};

productList.findAllActive = async function (result) {

    let sqlStr = "Select product_list.*,subscription_type.subscription_name,subscription_type.subscription_img ";
    sqlStr += " FROM " + tableName;
    sqlStr += " INNER JOIN subscription_type ON subscription_type.id=product_list.subscription_type_id ";
    sqlStr += " WHERE product_list.status=1  ";

    let datas = await dbConn.raw(sqlStr);


    //dbConn.end;
    return datas[0];
};

productList.findAll = async function (result) {

    let sqlStr = "Select product_list.*,subscription_type.subscription_name,subscription_type.subscription_img ";
    sqlStr += " FROM " + tableName;
    sqlStr += " INNER JOIN subscription_type ON subscription_type.id=product_list.subscription_type_id ";

    let datas = await dbConn.raw(sqlStr);


    //dbConn.end;
    return datas[0];
};

productList.findById = async function (id, result) {
    let sqlStr = "Select *  ";
    sqlStr += " FROM product_list ";
    sqlStr += " where 1=1 AND (id = " + id + ") ";


    const datas = await dbConn.raw(sqlStr);

    return datas[0][0] ? datas[0][0] : [];
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

productList.create = async function (objData, result) {


    try {

        const datas = await dbConn.raw("INSERT INTO " + tableName + " (" +
            "product_name"
            + ",subscription_type_id "
            + ",product_img "
            + ",use_credit "
            + ",status  "
            + ",type  "
            + ",product_desc "
            + ",give_credit "
            + ",subscription_day "
            + ",subscription_times "
            + " ) VALUES (?,?,?,?,?,?,?,?,?,?)"
            , [
                objData.product_name
                , objData.subscription_type_id
                , objData.product_img
                , objData.use_credit
                , objData.status
                , objData.type
                , objData.product_desc
                , objData.give_credit
                , objData.subscription_day
                , objData.subscription_times
            ]);

        // const datas=[];
        // datas['affectedRows'] = 0;
        //dbConn.end;
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }


};

productList.updateByID = async function (objData, result) {

    const rowid = objData.id;

    try {


        const datas = await dbConn.raw("UPDATE " + tableName + " SET "
            + "product_name=? "
            + ",subscription_type_id=? "
            + ",product_img=? "
            + ",use_credit=? "
            + ",status=? "
            + ",type=? "
            + ",product_desc=? "
            + ",give_credit=? "
            + ",subscription_day=? "
            + ",subscription_times=? "
            + " WHERE id = ? "
            , [
                objData.product_name
                , objData.subscription_type_id
                , objData.product_img
                , objData.use_credit
                , objData.status
                , objData.type
                , objData.product_desc
                , objData.give_credit
                , objData.subscription_day
                , objData.subscription_times
                , rowid]);


        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

};

productList.deleteByID = async function (objData, result) {

    try {


        let lstID = objData.listId.join(",");

        const datas = await dbConn.raw("DELETE FROM " + tableName + " WHERE id in (" + lstID + ")");


        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

};

productList.inActiveByID = async function (objData, result) {

    const rowid = objData.id;
    let lstID = objData.listId.join(",");

    try {

        const datas = await dbConn.raw("UPDATE " + tableName + " SET "
            + "status=? "
            + "WHERE id in (" + lstID + ") "
            , [
                , objData.status
            ]
        );


        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

};

productList.getHistoryOrderByMemberID = async function (memberId, startTime, endTime, result) {

    let sqlStr = "Select product_order_history.*,product_list.product_img ";
    sqlStr += " FROM product_order_history ";
    sqlStr += " LEFT JOIN product_list ON product_list.id=product_order_history.product_id";
    sqlStr += " WHERE 1=1 ";
    sqlStr += " AND (gift_to='" + memberId + "' OR order_by='" + memberId + "' )";
    sqlStr += " AND (date between '" + startTime + "' AND '" + endTime + "' )";


    let datas = await dbConn.raw(sqlStr);


    //dbConn.end;
    return datas[0];
};

productList.getLastSubscriptionOrderByMemberID = async function (memberId, subTypeId, email, result) {

    let sqlStr = "Select membership_order_history.* ";
    sqlStr += " FROM membership_order_history ";
    sqlStr += " WHERE 1=1 ";
    sqlStr += " AND (user_id='" + memberId + "' )";
    sqlStr += " AND (subscription_type_id=" + subTypeId + " )";
    sqlStr += " AND end_date is not NULL ";
    sqlStr += " AND approve_date is not NULL ";
    sqlStr += " AND canceled = 0 ";
    sqlStr += " ORDER BY end_date DESC LIMIT 1 ";

    let datas = await dbConn.raw(sqlStr);

    //dbConn.end;
    return datas[0];
};

productList.createSubScribeOrder = async function (objData, result) {


    try {
        //console.log(objData);

        const datas = await dbConn.raw("INSERT INTO membership_order_history (" +
            "user_id "
            + ",email "
            + ",product_id  "
            + ",subscription_type_id "
            + ",product_name  "
            + ",start_date   "
            + ",end_date  "
            + ",buy_date  "
            + ",create_by "
            + ",create_date "
            + ",approve_by  "
            + ",approve_date "
            + ",note "
            + " ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)"
            , [
                objData.user_id
                , objData.email
                , objData.product_id
                , objData.subscription_type_id
                , objData.product_name
                , null
                , null
                , objData.buy_date
                , objData.create_by
                , objData.create_date
                , null
                , null
                , objData.note
            ]);

        // const datas=[];
        // datas['affectedRows'] = 0;
        //dbConn.end;
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }


};

productList.createAndApproveSubScribeOrder = async function (objData, result) {

    try {

        const datas = await dbConn.raw("INSERT INTO membership_order_history (" +
            "user_id "
            + ",email "
            + ",product_id  "
            + ",subscription_type_id "
            + ",product_name  "

            + ",start_date   "
            + ",end_date  "
            + ",buy_date  "
            + ",create_by "
            + ",create_date "

            + ",approve_by  "
            + ",approve_date "
            + ",note "
            + ",sent_email_by "
            + ",sent_email_at "
            + ",wait_check_payment "
            + ",purchase_type "
            + " ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
            , [
                objData.user_id
                , objData.email
                , objData.product_id
                , objData.subscription_type_id
                , objData.product_name

                , objData.start_date
                , objData.end_date
                , objData.buy_date
                , objData.create_by
                , objData.create_date

                , objData.approve_by
                , objData.approve_date
                , objData.note
                , objData.sent_email_by
                , objData.sent_email_at

                , objData.wait_check_payment
                , objData.purchase_type
            ]);

        // const datas=[];
        // datas['affectedRows'] = 0;
        //dbConn.end;
        return {
            id: datas[0].insertId,
            ...objData
            
        };
    } catch (error) {
        console.log(error);
        return false;
    }


};

productList.getOrderById = async function (id, result) {

    let sqlStr = "Select *  ";
    sqlStr += " FROM membership_order_history ";
    sqlStr += " where 1=1 AND (id = " + id + ") ";


    const datas = await dbConn.raw(sqlStr);

    return datas[0][0] ? datas[0][0] : [];
};

productList.approveOrderById = async function (objData, result) {

    const rowid = objData.id;

    try {

        const datas = await dbConn.raw("UPDATE membership_order_history SET "
            + "approve_by=? "
            + ",approve_date=? "
            + ",start_date=? "
            + ",end_date=? "
            + ",note=? "
            + "WHERE id = ? "
            , [
                objData.approve_by
                , objData.approve_date
                , objData.start_date
                , objData.end_date
                , objData.note
                , rowid
            ]
        );


        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

};

productList.SentFamliyInviteOrder = async function (objData, result) {

    const rowid = objData.id;

    try {

        const datas = await dbConn.raw("UPDATE membership_order_history SET "
            + "sent_email_by=? "
            + ",sent_email_at=? "
            + ",note=? "
            + ",skip_invite=0 "
            + ",wait_check_payment=1 "
            + " WHERE id = ? "
            , [
                objData.sent_email_by
                , objData.sent_email_at
                , objData.note
                , rowid
            ]
        );


        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

};

productList.SkipFamliyInviteOrder = async function (objData, result) {

    const rowid = objData.id;

    try {

        const datas = await dbConn.raw("UPDATE membership_order_history SET "
            + "sent_email_by=? "
            + ",sent_email_at=? "
            + ",note=? "
            + ",skip_invite=1 "
            + ",wait_check_payment=1 "
            + " WHERE id = ? "
            , [
                objData.sent_email_by
                , objData.sent_email_at
                , objData.note
                , rowid
            ]
        );


        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

};

productList.PaymentOrderWithSlip = async function (objData, result) {

    const rowid = objData.id;

    try {

        const datas = await dbConn.raw("UPDATE membership_order_history SET "
            + "slip_file_url=? "
            + ",slip_file_at=? "
            + ",wait_check_payment=1 "
            + ",slip_correct=NULL "
            + ",check_slip_by='' "
            + " WHERE id = ? "
            , [
                objData.slip_file_url
                , objData.slip_file_at
                , rowid
            ]
        );
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

};

productList.SentPaymentMessageOrder = async function (objData, result) {

    const rowid = objData.id;

    try {

        const datas = await dbConn.raw("INSERT INTO offer_message ( "
            + "offer_at "
            + ",to_email "
            + ",to_userid "
            + ",subscription_type_id "
            + ",offer_by "
            + " )VALUES(?,?,?,?,?)"
            , [
                objData.offer_at
                , objData.to_email
                , objData.to_userid
                , objData.subscription_type_id
                , objData.offer_by
            ]
        );


        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

};

productList.VerifySlipOrder = async function (objData, result) {

    const rowid = objData.id;

    try {

        const datas = await dbConn.raw("UPDATE membership_order_history SET "
            + "wait_check_payment=0 "
            + ",slip_correct=? "
            + ",check_slip_by=? "
            + ",check_slip_at=? "
            + " WHERE id = ? "
            , [
                objData.slip_correct
                , objData.check_slip_by
                , objData.check_slip_at
                , rowid
            ]
        );


        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

};

productList.cancelOrderById = async function (objData, result) {

    const rowid = objData.id;

    try {

        const datas = await dbConn.raw("UPDATE membership_order_history SET "
            + "canceled=1 "
            + ",note=? "
            + "WHERE id = ? "
            , [
                objData.note,
                rowid
            ]
        );


        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

};

productList.GetHistorySubScribeOrderByMemberID = async function (memberId, result) {

    let sqlStr = "Select membership_order_history.*,subscription_type.subscription_name,subscription_type.subscription_img ";
    sqlStr += " FROM membership_order_history ";
    sqlStr += " LEFT JOIN subscription_type ON subscription_type.id=membership_order_history.subscription_type_id ";
    sqlStr += " WHERE 1=1 ";
    sqlStr += " AND (user_id='" + memberId + "' )";
    sqlStr += " ORDER BY canceled, subscription_type_id , email,end_date DESC ";


    let datas = await dbConn.raw(sqlStr);


    //dbConn.end;
    return datas[0];
};

productList.GetHistorySubScribeOrderNotApprove = async function (result) {

    let sqlStr = "Select membership_order_history.*,subscription_type.subscription_name,subscription_type.subscription_img ";
    sqlStr += " ,line_contact.display_name as line_display_name ";
    sqlStr += " ,line_contact.picture_url as line_profile_url ";
    sqlStr += " FROM membership_order_history ";
    sqlStr += " LEFT JOIN subscription_type ON subscription_type.id=membership_order_history.subscription_type_id ";
    sqlStr += " LEFT JOIN line_contact ON line_contact.user_id = membership_order_history.user_id ";
    sqlStr += " WHERE 1=1 ";
    sqlStr += " AND (membership_order_history.approve_by is NULL || membership_order_history.approve_by ='') ";
    sqlStr += " ORDER BY subscription_type_id , email,end_date DESC ";


    let datas = await dbConn.raw(sqlStr);


    //dbConn.end;
    return datas[0];
};

productList.GetHistorySubScribeOrderWaitInvitation = async function (result) {

    let sqlStr = "Select membership_order_history.*,subscription_type.subscription_name,subscription_type.subscription_img ";
    sqlStr += " ,(SELECT subscription_group.group_name FROM subscription_group_user INNER JOIN subscription_group ON subscription_group.id=subscription_group_user.subscription_group_id WHERE subscription_group_user.email=membership_order_history.email AND subscription_group.subscription_type_id = membership_order_history.subscription_type_id  LIMIT 1) as group_name ";
    sqlStr += " ,(SELECT subscription_group.id FROM subscription_group_user INNER JOIN subscription_group ON subscription_group.id=subscription_group_user.subscription_group_id WHERE subscription_group_user.email=membership_order_history.email AND subscription_group.subscription_type_id = membership_order_history.subscription_type_id LIMIT 1) as group_id ";
    sqlStr += " ,line_contact.display_name as line_display_name ";
    sqlStr += " ,line_contact.picture_url as line_profile_url ";
    sqlStr += " FROM membership_order_history ";
    sqlStr += " LEFT JOIN subscription_type ON subscription_type.id=membership_order_history.subscription_type_id ";
    sqlStr += " LEFT JOIN line_contact ON line_contact.user_id = membership_order_history.user_id ";
    sqlStr += " WHERE 1=1 ";
    sqlStr += " AND membership_order_history.canceled=0";
    sqlStr += " AND (membership_order_history.approve_by is not NULL AND membership_order_history.approve_by <>'') ";
    sqlStr += " AND (membership_order_history.sent_email_by is NULL OR membership_order_history.sent_email_by ='') ";
    sqlStr += " ORDER BY subscription_type_id , email,end_date DESC ";


    let datas = await dbConn.raw(sqlStr);


    //dbConn.end;
    return datas[0];
};

productList.GetHistorySubScribeOrderWaitCheckPayment = async function (result) {

    let sqlStr = "Select membership_order_history.*,subscription_type.subscription_name,subscription_type.subscription_img ";
    sqlStr += " ,(SELECT subscription_group.group_name FROM subscription_group_user INNER JOIN subscription_group ON subscription_group.id=subscription_group_user.subscription_group_id WHERE subscription_group_user.email=membership_order_history.email LIMIT 1) as group_name ";
    sqlStr += " ,(SELECT subscription_group.id FROM subscription_group_user INNER JOIN subscription_group ON subscription_group.id=subscription_group_user.subscription_group_id WHERE subscription_group_user.email=membership_order_history.email LIMIT 1) as group_id ";
    sqlStr += " ,line_contact.display_name as line_display_name ";
    sqlStr += " ,line_contact.picture_url as line_profile_url ";
    sqlStr += " FROM membership_order_history ";
    sqlStr += " LEFT JOIN subscription_type ON subscription_type.id=membership_order_history.subscription_type_id ";
    sqlStr += " LEFT JOIN line_contact ON line_contact.user_id = membership_order_history.user_id ";
    sqlStr += " WHERE 1=1 ";
    sqlStr += " AND membership_order_history.canceled=0";
    sqlStr += " AND (membership_order_history.approve_by is not NULL AND membership_order_history.approve_by <>'') ";
    sqlStr += " AND (membership_order_history.sent_email_by is not NULL AND membership_order_history.sent_email_by <>'') ";
    sqlStr += " AND (membership_order_history.wait_check_payment = 1 ) ";
    sqlStr += " ORDER BY subscription_type_id , email,end_date DESC ";


    let datas = await dbConn.raw(sqlStr);


    //dbConn.end;
    return datas[0];
};

productList.GetHistorySubScribeOrderCheckedPayment = async function (result) {

    let sqlStr = "Select membership_order_history.*,subscription_type.subscription_name,subscription_type.subscription_img ";
    sqlStr += " ,membership_order_history.purchase_type ";
    sqlStr += " ,(SELECT subscription_group.group_name FROM subscription_group_user INNER JOIN subscription_group ON subscription_group.id=subscription_group_user.subscription_group_id WHERE subscription_group_user.email=membership_order_history.email LIMIT 1) as group_name ";
    sqlStr += " ,(SELECT subscription_group.id FROM subscription_group_user INNER JOIN subscription_group ON subscription_group.id=subscription_group_user.subscription_group_id WHERE subscription_group_user.email=membership_order_history.email LIMIT 1) as group_id ";
    sqlStr += " ,line_contact.display_name as line_display_name ";
    sqlStr += " ,line_contact.picture_url as line_profile_url ";
    sqlStr += " FROM membership_order_history ";
    sqlStr += " LEFT JOIN subscription_type ON subscription_type.id=membership_order_history.subscription_type_id ";
    sqlStr += " LEFT JOIN line_contact ON line_contact.user_id = membership_order_history.user_id ";
    sqlStr += " WHERE 1=1 ";
    sqlStr += " AND membership_order_history.canceled=0";
    sqlStr += " AND (membership_order_history.approve_by is not NULL AND membership_order_history.approve_by <>'') ";
    sqlStr += " AND (membership_order_history.sent_email_by is not NULL AND membership_order_history.sent_email_by <>'') ";
    sqlStr += " AND (membership_order_history.wait_check_payment = 0 ) ";
    sqlStr += " AND (membership_order_history.slip_correct is not NULL ) ";
    sqlStr += " ORDER BY subscription_type_id , email,end_date DESC ";


    let datas = await dbConn.raw(sqlStr);


    //dbConn.end;
    return datas[0];
};

productList.GetHistorySubScribeOrderAll = async function (result) {

    let sqlStr = "Select membership_order_history.*,subscription_type.subscription_name,subscription_type.subscription_img ";
    sqlStr += " ,(SELECT subscription_group.group_name FROM subscription_group_user INNER JOIN subscription_group ON subscription_group.id=subscription_group_user.subscription_group_id WHERE subscription_group_user.email=membership_order_history.email LIMIT 1) as group_name ";
    sqlStr += " ,(SELECT subscription_group.id FROM subscription_group_user INNER JOIN subscription_group ON subscription_group.id=subscription_group_user.subscription_group_id WHERE subscription_group_user.email=membership_order_history.email LIMIT 1) as group_id ";
    sqlStr += " ,line_contact.display_name as line_display_name ";
    sqlStr += " ,line_contact.picture_url as line_profile_url ";
    sqlStr += " FROM membership_order_history ";
    sqlStr += " LEFT JOIN subscription_type ON subscription_type.id=membership_order_history.subscription_type_id ";
    sqlStr += " LEFT JOIN line_contact ON line_contact.user_id = membership_order_history.user_id ";
    sqlStr += " WHERE 1=1 ";
    sqlStr += " AND membership_order_history.canceled=0";
    sqlStr += " AND (membership_order_history.approve_by is not NULL AND membership_order_history.approve_by <>'') ";
    sqlStr += " AND (membership_order_history.sent_email_by is not NULL AND membership_order_history.sent_email_by <>'') ";
    sqlStr += " AND (membership_order_history.wait_check_payment = 0 ) ";
    sqlStr += " AND (membership_order_history.slip_correct is not NULL ) ";
    sqlStr += " ORDER BY subscription_type_id , email,end_date DESC ";


    let datas = await dbConn.raw(sqlStr);


    //dbConn.end;
    return datas[0];
};

productList.GetOrderNearExpire = async function (result) {
    const meta_setting = await adminSettingList.findById("line_token");
    const lineSetting = JSON.parse(meta_setting.value);

    let sqlStr = `
     SELECT 
       moh.*, 
       st.subscription_name, 
       st.subscription_img,
       DATEDIFF(latest.max_end_date, CURDATE()) AS days_left,
       offerlatest.max_offer_at AS latest_offer_message_at,
       offerlatest.offer_by,
       lc.display_name as line_display_name,
       lc.picture_url as line_profile_url

     FROM membership_order_history moh 

     INNER JOIN (
       SELECT user_id, subscription_type_id, MAX(end_date) AS max_end_date 
       FROM membership_order_history 
       WHERE slip_correct = 1 GROUP BY user_id, subscription_type_id
     ) latest 
       ON moh.user_id = latest.user_id 
      AND moh.subscription_type_id = latest.subscription_type_id 
      AND moh.end_date = latest.max_end_date

     LEFT JOIN (
       SELECT o1.to_userid,
              o1.subscription_type_id,
              o1.offer_at AS max_offer_at,
              o1.offer_by
       FROM offer_message o1
       INNER JOIN (
         SELECT to_userid, subscription_type_id, MAX(offer_at) AS max_offer_at
         FROM offer_message
         GROUP BY to_userid, subscription_type_id
       ) mx
         ON mx.to_userid = o1.to_userid
        AND mx.subscription_type_id = o1.subscription_type_id
        AND mx.max_offer_at = o1.offer_at
     ) offerlatest
       ON offerlatest.to_userid = moh.user_id
      AND offerlatest.subscription_type_id = moh.subscription_type_id

     LEFT JOIN subscription_type st ON st.id = moh.subscription_type_id
     LEFT JOIN line_contact lc ON lc.user_id = moh.user_id

     WHERE moh.slip_correct = 1
       AND DATEDIFF(latest.max_end_date, CURDATE()) <= ${lineSetting.SetNearDate}
       AND DATEDIFF(latest.max_end_date, CURDATE()) > 0
       AND moh.canceled <> 1
     ORDER BY days_left ASC;
    `;


    let datas = await dbConn.raw(sqlStr);


    //dbConn.end;
    return datas[0];
};

productList.GetOrderExpired = async function (result) {
    let sqlStr = `
SELECT 
       moh.*, 
       st.subscription_name, 
       st.subscription_img,
       DATEDIFF(latest.max_end_date, CURDATE()) AS days_left,
       offerlatest.max_offer_at AS latest_offer_message_at,
       offerlatest.offer_by,
       lc.display_name as line_display_name,
       lc.picture_url as line_profile_url

     FROM membership_order_history moh 

     INNER JOIN (
       SELECT user_id, subscription_type_id, MAX(end_date) AS max_end_date 
       FROM membership_order_history 
       WHERE slip_correct = 1 GROUP BY user_id, subscription_type_id
     ) latest 
       ON moh.user_id = latest.user_id 
      AND moh.subscription_type_id = latest.subscription_type_id 
      AND moh.end_date = latest.max_end_date

     LEFT JOIN (
       SELECT o1.to_userid,
              o1.subscription_type_id,
              o1.offer_at AS max_offer_at,
              o1.offer_by
       FROM offer_message o1
       INNER JOIN (
         SELECT to_userid, subscription_type_id, MAX(offer_at) AS max_offer_at
         FROM offer_message
         GROUP BY to_userid, subscription_type_id
       ) mx
         ON mx.to_userid = o1.to_userid
        AND mx.subscription_type_id = o1.subscription_type_id
        AND mx.max_offer_at = o1.offer_at
     ) offerlatest
       ON offerlatest.to_userid = moh.user_id
      AND offerlatest.subscription_type_id = moh.subscription_type_id

     LEFT JOIN subscription_type st ON st.id = moh.subscription_type_id
     LEFT JOIN line_contact lc ON lc.user_id = moh.user_id

     WHERE moh.slip_correct = 1
       AND DATEDIFF(latest.max_end_date, CURDATE()) <= 0
       AND moh.canceled <> 1
     ORDER BY days_left ASC;
`

    let datas = await dbConn.raw(sqlStr);


    //dbConn.end;
    return datas[0];
};

productList.GetOrderJustExpired = async function (result) {

    let sqlStr = `
    SELECT 
        moh.*, 
        st.subscription_name, 
        st.subscription_img,
        DATEDIFF(latest.max_end_date,CURDATE()) AS days_left,
        offerlatest.max_offer_at as latest_offer_message_at,
        offerlatest.offer_by
        FROM membership_order_history moh 
        INNER JOIN (
            SELECT 
                email, 
                MAX(end_date) AS max_end_date,
                subscription_type_id
            FROM membership_order_history
            WHERE slip_correct=1
            GROUP BY email, subscription_type_id
        ) latest 
        ON moh.email = latest.email 
        AND moh.subscription_type_id = latest.subscription_type_id 
        AND moh.end_date = latest.max_end_date
        LEFT JOIN ( 
            SELECT 
                to_email, 
                MAX(offer_at) AS max_offer_at,
                subscription_type_id,
                offer_by
            FROM offer_message
            GROUP BY to_email,subscription_type_id
        ) offerlatest ON moh.email = offerlatest.to_email AND moh.subscription_type_id = offerlatest.subscription_type_id
        LEFT JOIN subscription_type st ON st.id = moh.subscription_type_id
        WHERE moh.slip_correct = 1
        AND DATEDIFF(latest.max_end_date,CURDATE())<=1
        AND DATEDIFF(latest.max_end_date,CURDATE())>-2
        AND moh.canceled<>1
        ORDER BY days_left ASC;
    `;


    let datas = await dbConn.raw(sqlStr);


    //dbConn.end;
    return datas[0];
};

productList.GetDayExpireByUserId = async function (userid, result) {

    let sqlStr = `
    SELECT 
		DATEDIFF(latest.max_end_date,CURDATE()) AS days_left,
        moh.*, 
        st.subscription_name, 
        st.subscription_img      
        FROM membership_order_history moh 
        INNER JOIN (
            SELECT 
                email, 
                MAX(end_date) AS max_end_date,
                subscription_type_id
            FROM membership_order_history
            WHERE slip_correct=1
            GROUP BY email, subscription_type_id
        ) latest 
        ON moh.email = latest.email 
        AND moh.subscription_type_id = latest.subscription_type_id 
        AND moh.end_date = latest.max_end_date        
        LEFT JOIN subscription_type st ON st.id = moh.subscription_type_id
        WHERE moh.slip_correct = 1        
        AND moh.user_id='${userid}' 
        AND moh.canceled<>1
        ORDER BY days_left ASC;
    `;

    let datas = await dbConn.raw(sqlStr);


    //dbConn.end;
    return datas[0];
};

productList.GetSubScribeOrderById = async function (id, user_id, result) {


    let sqlStr = `SELECT 
        moh.*,
        st.subscription_name,
        st.subscription_img,
        lc.display_name as line_display_name,
        lc.picture_url as line_profile_url
    FROM membership_order_history moh 
    LEFT JOIN subscription_type st ON st.id = moh.subscription_type_id 
    LEFT JOIN line_contact lc ON lc.user_id = moh.user_id
    WHERE 1=1 
    AND moh.id=${id} 
    AND moh.user_id='${user_id}'
    AND moh.canceled=0
    AND (moh.approve_by IS NOT NULL AND moh.approve_by <>'')`;


    let datas = await dbConn.raw(sqlStr);

    //dbConn.end;
    return datas[0];
};

productList.getAccountSummaryReport = async function (result) {

    let sqlStr = `
    SELECT 
        'active' as status_type,
        COUNT(DISTINCT moh.email) as count
    FROM membership_order_history moh 
    INNER JOIN (
        SELECT 
            email, 
            MAX(end_date) AS max_end_date,
            subscription_type_id
        FROM membership_order_history
        WHERE slip_correct=1
        GROUP BY email, subscription_type_id
    ) latest 
    ON moh.email = latest.email 
    AND moh.subscription_type_id = latest.subscription_type_id 
    AND moh.end_date = latest.max_end_date
    WHERE moh.slip_correct = 1
    AND DATEDIFF(latest.max_end_date,CURDATE()) > 0
    AND moh.canceled<>1
    
    UNION ALL
    
    SELECT 
        'expired' as status_type,
        COUNT(DISTINCT moh.email) as count
    FROM membership_order_history moh 
    INNER JOIN (
        SELECT 
            email, 
            MAX(end_date) AS max_end_date,
            subscription_type_id
        FROM membership_order_history
        WHERE slip_correct=1
        GROUP BY email, subscription_type_id
    ) latest 
    ON moh.email = latest.email 
    AND moh.subscription_type_id = latest.subscription_type_id 
    AND moh.end_date = latest.max_end_date
    WHERE moh.slip_correct = 1
    AND DATEDIFF(latest.max_end_date,CURDATE()) <= 0
    AND moh.canceled<>1
    
    UNION ALL
    
    SELECT 
        'expiring_3_days' as status_type,
        COUNT(DISTINCT moh.email) as count
    FROM membership_order_history moh 
    INNER JOIN (
        SELECT 
            email, 
            MAX(end_date) AS max_end_date,
            subscription_type_id
        FROM membership_order_history
        WHERE slip_correct=1
        GROUP BY email, subscription_type_id
    ) latest 
    ON moh.email = latest.email 
    AND moh.subscription_type_id = latest.subscription_type_id 
    AND moh.end_date = latest.max_end_date
    WHERE moh.slip_correct = 1
    AND DATEDIFF(latest.max_end_date,CURDATE()) BETWEEN 1 AND 3
    AND moh.canceled<>1
    
    UNION ALL
    
    SELECT 
        'expiring_7_days' as status_type,
        COUNT(DISTINCT moh.email) as count
    FROM membership_order_history moh 
    INNER JOIN (
        SELECT 
            email, 
            MAX(end_date) AS max_end_date,
            subscription_type_id
        FROM membership_order_history
        WHERE slip_correct=1
        GROUP BY email, subscription_type_id
    ) latest 
    ON moh.email = latest.email 
    AND moh.subscription_type_id = latest.subscription_type_id 
    AND moh.end_date = latest.max_end_date
    WHERE moh.slip_correct = 1
    AND DATEDIFF(latest.max_end_date,CURDATE()) BETWEEN 4 AND 7
    AND moh.canceled<>1
    
    UNION ALL
    
    SELECT 
        'expiring_30_days' as status_type,
        COUNT(DISTINCT moh.email) as count
    FROM membership_order_history moh 
    INNER JOIN (
        SELECT 
            email, 
            MAX(end_date) AS max_end_date,
            subscription_type_id
        FROM membership_order_history
        WHERE slip_correct=1
        GROUP BY email, subscription_type_id
    ) latest 
    ON moh.email = latest.email 
    AND moh.subscription_type_id = latest.subscription_type_id 
    AND moh.end_date = latest.max_end_date
    WHERE moh.slip_correct = 1
    AND DATEDIFF(latest.max_end_date,CURDATE()) BETWEEN 8 AND 30
    AND moh.canceled<>1
    
    UNION ALL
    
    SELECT 
        'more_than_30_days' as status_type,
        COUNT(DISTINCT moh.email) as count
    FROM membership_order_history moh 
    INNER JOIN (
        SELECT 
            email, 
            MAX(end_date) AS max_end_date,
            subscription_type_id
        FROM membership_order_history
        WHERE slip_correct=1
        GROUP BY email, subscription_type_id
    ) latest 
    ON moh.email = latest.email 
    AND moh.subscription_type_id = latest.subscription_type_id 
    AND moh.end_date = latest.max_end_date
    WHERE moh.slip_correct = 1
    AND DATEDIFF(latest.max_end_date,CURDATE()) > 30
    AND moh.canceled<>1
    `;

    let datas = await dbConn.raw(sqlStr);

    // Transform data to object format
    let resultData = {
        activeAccounts: 0,
        expiredAccounts: 0,
        expiringIn3Days: 0,
        expiringIn7Days: 0,
        expiringIn30Days: 0,
        moreThan30Days: 0
    };

    if (datas[0] && datas[0].length > 0) {
        datas[0].forEach(row => {
            switch (row.status_type) {
                case 'active':
                    resultData.activeAccounts = parseInt(row.count);
                    break;
                case 'expired':
                    resultData.expiredAccounts = parseInt(row.count);
                    break;
                case 'expiring_3_days':
                    resultData.expiringIn3Days = parseInt(row.count);
                    break;
                case 'expiring_7_days':
                    resultData.expiringIn7Days = parseInt(row.count);
                    break;
                case 'expiring_30_days':
                    resultData.expiringIn30Days = parseInt(row.count);
                    break;
                case 'more_than_30_days':
                    resultData.moreThan30Days = parseInt(row.count);
                    break;
            }
        });
    }

    return resultData;
};

productList.getSubscriptionTypeReport = async function (result) {

    let sqlStr = `
    SELECT 
        CASE 
            WHEN moh.product_name LIKE '%Youtube Premium%' THEN 'Youtube Premium'
            WHEN moh.product_name LIKE '%Netflix%' THEN 'Netflix'
            WHEN moh.product_name LIKE '%Viu%' THEN 'Viu'
            WHEN moh.product_name LIKE '%WeTV%' THEN 'WeTV'
            ELSE 'อื่นๆ'
        END as subscription_name,
        CASE 
            WHEN moh.product_name LIKE '%1 เดือน%' THEN '1 เดือน'
            WHEN moh.product_name LIKE '%2 เดือน%' THEN '2 เดือน'
            WHEN moh.product_name LIKE '%3 เดือน%' THEN '3 เดือน'
            WHEN moh.product_name LIKE '%6 เดือน%' THEN '6 เดือน'
            WHEN moh.product_name LIKE '%1 ปี%' THEN '1 ปี'
            ELSE 'ไม่ระบุ'
        END as duration_text,
        COUNT(DISTINCT moh.email) as total_accounts,
        COUNT(DISTINCT CASE WHEN DATEDIFF(latest.max_end_date,CURDATE()) > 0 THEN moh.email END) as active_accounts,
        COUNT(DISTINCT CASE WHEN DATEDIFF(latest.max_end_date,CURDATE()) <= 0 THEN moh.email END) as expired_accounts,
        COUNT(DISTINCT CASE WHEN DATEDIFF(latest.max_end_date,CURDATE()) BETWEEN 1 AND 7 THEN moh.email END) as expiring_soon
    FROM membership_order_history moh
    LEFT JOIN (
        SELECT 
            email, 
            MAX(end_date) AS max_end_date,
            subscription_type_id
        FROM membership_order_history
        WHERE slip_correct=1 AND canceled<>1
        GROUP BY email, subscription_type_id
    ) latest ON moh.email = latest.email 
        AND moh.subscription_type_id = latest.subscription_type_id 
        AND moh.end_date = latest.max_end_date
    WHERE moh.slip_correct = 1 AND moh.canceled <> 1
    GROUP BY subscription_name, duration_text
    ORDER BY total_accounts DESC
    `;

    let datas = await dbConn.raw(sqlStr);
    return datas[0] || [];
};

productList.getOrderStatusReport = async function (result) {

    let sqlStr = `
    SELECT 
        'wait_invite' as status_type,
        COUNT(*) as count,
        'รอการเชิญเข้ากลุ่ม' as status_name
    FROM membership_order_history 
    WHERE canceled = 0 
    AND slip_correct = 1 
    AND approve_by IS NOT NULL 
    AND approve_by != ''
    AND (sent_email_by IS NULL OR sent_email_by = '')
    
    UNION ALL
    
    SELECT 
        'wait_approve' as status_type,
        COUNT(*) as count,
        'รอการอนุมัติ' as status_name
    FROM membership_order_history 
    WHERE canceled = 0 
    AND (approve_by IS NULL OR approve_by = '')
    AND wait_check_payment = 1
    
    UNION ALL
    
    SELECT 
        'wait_payment' as status_type,
        COUNT(*) as count,
        'รอชำระเงิน' as status_name
    FROM membership_order_history 
    WHERE canceled = 0 
    AND (approve_by IS NULL OR approve_by = '')
    AND (wait_check_payment = 0 OR wait_check_payment IS NULL)
    
    UNION ALL
    
    SELECT 
        'checked_payment' as status_type,
        COUNT(*) as count,
        'ตรวจสอบแล้ว' as status_name
    FROM membership_order_history 
    WHERE canceled = 0 
    AND slip_correct = 1 
    AND approve_by IS NOT NULL 
    AND approve_by != ''
    AND sent_email_by IS NOT NULL 
    AND sent_email_by != ''
    AND wait_check_payment = 0
    
    UNION ALL
    
    SELECT 
        'near_expire' as status_type,
        COUNT(DISTINCT email) as count,
        'ใกล้หมดอายุ' as status_name
    FROM membership_order_history moh
    INNER JOIN (
        SELECT 
            email, 
            MAX(end_date) AS max_end_date,
            subscription_type_id
        FROM membership_order_history
        WHERE slip_correct=1 AND canceled<>1
        GROUP BY email, subscription_type_id
    ) latest ON moh.email = latest.email 
        AND moh.subscription_type_id = latest.subscription_type_id 
        AND moh.end_date = latest.max_end_date
    WHERE moh.slip_correct = 1 
    AND moh.canceled<>1
    AND DATEDIFF(latest.max_end_date,CURDATE()) BETWEEN 1 AND 7
    
    UNION ALL
    
    SELECT 
        'expired' as status_type,
        COUNT(DISTINCT email) as count,
        'หมดอายุแล้ว' as status_name
    FROM membership_order_history moh
    INNER JOIN (
        SELECT 
            email, 
            MAX(end_date) AS max_end_date,
            subscription_type_id
        FROM membership_order_history
        WHERE slip_correct=1 AND canceled<>1
        GROUP BY email, subscription_type_id
    ) latest ON moh.email = latest.email 
        AND moh.subscription_type_id = latest.subscription_type_id 
        AND moh.end_date = latest.max_end_date
    WHERE moh.slip_correct = 1 
    AND moh.canceled<>1
    AND DATEDIFF(latest.max_end_date,CURDATE()) <= 0
    `;

    let datas = await dbConn.raw(sqlStr);

    // Transform data to object format
    let resultData = {
        waitInvite: 0,
        waitApprove: 0,
        waitPayment: 0,
        checkedPayment: 0,
        nearExpire: 0,
        expired: 0
    };

    if (datas[0] && datas[0].length > 0) {
        datas[0].forEach(row => {
            switch (row.status_type) {
                case 'wait_invite':
                    resultData.waitInvite = parseInt(row.count);
                    break;
                case 'wait_approve':
                    resultData.waitApprove = parseInt(row.count);
                    break;
                case 'wait_payment':
                    resultData.waitPayment = parseInt(row.count);
                    break;
                case 'checked_payment':
                    resultData.checkedPayment = parseInt(row.count);
                    break;
                case 'near_expire':
                    resultData.nearExpire = parseInt(row.count);
                    break;
                case 'expired':
                    resultData.expired = parseInt(row.count);
                    break;
            }
        });
    }

    return resultData;
};

productList.getMonthlyRevenueReport = async function (fromDate, toDate) {

    let sqlStr = `
    SELECT 
        DATE_FORMAT(moh.create_date, '%Y-%m') as month_year,
        COUNT(*) as total_orders,
        COUNT(DISTINCT moh.email) as unique_customers,
        SUM(CASE WHEN moh.slip_correct = 1 THEN pl.use_credit ELSE 0 END) as total_revenue,
        COUNT(CASE WHEN moh.slip_correct = 1 THEN 1 ELSE NULL END) as successful_orders,
        CASE 
            WHEN COUNT(CASE WHEN moh.slip_correct = 1 THEN 1 ELSE NULL END) > 0 
            THEN SUM(CASE WHEN moh.slip_correct = 1 THEN pl.use_credit ELSE 0 END) / COUNT(CASE WHEN moh.slip_correct = 1 THEN 1 ELSE NULL END)
            ELSE 0 
        END as average_order_value
    FROM membership_order_history moh
    LEFT JOIN product_list pl ON pl.id = moh.product_id
    WHERE moh.create_date >= ? AND moh.create_date <= ?
    GROUP BY DATE_FORMAT(moh.create_date, '%Y-%m')
    ORDER BY month_year DESC
    `;

    let datas = await dbConn.raw(sqlStr, [fromDate, toDate]);
    return datas[0] || [];
};

productList.testOrderStatusData = async function (result) {

    let sqlStr = `
    SELECT 
        'wait_invite' as status_type,
        COUNT(*) as count,
        'รอการเชิญเข้ากลุ่ม' as status_name
    FROM membership_order_history 
    WHERE canceled = 0 
    AND slip_correct = 1 
    AND approve_by IS NOT NULL 
    AND approve_by != ''
    AND (sent_email_by IS NULL OR sent_email_by = '')
    
    UNION ALL
    
    SELECT 
        'wait_approve' as status_type,
        COUNT(*) as count,
        'รอการอนุมัติ' as status_name
    FROM membership_order_history 
    WHERE canceled = 0 
    AND (approve_by IS NULL OR approve_by = '')
    AND wait_check_payment = 1
    
    UNION ALL
    
    SELECT 
        'wait_payment' as status_type,
        COUNT(*) as count,
        'รอชำระเงิน' as status_name
    FROM membership_order_history 
    WHERE canceled = 0 
    AND (approve_by IS NULL OR approve_by = '')
    AND (wait_check_payment = 0 OR wait_check_payment IS NULL)
    
    UNION ALL
    
    SELECT 
        'checked_payment' as status_type,
        COUNT(*) as count,
        'ตรวจสอบแล้ว' as status_name
    FROM membership_order_history 
    WHERE canceled = 0 
    AND slip_correct = 1 
    AND approve_by IS NOT NULL 
    AND approve_by != ''
    AND sent_email_by IS NOT NULL 
    AND sent_email_by != ''
    AND wait_check_payment = 0
    
    UNION ALL
    
    SELECT 
        'total_orders' as status_type,
        COUNT(*) as count,
        'คำสั่งซื้อทั้งหมด' as status_name
    FROM membership_order_history 
    WHERE canceled = 0
    
    UNION ALL
    
    SELECT 
        'sample_data' as status_type,
        COUNT(*) as count,
        'ข้อมูลตัวอย่าง' as status_name
    FROM membership_order_history 
    WHERE 1=1
    LIMIT 5
    `;

    let datas = await dbConn.raw(sqlStr);
    return datas[0] || [];
};

module.exports = productList;