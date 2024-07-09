var dbConn = require('../../config/db.config');

const MemberList = require('./memberlist.model');
const AgentMain = require('./agentapi/agentmain.model');
const AffManage = require('./affmanage.model');
const PromotionManage = require('./promotionmanage.model');
const TransactionList = require('./transactionlist.model');
const TransactionManage = require('./transactionmanage.model');
const NoticeManage = require('./noticemanage.model');
const AdminSetting = require('./adminsetting.model');

const timerHelper = require('./../modules/timehelper');
const PromotionSetting = require('./promotionsetting.model');
const LineManage = require('./linemanage.model');

const OffsetTime = require('../../config/offsettime');

const offsetTime = OffsetTime.offsetTime;
const offsetTime24hrs = OffsetTime.offsetTime24hrs;

var CreditManage = function() {

};

CreditManage.deposit = async function(amount, userdata, transactiondata, admin_bank_system, am_bank, dtime = new Date(), fromexecute = false, result) {

    let bonus = 0;
    let turnover = 0;
    let total_deposit_credit = 0;
    let promotion_cal = [];
    
    let aff = {
        aff_user:null,
        aff_user_credit:0,
    };
    
    let credit = parseFloat(transactiondata.credit);
    if (admin_bank_system == "CODEFREE") {
        let tmp_codefree_setting = PromotionSetting.getPromotionByType("codefree");
        userdata.accept_promotion = tmp_codefree_setting.id;

        promotion_cal = PromotionManage.calPromotion(userdata, credit, fromexecute);
        bonus = promotion_cal['bonus'] ? promotion_cal['bonus'] : 0;
        turnover = promotion_cal['turnover'] ? promotion_cal['turnover'] : 0;
        total_deposit_credit = promotion_cal['total_deposit_credit'] ? parseFloat(promotion_cal['total_deposit_credit']) : credit;
    } else {
        //start promotion
        promotion_cal = PromotionManage.calPromotion(userdata, credit, fromexecute);
        bonus = 0;
        turnover = 0;
        //bonus = promotion_cal['bonus'] ? promotion_cal['bonus'] : 0;        
        //turnover = promotion_cal['turnover'] ? promotion_cal['turnover'] : 0;
        //total_deposit_credit = promotion_cal['total_deposit_credit'] ? parseFloat(promotion_cal['total_deposit_credit']) : credit;
        total_deposit_credit = credit;
        //end promotion

        //start affiliate
        aff = await AffManage.calculateAffByUsername(userdata, credit);
        //end  affiliate
    }

    let id = TransactionList.generateRequestID("deposit");
    
    let res = {};
    res = AgentMain.depositCreditByUsername("", userdata.id, credit);

    ////return res
    // id 
    // balance :
    // credit 
    // alias_credit 
    // promotion_id 

    let bank_acc_no = "";
    let bank_name = "";
    if (admin_bank_system == "TW") {
        let sqlStr = " SELECT * FROM bank_info WHERE bank_name='Truewallet' ";
        const row_bank = dbConn.query(sqlStr);
        bank_acc_no = userdata['bank_acc_no'];
        bank_name = row_bank['bank_name'] ? row_bank['bank_name'] : 'Truewallet';
    } else {
        bank_acc_no = userdata['bank_acc_no'];
        bank_name = userdata['bank_name'];
    }

    let cTime = new Date();
        cTime = new Date(cTime.getTime() + (offsetTime));

    if (!res.msgerror) {

        if (promotion_cal['ForCreateTurn']['create_pro']) {
            PromotionManage.createTurn(promotion_cal['ForCreateTurn']);
        }

        console.log("TransactionManage.create DEPOSIT");
        TransactionManage.create(id, userdata, admin_bank_system,
            credit, 0, userdata.credit, userdata.credit + credit, "DEPOSIT", bank_acc_no, bank_name, timerHelper.convertDatetimeToString(transactiondata.datetime), transactiondata.bankdesc ? transactiondata.bankdesc : '', promotion_cal['ForCreateTurn']['promotion_setting']['Title'] ? promotion_cal['ForCreateTurn']['promotion_setting']['Title'] : null, promotion_cal['ForCreateTurn']['promotion_setting']['id'] ? promotion_cal['ForCreateTurn']['promotion_setting']['id'] : null, null, "SYSTEM", 1, timerHelper.convertDatetimeToString(cTime), 0, timerHelper.convertDatetimeToString(dtime), "ฝากเงินโดยระบบอัตโนมัติ", am_bank['bank_acc_number'], am_bank['bank_acc_name'], am_bank['bank_name'], aff['aff_user'], null, aff['aff_user_credit']
        )

        if (bonus != 0) {
            console.log("TransactionManage.create BONUS");
            TransactionManage.create(id+"bonus", userdata, admin_bank_system,
                0, bonus, userdata.credit, userdata.credit + bonus, "BONUS", bank_acc_no, bank_name, timerHelper.convertDatetimeToString(transactiondata.datetime), transactiondata.bankdesc ? transactiondata.bankdesc : '', promotion_cal['ForCreateTurn']['promotion_setting']['Title'] ? promotion_cal['ForCreateTurn']['promotion_setting']['Title'] : null, promotion_cal['ForCreateTurn']['promotion_setting']['id'] ? promotion_cal['ForCreateTurn']['promotion_setting']['id'] : null, null, "SYSTEM", 1, timerHelper.convertDatetimeToString(cTime), 0, timerHelper.convertDatetimeToString(dtime), "โบนัสจากระบบเติมเงินอัตโนมัติ", am_bank['bank_acc_number'], am_bank['bank_acc_name'], am_bank['bank_name'], aff['aff_user'], null, aff['aff_user_credit']
            )
        }

        let nextTurnOver = userdata['turn'] ? userdata['turn'] : 0;
        if (userdata['accept_promotion']!=0) 
        {
            if (userdata['credit'] <= 5) {
                nextTurnOver = 0;
            }    
        }
        
        nextTurnOver += turnover;
        await MemberList.refreshAliasAccount(userdata.id);
        let tmpMember = await MemberList.findByID(userdata.id);
        let newAliasId = tmpMember.alias_id;
        AgentMain.reCreateUser(newAliasId,tmpMember.password);
        
        MemberList.increaseCreditAndTurnOver(userdata.id, total_deposit_credit, nextTurnOver);

        NoticeManage.createAdmin(userdata, 'success', 'เติมเงินสำเร็จ', 'หมายเลขโทรศัพท์: ' + userdata.mobile_no + '<br>เติมเงิน : ' + credit + ' บาท<br>เวลาที่ฝากเงิน: ' + timerHelper.convertDatetimeToString(cTime), '', 1);
        NoticeManage.createMember(userdata, 'success', 'เติมเงินสำเร็จ', 'หมายเลขโทรศัพท์: ' + userdata.mobile_no + '<br>เติมเงิน : ' + credit + ' บาท<br>เวลาที่ฝากเงิน: ' + timerHelper.convertDatetimeToString(cTime), '', 1);
        

        let depositmessage = AdminSetting.findByID("depositmessage");
        if (depositmessage) {
            let tmpFormat = JSON.parse(depositmessage.value);
            if (tmpFormat['dep_textfomrat']) {
                let msgformat = tmpFormat['dep_textfomrat'];
                const tag_value = {
                    "<@userid>": userdata['id'],
                    "<@fullname>": userdata['fullname'],
                    "<@telno>": userdata['mobile_no'],
                    "<@bankaccno>": userdata['bank_acc_no'],
                    "<@bankname>": userdata['bank_name'],
                    "<@amount>": total_deposit_credit,
                    "<@date>": timerHelper.convertDatetimeToString(cTime),
                    "<@approveby>": "SYSTEM",
                };

                for (const [key, value] of Object.entries(tag_value)) {
                    msgformat = msgformat.replaceAll(key, value);
                }

                const lineSetting = AdminSetting.findByID("line_token");
                if (lineSetting) {
                    const token = JSON.parse(lineSetting.value);
                    const line_token = token['Deposit'];

                    let response = "";
                    if (line_token) {
                        response = await LineManage.sendNotify(line_token, msgformat);
                    }
                }
            }
        } else {
            const lineSetting = AdminSetting.findByID("line_token");
            if (lineSetting) {
                const token = JSON.parse(lineSetting.value);
                const line_token = token['Deposit'];

                let msgformat = "";
                msgformat += "═════════════\n";
                msgformat += "🙁 มีรายการแจ้งฝาก 🙁\n";
                msgformat += "โอนจาก : (" + admin_bank + ") \n";
                msgformat += "🥰 ฝากเงิน : " + credit + " บาท 🥰') \n";
                msgformat += "Username : " + userdata['id'] + "\n";
                msgformat += "ชื่อ : " + userdata['fullname'] + "\n";
                msgformat += "เบอร์มือถือ : " + row_user['mobile_no'] + "\n";
                msgformat += "โบนัส : " + bonus + "\n";
                msgformat += "เงินล่าสุดมี " + userdata['credit'] + total_deposit_credit + " บาท \n";
                msgformat += "เงินก่อนหน้ามี " + userdata['credit'] + " บาท \n";
                msgformat += "เลขที่รายการ : " + id + "\n";
                msgformat += "วันที่ : " + timerHelper.convertDatetimeToString(cTime) + "\n";
                msgformat += "═════════════\n";

                let response = "";
                if (line_token) {
                    response = await LineManage.sendNotify(line_token, msgformat);
                }
            }
        }

        const d = {
            'status': 'success',
            'message': 'เพิ่มเงินให้ ' + userdata['id'] + ' จำนวน ' + total_deposit_credit + ' บาท สำเร็จ'
        };

        return d;

    } else {

        let cTime = new Date();
        cTime = new Date(cTime.getTime() + (offsetTime));
        
        console.log("TransactionManage.create DEPERR");

        TransactionManage.create(id, userdata, admin_bank_system,
            credit, 0, 0, 0, "DEPERR", bank_acc_no, bank_name, timerHelper.convertDatetimeToString(transactiondata.datetime), transactiondata.bankdesc ? transactiondata.bankdesc : '', promotion_cal['ForCreateTurn']['promotion_setting']['Title'] ? promotion_cal['ForCreateTurn']['promotion_setting']['Title'] : null, promotion_cal['ForCreateTurn']['promotion_setting']['id'] ? promotion_cal['ForCreateTurn']['promotion_setting']['id'] : null, promotion_cal['ForCreateTurn']['create_pro'] == true ? JSON.stringify(promotion_cal['ForCreateTurn']) : null, null, null, null, 0, timerHelper.convertDatetimeToString(dtime), "ฝากอัติโนมัติผิดพลาด เนื่องจากเอเจนท์มีปัญหา โน๊ต : " + res.msgerror, am_bank['bank_acc_number'], am_bank['bank_acc_name'], am_bank['bank_name'], aff['aff_user'], null, aff['aff_user_credit']
        )

        NoticeManage.createAdmin(userdata, 'error', 'ฝากผิดพลาด', 'รอการยืนยันจากแอดมิน <br> จำนวน : ' + total_deposit_credit + ' บาท', '', 1);
        NoticeManage.createMember(userdata, 'error', 'ฝากผิดพลาด', 'รอการยืนยันจากแอดมิน <br> จำนวน : ' + total_deposit_credit + ' บาท', '', 1);

        

        let depositmessage = AdminSetting.findByID("depositmessage");
        if (depositmessage) {
            let tmpFormat = JSON.parse(depositmessage.value);
            if (tmpFormat['dep_textfomrat']) {
                let msgformat = tmpFormat['dep_textfomrat'];
                const tag_value = {
                    "<@userid>": userdata['id'],
                    "<@fullname>": userdata['fullname'],
                    "<@telno>": userdata['mobile_no'],
                    "<@bankaccno>": userdata['bank_acc_no'],
                    "<@bankname>": userdata['bank_name'],
                    "<@amount>": total_deposit_credit,
                    "<@date>": timerHelper.convertDatetimeToString(cTime),
                    "<@approveby>": "SYSTEM",
                };

                for (const [key, value] of Object.entries(tag_value)) {
                    msgformat = msgformat.replaceAll(key, value);
                }

                const lineSetting = AdminSetting.findByID("line_token");
                if (lineSetting) {
                    const token = JSON.parse(lineSetting.value);
                    const line_token = token['Deposit'];

                    let response = "";
                    if (line_token) {
                        response = await LineManage.sendNotify(line_token, msgformat);
                    }
                }

            }
        } else {
            const lineSetting = AdminSetting.findByID("line_token");
            if (lineSetting) {
                const token = JSON.parse(lineSetting.value);
                const line_token = token['Deposit'];

                let msgformat = "";
                msgformat += "";
                msgformat += ' ฝากไม่สำเร็จ : ' + total_deposit_credit + ' บาท';
                msgformat += 'BANKID : ' + userdata['bank_acc_no'];
                msgformat += 'Username : ' + userdata['id'];
                msgformat += 'เบอร์มือถือ : ' + userdata['mobile_no'];
                msgformat += 'วันที่ : ' + timerHelper.convertDatetimeToString(cTime);
                msgformat += "รายละเอียด : " + res.msgerror;
                msgformat += 'เลขที่รายการ : ' + id;

                let response = "";
                if (line_token) {
                    response = await LineManage.sendNotify(line_token, msgformat);
                }
            }
        }

        const d = {
            'status': 'error',
            'message': 'มีบางอย่างผิดพลาด Msg : ' + res.msgerror
        };

        return d;

    }
}

CreditManage.depositError = async function(amount, transactiondata, admin_bank_system, am_bank, note, dtime = new Date(), result) {

    let sqlStr = "Select *  ";
    sqlStr += " FROM key_check ";
    const dataKeyCheck = dbConn.query(sqlStr);

    let id = TransactionList.generateRequestID("depositnull");
    let userdata = {
        parent: dataKeyCheck[0].parent,
        agent: null,
        id: null,
        mobile_no: null,
        bank_acc_no: null,
        bank_name: null,
        fullname: null,
    }

    let bank_acc_no = "";
    let bank_name = "";
    if (admin_bank_system == "TW") {
        let sqlStr = " SELECT * FROM bank_info WHERE bank_name='Truewallet' ";
        const row_bank = dbConn.query(sqlStr);
        bank_acc_no = transactiondata['acc'];
        bank_name = row_bank['bank_name'] ? row_bank['bank_name'] : 'Truewallet';
    } else {
        bank_acc_no = transactiondata['acc'];
        bank_name = transactiondata['bank_name'];
    }

    // console.log(bank_acc_no);

    let credit = transactiondata.credit;

    let transResult = TransactionManage.create(id, userdata, admin_bank_system,
        credit, 0, 0, 0, "DEPNL"
        , bank_acc_no, bank_name, timerHelper.convertDatetimeToString(transactiondata.datetime)
        , transactiondata.bankdesc ? transactiondata.bankdesc : ''
        , null, null, null, null, null, null, 0
        , timerHelper.convertDatetimeToString(dtime)
        , note
        , am_bank['bank_acc_number'], am_bank['bank_acc_name'], am_bank['bank_name']
        , null, null, 0
    )

    if (transResult['affectedRows']) {
        //Success    
        const lineSetting = AdminSetting.findByID("line_token");
        if (lineSetting) {
            const token = JSON.parse(lineSetting.value);
            const line_token = token['Deposit'];

            let msgformat = "";
            msgformat += "";
            msgformat += ' ฝากไม่สำเร็จ : ' + credit + ' บาท';
            msgformat += 'BANKID : ' + userdata['bank_acc_no'];
            msgformat += 'Username : ' + userdata['id'];
            msgformat += 'เบอร์มือถือ : ' + userdata['mobile_no'];
            msgformat += 'วันที่ : ' + timerHelper.getDateNowString();
            msgformat += "รายละเอียด : ไม่เจอสมาชิก";
            msgformat += "รายละเอียดธนาคาร : " + transactiondata.bankdesc;
            msgformat += 'เลขที่รายการ : ' + id;

            let response = "";
            if (line_token) {
                response = await LineManage.sendNotify(line_token, msgformat);
            }
        }

        return {
            "status": 'success',
            "message": "Ok"
        };
    } else {
        return {
            "status": 'error',
            "message": "ไม่สามารถสร้างข้อมูลได้"
        };
    }


}

CreditManage.depositMin = async function(amount, userdata, transactiondata, admin_bank_system,am_bank,note,dtime = new Date(), result) {

    let sqlStr = "Select *  ";
    sqlStr += " FROM key_check ";
    const dataKeyCheck = dbConn.query(sqlStr);

    let id = TransactionList.generateRequestID("deposit");
   
    let bank_acc_no = "";
    let bank_name = "";
    if (admin_bank_system == "TW") {
        let sqlStr = " SELECT * FROM bank_info WHERE bank_name='Truewallet' ";
        const row_bank = dbConn.query(sqlStr);
        bank_acc_no = userdata['bank_acc_no'];
        bank_name = row_bank['bank_name'] ? row_bank['bank_name'] : 'Truewallet';
    } else {
        bank_acc_no = userdata['bank_acc_no'];
        bank_name = userdata['bank_name'];
    }

    let credit = transactiondata.credit;

    let transResult = TransactionManage.create(id, userdata, admin_bank_system,
        credit, 0, userdata.credit, userdata.credit, "DEPMIN", bank_acc_no, bank_name
        , timerHelper.convertDatetimeToString(transactiondata.datetime)
        , transactiondata.bankdesc ? transactiondata.bankdesc : ''
        , null, null, null, null, null, null
        , 0, timerHelper.convertDatetimeToString(dtime), note
        , am_bank['bank_acc_number'], am_bank['bank_acc_name'], am_bank['bank_name']
        , null, null, 0
    )

    if (transResult['affectedRows']) {
        //Success    
        const lineSetting = AdminSetting.findByID("line_token");
        if (lineSetting) {
            const token = JSON.parse(lineSetting.value);
            const line_token = token['Deposit'];

            let msgformat = "";
            msgformat += "";
            msgformat += ' ฝากไม่สำเร็จ : ' + credit + ' บาท'+"\n";
            msgformat += 'BANKID : ' + userdata['bank_acc_no']+"\n";
            msgformat += 'Username : ' + userdata['id']+"\n";
            msgformat += 'เบอร์มือถือ : ' + userdata['mobile_no']+"\n";
            msgformat += 'วันที่ : ' + timerHelper.getDateNowString()+"\n";
            msgformat += "รายละเอียด : ฝากไม่ถึงขั้นต่ำ "+"\n";
            msgformat += 'เลขที่รายการ : ' + id+"\n";

            let response = "";
            if (line_token) {
                response = await LineManage.sendNotify(line_token, msgformat);
            }
        }

        return {
            "status": 'success',
            "message": "Ok"
        };
    } else {
        return {
            "status": 'error',
            "message": "ไม่สามารถสร้างข้อมูลได้"
        };
    }

}

CreditManage.depositMany = async function(amount, transactiondata, admin_bank_system,am_bank,note,manyuser,dtime = new Date(), result) {

    let sqlStr = "Select *  ";
    sqlStr += " FROM key_check ";
    const dataKeyCheck = dbConn.query(sqlStr);

    let id = TransactionList.generateRequestID("deposit");
    let userdata = {
        parent: dataKeyCheck[0].parent,
        agent: null,
        id: null,
        mobile_no: null,
        bank_acc_no: null,
        bank_name: null,
        fullname:null,
    }

    let manyUser = [];
    manyuser.forEach(element => {
        manyUser.push({
            username : element.id,
            mobile_no : element.mobile_no
         });
    });

    let bank_acc_no = "";
    let bank_name = "";

    let credit = transactiondata.credit;

    let transResult = TransactionManage.create(id, userdata, admin_bank_system,
        credit, 0, 0, 0, "DEPMAN", bank_acc_no
        , bank_name, timerHelper.convertDatetimeToString(transactiondata.datetime)
        , transactiondata.bankdesc ? transactiondata.bankdesc : ''
        , null, null, null, null, null, null, 0
        , timerHelper.convertDatetimeToString(dtime)    
        , note, am_bank['bank_acc_number'], am_bank['bank_acc_name'], am_bank['bank_name']
        , null, null, 0, JSON.stringify(manyUser)
    );

    if (transResult['affectedRows']) {
        //Success    
        const lineSetting = AdminSetting.findByID("line_token");
        if (lineSetting) {
            const token = JSON.parse(lineSetting.value);
            const line_token = token['Deposit'];

            let msgformat = "";
            msgformat += "";
            msgformat += ' ฝากไม่สำเร็จ : ' + credit + ' บาท \n';          
            msgformat += 'วันที่ : ' + timerHelper.getDateNowString() +"\n";
            msgformat += "รายละเอียด : เจอสมาชิกมากกว่าหนึ่งคน \n" ;
            msgformat += "ลิสต์สมาชิก : "+JSON.stringify(manyUser) +"\n";
            msgformat += 'เลขที่รายการ : ' + id+"\n";

            let response = "";
            if (line_token) {
                response = await LineManage.sendNotify(line_token, msgformat);
            }
        }

        return {
            "status": 'success',
            "message": "Ok"
        };
    } else {
        return {
            "status": 'error',
            "message": "ไม่สามารถสร้างข้อมูลได้"
        };
    }
}

module.exports = CreditManage;