'use strict';

var dbConn = require('../../config/db.config');
const Secret = require('../../config/secret');

const jwt = require('jsonwebtoken');
const timerHelper = require('../modules/timehelper');
const tableName = 'loan_list'
const tableKey = 'id'

const OffsetTime = require('../../config/offsettime');
const { update } = require('./main.model');

const offsetTime = OffsetTime.offsetTime;
const offsetTime24hrs = OffsetTime.offsetTime24hrs;

//User object create
var LoanList = function(userlist) {
    
};

LoanList.create = async function(newData, result) {    
    try {
        const datas = await dbConn.raw("INSERT INTO " + tableName + " ("
            +"member_id,"
            +"loan_amount,"
            +"create_by,"
            +"create_at,"
            +"owner_admin_id,"

            +"staff_id,"
            +"interest_name,"
            +"period_unit_id,"
            +"collateral_type_id,"
            +"period_number,"

            +"approved,"
            +"approve_by,"
            +"closed,"
            +"close_by,"
            +"approve_note,"

            +"close_note,"
            +"remain_loan,"
            +"remain_interest,"
            +"remain_fine,"
            

            +"number_over_due,"
            +"collateral_img1,"
            +"collateral_img2,"
            +"collateral_img3,"
            +"collateral_img4,"

            +"update_by,"
            +"update_date,"
            +"loan_longtime_number,"
            +"interest"
            +"effective_rate"
            
            + ")VALUES(?,?,?,?,? ,?,?,?,?,? ,?,?,?,?,? ,?,?,?,? ,?,?,?,?,? ,?,?,?,?,?) "
        , [
            newData.member_id,
            newData.loan_amount,
            newData.create_by,
            newData.create_at,
            newData.owner_admin_id,

            newData.staff_id,
            newData.interest_name,
            newData.period_unit_id,
            newData.collateral_type_id,
            newData.period_number,

            newData.approved,
            newData.approve_by,
            newData.closed,
            newData.close_by,
            newData.approve_note,

            newData.close_note,
            newData.remain_loan,
            newData.remain_interest,
            newData.remain_fine,
            
            newData.number_over_due,
            newData.collateral_img1,
            newData.collateral_img2,
            newData.collateral_img3,
            newData.collateral_img4,

            newData.update_by,
            newData.update_date,
            newData.loan_longtime_number,
            newData.interest,
            newData.effective_rate

        ]);    
        return true;
    } catch (error) {
        console.log(error);
        return false;
        
    }
    
};

LoanList.updateById = async function(updateData, result) {    
    try {
        const datas = await dbConn.raw("UPDATE " + tableName + " set "            
            +"loan_amount=?,"
            +"create_by=?,"
            +"create_at=?,"
            +"owner_admin_id=?,"

            +"staff_id=?,"
            +"interest_name=?,"
            +"period_unit_id=?,"
            +"collateral_type_id=?,"
            +"period_number=?,"

            +"approved=?,"
            +"approve_by=?,"
            +"closed=?,"
            +"close_by=?,"
            +"approve_note=?,"

            +"close_note=?,"
            +"remain_loan=?,"
            +"remain_interest=?,"
            +"remain_fine=?,"
            

            +"number_over_due=?,"
            +"collateral_img1=?,"
            +"collateral_img2=?,"
            +"collateral_img3=?,"
            +"collateral_img4=?,"

            +"update_by=?,"
            +"update_date=?"

            +" WHERE id=?"
        , [            
            updateData.loan_amount,
            updateData.create_by,
            updateData.create_at,
            updateData.owner_admin_id,

            updateData.staff_id,
            updateData.interest_name,
            updateData.period_unit_id,
            updateData.collateral_type_id,
            updateData.period_number,

            updateData.approved,
            updateData.approve_by,
            updateData.closed,
            updateData.close_by,
            updateData.approve_note,

            updateData.close_note,
            updateData.remain_loan,
            updateData.remain_interest,
            updateData.remain_fine,
            
            updateData.number_over_due,
            updateData.collateral_img1,
            updateData.collateral_img2,
            updateData.collateral_img3,
            updateData.collateral_img4,

            updateData.update_by,
            updateData.update_date,

            updateData.id

        ]);    
        return true;
    } catch (error) {
        console.log(error);
        return false;
        
    }
    
};

LoanList.approveById = async function(updateData, result) {    
    try {
        const datas = await dbConn.raw("UPDATE " + tableName + " set "                        
            +"approved=?,"
            +"approve_by=?,"            
            +"approve_note=?,"
            +"approve_at=?,"
            
            +"update_by=?,"
            +"update_date=?"

            +" WHERE id=?"
        , [ 
            updateData.approved,
            updateData.approve_by,            
            updateData.approve_note,
            updateData.approve_at,

            updateData.update_by,
            updateData.update_date,

            updateData.id

        ]);    
        return true;
    } catch (error) {
        console.log(error);
        return false;
        
    }
};

LoanList.rejectById = async function(updateData, result) {    
    try {
        const datas = await dbConn.raw("UPDATE " + tableName + " set "                        
            +"rejected=?,"
            +"reject_by=?,"            
            +"reject_note=?,"
            +"reject_at=?,"
            
            +"update_by=?,"
            +"update_date=?"

            +" WHERE id=?"
        , [ 
            updateData.rejected,
            updateData.reject_by,            
            updateData.reject_note,
            updateData.reject_at,
            
            updateData.update_by,
            updateData.update_date,

            updateData.id

        ]);    
        return true;
    } catch (error) {
        console.log(error);
        return false;
        
    }
};

LoanList.closeById = async function(updateData, result) {    
    try {
        const datas = await dbConn.raw("UPDATE " + tableName + " set "                        
            +"closed=?,"
            +"close_by=?,"            
            +"close_note=?,"
            +"close_at=?,"
            
            +"update_by=?,"
            +"update_date=?"

            +" WHERE id=?"
        , [ 
            updateData.closed,
            updateData.close_by,            
            updateData.close_note,
            updateData.close_at,
            
            updateData.update_by,
            updateData.update_date,

            updateData.id

        ]);    
        return true;
    } catch (error) {
        console.log(error);
        return false;
        
    }
};

LoanList.updateRemainById = async function(updateData, result) {    
    try {
        const datas = await dbConn.raw("UPDATE " + tableName + " set "                        
            +"remain_loan=?,"
            +"remain_interest=?,"            
            +"remain_fine=?,"            
            
            +"update_by=?,"
            +"update_date=?"

            +" WHERE id=?"
        , [ 
            updateData.remain_loan,
            updateData.remain_interest,            
            updateData.remain_fine,
            
            updateData.update_by,
            updateData.update_date,

            updateData.id

        ]);    
        return true;
    } catch (error) {
        console.log(error);
        return false;
        
    }
};

LoanList.updateOverDueDueById = async function(updateData, result) {    
    try {
        const datas = await dbConn.raw("UPDATE " + tableName + " set "                        
            +"number_over_due=?,"                    
            
            +"update_by=?,"
            +"update_date=?"

            +" WHERE id=?"
        , [ 
            updateData.number_over_due,            
            
            updateData.update_by,
            updateData.update_date,

            updateData.id

        ]);    
        return true;
    } catch (error) {
        console.log(error);
        return false;
        
    }
};

LoanList.updateCollateralImgById = async function(updateData, result) {    
    try {
        const datas = await dbConn.raw("UPDATE " + tableName + " set "                        
            +"collateral_img1=?,"
            +"collateral_img2=?,"            
            +"collateral_img3=?,"            
            +"collateral_img4=?,"            
            
            +"update_by=?,"
            +"update_date=?"

            +" WHERE id=?"
        , [ 
            updateData.collateral_img1,
            updateData.collateral_img2,            
            updateData.collateral_img3,
            updateData.collateral_img4,
            
            updateData.update_by,
            updateData.update_date,

            updateData.id

        ]);    
        return true;
    } catch (error) {
        console.log(error);
        return false;
        
    }
};

LoanList.findAll = async function(result) {   
    try {        
        const datas = await dbConn.raw("Select *,"+tableName+".id as loan_list_id from " + tableName  );    
        return datas[0];
    } catch (error) {
        console.log(error);
        return null;
    }    
};

LoanList.findById = async function(id, result) {   
    try {        
        const datas = await dbConn.raw("Select *,"+tableName+".id as loan_list_id from " + tableName + " LEFT JOIN sl_users ON sl_users.id="+tableName+".member_id WHERE "+tableName+"."+ tableKey + " = ?", [id]);    
        return datas[0][0];
    } catch (error) {
        console.log(error);
        return null;
    }    
};

LoanList.findByOwnerId = async function(ownerId, result) {   
    try {        
        const datas = await dbConn.raw("Select * from " + tableName + " LEFT JOIN sl_users ON sl_users.id="+tableName+".member_id WHERE owner_admin_id = ?", [ownerId]);    
        return datas[0][0];
    } catch (error) {
        console.log(error);
        return null;
    }    
};

LoanList.findByStaffId = async function(staffId, result) {   
    try {        
        const datas = await dbConn.raw("Select * from " + tableName + " LEFT JOIN sl_users ON sl_users.id="+tableName+".member_id WHERE staffId = ?", [staffId]);    
        return datas[0][0];
    } catch (error) {
        console.log(error);
        return null;
    }    
};

LoanList.findByAdminId = async function(searchWord, result) {   
    try {        
        const datas = await dbConn.raw("Select * from " + tableName + " LEFT JOIN sl_users ON sl_users.id="+tableName+".member_id WHERE 1=1 AND "+searchWord+" order by create_at limit 0 , 1000" );    
        return datas[0][0];
    } catch (error) {
        console.log(error);
        return [];
    }    
};

LoanList.createPayment = async function(newData, result) {    
    try {
        const datas = await dbConn.raw("INSERT INTO loan_payment ("
            +"loan_id,"
            +"principle_amount,"
            +"interest_amount,"
            +"total_amount,"
            +"due_date,"

            +"paid_at,"
            +"create_at,"            
            +"paid,"
            +"fine_amount"

            + ")VALUES(?,?,?,?,? ,?,?,?,? ) "
        , [
            newData.loan_id,
            newData.principle_amount,
            newData.interest_amount,
            newData.total_amount,
            newData.due_date,

            newData.paid_date,
            newData.create_date,            
            newData.paid,
            newData.fine_amount,

        ]);    
        return true;
    } catch (error) {
        console.log(error);
        return false;
        
    }
};

LoanList.updatePaidPayment = async function(newData, result) {   

    try {
        const datas = await dbConn.raw("UPDATE loan_payment set "                        
            +"paid=?,"
            +"fine_amount=?,"            
            +"total_received_amount=?,"            
            +"note1=?,"
            +"note1_by=?,"
            +"note1_at=?,"
            +"received_by=?"
            +"paid_date=?"
            
            +" WHERE id=?"
        , [ 
            updateData.paid,
            updateData.fine_amount,            
            updateData.total_received_amount,                        
            updateData.note1,
            updateData.note1_by,
            updateData.note1_at,
            updateData.received_by,
            updateData.paid_date,

            updateData.id

        ]);    
        return true;
    } catch (error) {
        console.log(error);
        return false;
        
    }
};

LoanList.updateNote2Payment = async function(newData, result) {   

    try {
        const datas = await dbConn.raw("UPDATE loan_payment set "                                    
            +"note2=?,"
            +"note2_by=?,"
            +"note2_at=?,"
            
            +" WHERE id=?"
        , [ 
            updateData.note2,
            updateData.note2_by,            
            updateData.note2_at,                        
            
            updateData.id

        ]);    
        return true;
    } catch (error) {
        console.log(error);
        return false;
        
    }
};

LoanList.updateNote3Payment = async function(newData, result) {   

    try {
        const datas = await dbConn.raw("UPDATE loan_payment set "                                    
            +"note3=?,"
            +"note3_by=?,"
            +"note3_at=?,"
            
            +" WHERE id=?"
        , [ 
            updateData.note3,
            updateData.note3_by,            
            updateData.note3_at,                        
            
            updateData.id

        ]);    
        return true;
    } catch (error) {
        console.log(error);
        return false;
        
    }
};

LoanList.updateRefImg1Payment = async function(newData, result) {   

    try {
        const datas = await dbConn.raw("UPDATE loan_payment set "                                    
            +"ref_img1=?,"
            +"ref_img1_by=?,"
            +"ref_img1_at=?,"
            
            +" WHERE id=?"
        , [ 
            updateData.ref_img1,
            updateData.ref_img1_by,            
            updateData.ref_img1_at,                        
            
            updateData.id

        ]);    
        return true;
    } catch (error) {
        console.log(error);
        return false;
        
    }
};

LoanList.updateRefImg2Payment = async function(newData, result) {   

    try {
        const datas = await dbConn.raw("UPDATE loan_payment set "                                    
            +"ref_img2=?,"
            +"ref_img2_by=?,"
            +"ref_img2_at=?,"
            
            +" WHERE id=?"
        , [ 
            updateData.ref_img2,
            updateData.ref_img2_by,            
            updateData.ref_img2_at,                        
            
            updateData.id

        ]);    
        return true;
    } catch (error) {
        console.log(error);
        return false;
        
    }
};

LoanList.updateRefImg3Payment = async function(newData, result) {   

    try {
        const datas = await dbConn.raw("UPDATE loan_payment set "                                    
            +"ref_img3=?,"
            +"ref_img3_by=?,"
            +"ref_img3_at=?,"
            
            +" WHERE id=?"
        , [ 
            updateData.ref_img3,
            updateData.ref_img3_by,            
            updateData.ref_img3_at,                        
            
            updateData.id

        ]);    
        return true;
    } catch (error) {
        console.log(error);
        return false;
        
    }
};

LoanList.updateRefImg4Payment = async function(newData, result) {   

    try {
        const datas = await dbConn.raw("UPDATE loan_payment set "                                    
            +"ref_img4=?,"
            +"ref_img4_by=?,"
            +"ref_img4_at=?,"
            
            +" WHERE id=?"
        , [ 
            updateData.ref_img4,
            updateData.ref_img4_by,            
            updateData.ref_img4_at,                        
            
            updateData.id

        ]);    
        return true;
    } catch (error) {
        console.log(error);
        return false;
        
    }
};

LoanList.calculateInterest = async function(loan_amount,interest,interestpernumber,loan_longtime_number,effective_rate,period_id,cal_every_number,loan_start_at)
{
    try {
        const tmploanStartAt = loan_start_at;
    
        let tmpDate = new Date(tmploanStartAt);    
        tmpDate.setDate(tmpDate.getDate());

        const maximunRound = 712;

        let tmpPayment = [];

        if (period_id==1) {
            //รายวัน

            let tmpEndDate = new Date(tmpDate);        
            tmpEndDate.setDate(tmpEndDate.getDate() + loan_longtime_number);       
            tmpDate.setDate(tmpDate.getDate() - cal_every_number); 
            
            let index=0;
            while(
                tmpDate.getTime() < tmpEndDate.getTime() 
                && 
                index <maximunRound)
            {               
                tmpDate.setDate(tmpDate.getDate() + cal_every_number);
                
                tmpPayment.push(
                    {
                        payment_date : new Date(tmpDate),
                        payment_amount : 0,
                        principle_amount :0,
                        interest_amount : 0,
                    }
                );

                index++;
            }

            const principlePaymentPerTimes = parseFloat((loan_amount / tmpPayment.length).toFixed(2));
            let remainPrinciple = loan_amount;

            if (effective_rate==1) {
                index=0;
                while (index < tmpPayment.length && remainPrinciple>0) 
                {
                    let interestAmount = parseFloat((remainPrinciple * interest *cal_every_number/ 100).toFixed(2));                    
                    
                    if (remainPrinciple<=principlePaymentPerTimes) {
                        tmpPayment[index]['principle_amount'] = remainPrinciple;
                        remainPrinciple -= remainPrinciple;
                    }
                    else
                    {
                        tmpPayment[index]['principle_amount'] = principlePaymentPerTimes;
                        remainPrinciple -= principlePaymentPerTimes;
                    }            
                    tmpPayment[index]['interest_amount'] = interestAmount;
                    tmpPayment[index]['payment_amount'] = tmpPayment[index]['principle_amount']+tmpPayment[index]['interest_amount'];

                    index++;
                }
            }
            else
            {                   
                let totalInterestAmount = parseFloat((remainPrinciple * interest *loan_longtime_number / 100  ).toFixed(2));
                if (interestpernumber>loan_longtime_number) {
                    totalInterestAmount = parseFloat((remainPrinciple * interest *interestpernumber / 100  ).toFixed(2));
                }

                index=0;
                while (index < tmpPayment.length && remainPrinciple>0) 
                {
                                        
                    if (remainPrinciple<=principlePaymentPerTimes) {
                        tmpPayment[index]['principle_amount'] = remainPrinciple;
                        remainPrinciple -= remainPrinciple;
                    }
                    else
                    {
                        tmpPayment[index]['principle_amount'] = principlePaymentPerTimes;
                        remainPrinciple -= principlePaymentPerTimes;
                    }            
                    tmpPayment[index]['interest_amount'] = totalInterestAmount/tmpPayment.length;
                    tmpPayment[index]['payment_amount'] = tmpPayment[index]['principle_amount']+tmpPayment[index]['interest_amount'];

                    index++;
                }

            }
            
            return tmpPayment

        }
        else if(period_id==2)
        {
            //รายเดือน
            let tmpEndDate = new Date(tmpDate);        
            tmpEndDate.setMonth(tmpEndDate.getMonth() + loan_longtime_number);  
            tmpDate.setMonth(tmpDate.getMonth() - cal_every_number);       
            let index=0;
            while(
                tmpDate.getTime() < tmpEndDate.getTime() 
                && 
                index <maximunRound)
            {               
                tmpDate.setMonth(tmpDate.getMonth() + cal_every_number);
                
                tmpPayment.push(
                    {
                        payment_date : new Date(tmpDate),
                        payment_amount : 0,
                        principle_amount :0,
                        interest_amount : 0,
                    }
                );

                index++;
            }

            const principlePaymentPerTimes = parseFloat((loan_amount / tmpPayment.length).toFixed(2));
            let remainPrinciple = loan_amount;

            if (effective_rate==1) {
                index=0;
                while (index < tmpPayment.length && remainPrinciple>0) 
                {
                    const interestAmount = parseFloat((remainPrinciple * interest * cal_every_number / 100).toFixed(2));
                    
                    if (remainPrinciple<=principlePaymentPerTimes) {
                        tmpPayment[index]['principle_amount'] = remainPrinciple;
                        remainPrinciple -= remainPrinciple;
                    }
                    else
                    {
                        tmpPayment[index]['principle_amount'] = principlePaymentPerTimes;
                        remainPrinciple -= principlePaymentPerTimes;
                    }            
                    tmpPayment[index]['interest_amount'] = interestAmount;
                    tmpPayment[index]['payment_amount'] = tmpPayment[index]['principle_amount']+tmpPayment[index]['interest_amount'];

                    index++;
                }
            }
            else
            {                
                let totalInterestAmount = parseFloat((remainPrinciple * interest *loan_longtime_number / 100  ).toFixed(2));
                if (interestpernumber>loan_longtime_number) {
                    totalInterestAmount = parseFloat((remainPrinciple * interest *interestpernumber / 100  ).toFixed(2));
                }
                index=0;
                while (index < tmpPayment.length && remainPrinciple>0) 
                {
                                        
                    if (remainPrinciple<=principlePaymentPerTimes) {
                        tmpPayment[index]['principle_amount'] = remainPrinciple;
                        remainPrinciple -= remainPrinciple;
                    }
                    else
                    {
                        tmpPayment[index]['principle_amount'] = principlePaymentPerTimes;
                        remainPrinciple -= principlePaymentPerTimes;
                    }            
                    tmpPayment[index]['interest_amount'] = totalInterestAmount/tmpPayment.length;
                    tmpPayment[index]['payment_amount'] = tmpPayment[index]['principle_amount']+tmpPayment[index]['interest_amount'];

                    index++;
                }

            }
            
            return tmpPayment
        }
        else(period_id==3)
        {
            //รายปี
            let tmpEndDate = new Date(tmpDate);        
            tmpEndDate.setFullYear(tmpEndDate.getFullYear() + loan_longtime_number);       
            tmpDate.setFullYear(tmpDate.getFullYear() - cal_every_number);        
            let index=0;
            while(
                tmpDate.getTime() < tmpEndDate.getTime() 
                && 
                index <maximunRound)
            {               
                tmpDate.setFullYear(tmpDate.getFullYear() + cal_every_number);
                
                tmpPayment.push(
                    {
                        payment_date : new Date(tmpDate),
                        payment_amount : 0,
                        principle_amount :0,
                        interest_amount : 0,
                    }
                );

                index++;
            }

            const principlePaymentPerTimes = parseFloat((loan_amount / tmpPayment.length).toFixed(2));
            let remainPrinciple = loan_amount;

            if (effective_rate==1) {
                index=0;
                while (index < tmpPayment.length && remainPrinciple>0) 
                {
                    const interestAmount = parseFloat((remainPrinciple * interest *cal_every_number / 100).toFixed(2));
                    
                    if (remainPrinciple<=principlePaymentPerTimes) {
                        tmpPayment[index]['principle_amount'] = remainPrinciple;
                        remainPrinciple -= remainPrinciple;
                    }
                    else
                    {
                        tmpPayment[index]['principle_amount'] = principlePaymentPerTimes;
                        remainPrinciple -= principlePaymentPerTimes;
                    }            
                    tmpPayment[index]['interest_amount'] = interestAmount;
                    tmpPayment[index]['payment_amount'] = tmpPayment[index]['principle_amount']+tmpPayment[index]['interest_amount'];

                    index++;
                }
            }
            else
            {   
                let totalInterestAmount = parseFloat((remainPrinciple * interest *loan_longtime_number / 100  ).toFixed(2));
                if (interestpernumber>loan_longtime_number) {
                    totalInterestAmount = parseFloat((remainPrinciple * interest *interestpernumber / 100  ).toFixed(2));
                }

                index=0;
                while (index < tmpPayment.length && remainPrinciple>0) 
                {
                                        
                    if (remainPrinciple<=principlePaymentPerTimes) {
                        tmpPayment[index]['principle_amount'] = remainPrinciple;
                        remainPrinciple -= remainPrinciple;
                    }
                    else
                    {
                        tmpPayment[index]['principle_amount'] = principlePaymentPerTimes;
                        remainPrinciple -= principlePaymentPerTimes;
                    }            
                    tmpPayment[index]['interest_amount'] = totalInterestAmount/tmpPayment.length;
                    tmpPayment[index]['payment_amount'] = tmpPayment[index]['principle_amount']+tmpPayment[index]['interest_amount'];

                    index++;
                }

            }
            
            return tmpPayment
        }
    } catch (error) {        
        console.log(error);
        return {errorMessage : error.message};
    }
    

}

LoanList.requestLoan = async function(member_id,admin_id,owner_admin_id,interest_name,loan_amount,collateral_type_id,interest,interestper,loan_longtime_number,effective_rate,period_id,cal_every_number,loan_start_at,collateral_img1,collateral_img2,collateral_img3,collateral_img4,paymentList,result)
{
    try {

        let cTime = new Date();
        cTime = new Date(cTime.getTime() + (offsetTime));

        const sumInterestAmount = paymentList.reduce((accumulator, x) => accumulator + x.interest_amount, 0);
        const remain_fine = 0;
        const remain_loan = loan_amount;
        
        

        await dbConn.transaction(async (trx) => {

            // Your raw query using trx.raw
            const rawQuery = `INSERT INTO loan_list 
            (
                member_id, loan_amount, create_by, create_at,
                owner_admin_id,interest_name,period_unit_id,collateral_type_id,
                period_number,remain_loan,remain_interest,remain_fine,update_by,update_date,
                loan_longtime_number,interest,interestper,effective_rate,loan_start_at,
                collateral_img1,collateral_img2,collateral_img3,collateral_img4
            ) 
            VALUES (
                ?,?,?,?,
                ?,?,?,?,
                ?,?,?,?,?,?,
                ?,?,?,?,?,
                ?,?,?,?
            )
            `;
            const bindings = [
                member_id, loan_amount, admin_id, timerHelper.convertDatetimeToStringNoT(cTime),
                owner_admin_id,interest_name,period_id,collateral_type_id,
                cal_every_number,remain_loan,sumInterestAmount,remain_fine,admin_id,timerHelper.convertDatetimeToStringNoT(cTime),
                loan_longtime_number,interest,interestper,effective_rate,loan_start_at,
                collateral_img1,collateral_img2,collateral_img3,collateral_img4
            ];

            let dataLoanList = await trx.raw(rawQuery, bindings);

            const loan_id = dataLoanList[0].insertId;

            let rawQuery2 = `INSERT INTO loan_payment 
            (
                loan_id,principle_amount,interest_amount,total_amount,due_date,create_at
            )
            VALUES             
            `

            let bindings2 = [];
            for (let index = 0; index < paymentList.length; index++) {
                const element = paymentList[index];
                let tmpValue = "";
                if (index==paymentList.length-1) 
                {
                    tmpValue = `(${loan_id},?,?,?,?,'${timerHelper.convertDatetimeToStringNoT(cTime)}');`
                    bindings2.push(element.principle_amount, element.interest_amount, element.payment_amount,timerHelper.convertDatetimeToStringNoT(element.payment_date) );
                }
                else
                {
                    tmpValue = `(${loan_id},?,?,?,?,'${timerHelper.convertDatetimeToStringNoT(cTime)}'),`
                    bindings2.push(element.principle_amount, element.interest_amount, element.payment_amount,timerHelper.convertDatetimeToStringNoT(element.payment_date) );
                }
                rawQuery2+=tmpValue;
            }

            let dataLoanPayment = await trx.raw(rawQuery2, bindings2);
            
        });
    
        return true;
    } catch (error) {
        console.error(error);
        return {errorMessage : error.message};
    }
}

LoanList.getRequestLoan = async function(member_id)
{

    try {        

        let sqlStr = "Select "+tableName+".*,interest_period_list.period_name,loan_collateral_type.collateral_name";     
        sqlStr += " From " + tableName;   
        sqlStr += " LEFT JOIN interest_period_list ON interest_period_list.id="+tableName+".period_unit_id";
        sqlStr += " LEFT JOIN loan_collateral_type ON loan_collateral_type.id="+tableName+".collateral_type_id";
        sqlStr += " WHERE "+ tableName+ ".member_id='"+member_id+"' AND "+tableName+".approved=0 AND "+tableName+".rejected=0";
        sqlStr += " ORDER BY create_at desc";
        const datas = await dbConn.raw(sqlStr);    
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
}

LoanList.getRejectLoan = async function(member_id)
{

    try {        

        let sqlStr = "Select "+tableName+".*,interest_period_list.period_name,loan_collateral_type.collateral_name";     
        sqlStr += " From " + tableName;   
        sqlStr += " LEFT JOIN interest_period_list ON interest_period_list.id="+tableName+".period_unit_id";
        sqlStr += " LEFT JOIN loan_collateral_type ON loan_collateral_type.id="+tableName+".collateral_type_id";
        sqlStr += " WHERE "+ tableName+ ".member_id='"+member_id+"' AND "+tableName+".rejected=1";
        sqlStr += " ORDER BY create_at desc";
        const datas = await dbConn.raw(sqlStr);    
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
}

LoanList.getApproveLoan = async function(member_id)
{

    try {        

        let sqlStr = "Select "+tableName+".*,interest_period_list.period_name,loan_collateral_type.collateral_name";     
        sqlStr += " From " + tableName;   
        sqlStr += " LEFT JOIN interest_period_list ON interest_period_list.id="+tableName+".period_unit_id";
        sqlStr += " LEFT JOIN loan_collateral_type ON loan_collateral_type.id="+tableName+".collateral_type_id";
        sqlStr += " WHERE "+ tableName+ ".member_id='"+member_id+"' AND "+tableName+".approved=1";
        sqlStr += " ORDER BY create_at desc";
        const datas = await dbConn.raw(sqlStr);    
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
}

LoanList.approveLoanById = async function(updateData, result) {    
    try {

        let cTime = new Date();
        cTime = new Date(cTime.getTime() + (offsetTime));

        await dbConn.transaction(async (trx) => {

            const datas = await trx.raw("UPDATE " + tableName + " set "                       
                +"approved=?,"
                +"approve_by=?,"            
                +"approve_note=?,"
                +"approve_at=?,"
                
                +"update_by=?,"
                +"update_date=?"

                +" WHERE id=?"
                , [            
                    1,
                    updateData.admin_id,
                    updateData.approve_note,
                    timerHelper.convertDatetimeToStringNoT(cTime),

                    updateData.admin_id,
                    timerHelper.convertDatetimeToStringNoT(cTime),

                    updateData.id
                ]
            ); 

            let sharePersonList = JSON.parse(updateData.sharePersonList);
            
            let rawQuery2 = `INSERT INTO loan_share 
            (
                loan_id,owner_id,share_percent
            )
            VALUES             
            `
            let bindings2 = [];
            for (let index = 0; index < sharePersonList.length; index++) {
                const element = sharePersonList[index];
                let tmpValue = "";
                if (index==sharePersonList.length-1) 
                {
                    tmpValue = `(${updateData.id},?,?);`
                    bindings2.push(element.id, element.percent );
                }
                else
                {
                    tmpValue = `(${updateData.id},?,?),`
                    bindings2.push(element.id, element.percent );
                }
                rawQuery2+=tmpValue;
            }

            let dataInsert = await trx.raw(rawQuery2, bindings2);

        });
        

           
        return true;
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
        
    }
    
};

LoanList.rejectLoanById = async function(updateData, result) {    
    try {
        let cTime = new Date();
        cTime = new Date(cTime.getTime() + (offsetTime));

        const datas = await dbConn.raw("UPDATE " + tableName + " set "                       
            +"rejected=?,"
            +"reject_by=?,"            
            +"reject_note=?,"
            +"reject_at=?,"
            
            +"update_by=?,"
            +"update_date=?"

            +" WHERE id=?"
        , [            
            1,
            updateData.admin_id,
            updateData.reject_note,
            timerHelper.convertDatetimeToStringNoT(cTime),

            updateData.admin_id,
            timerHelper.convertDatetimeToStringNoT(cTime),

            updateData.id

        ]);    
        return true;
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
        
    }
    
};

LoanList.getLoanPaymentByLoanId = async function(loanId)
{

    try {        

        let sqlStr = "Select * ";     
        sqlStr += " From loan_payment " ;           
        sqlStr += " WHERE loan_payment.loan_id="+loanId;
        sqlStr += " ORDER BY due_date";
        const datas = await dbConn.raw(sqlStr);    
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
}

LoanList.getShareLoanByLoanId = async function(loanId)
{

    try {        

        let sqlStr = "Select loan_share.*,admins.fullName ";     
        sqlStr += " From loan_share " ;           
        sqlStr += " LEFT JOIN admins ON admins.adminName=loan_share.owner_id " ; 
        sqlStr += " WHERE loan_share.loan_id="+loanId;        
        const datas = await dbConn.raw(sqlStr);    
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
}

LoanList.getLoanPaymentByPaymentId = async function(paymentId)
{
    try {        

        let sqlStr = "Select * ";     
        sqlStr += " From loan_payment " ;           
        sqlStr += " WHERE loan_payment.id="+paymentId;        
        const datas = await dbConn.raw(sqlStr);    
        return datas[0][0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
}

LoanList.getNextLoanPaymentByPaymentId = async function(paymentId)
{
    try {        

        let sqlStr = "Select * , loan_payment.id as loan_payment_id ";     
        sqlStr += " From loan_payment " ;           
        sqlStr += " WHERE loan_payment.due_date >= (SELECT due_date FROM loan_payment WHERE id="+paymentId+" LIMIT 0,1 ) " ;
        sqlStr += " AND loan_payment.closed=0 AND loan_payment.rejected=0 AND loan_payment.paid=0  " ;           
        sqlStr += " AND loan_payment.id <> "+paymentId ;
        sqlStr += " AND loan_payment.loan_id= (SELECT loan_id FROM loan_payment WHERE id="+paymentId+" LIMIT 0,1 ) " ;
        const datas = await dbConn.raw(sqlStr);    
        return datas[0][0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
}

LoanList.getLastLoanPaymentByPaymentId = async function(paymentId)
{
    try {        

        let sqlStr = "Select * , loan_payment.id as loan_payment_id ";     
        sqlStr += " From loan_payment " ;           
        sqlStr += " WHERE loan_payment.due_date >= (SELECT due_date FROM loan_payment WHERE id="+paymentId+" LIMIT 0,1 ) " ;                         
        sqlStr += " AND loan_payment.loan_id= (SELECT loan_id FROM loan_payment WHERE id="+paymentId+" LIMIT 0,1 ) " ;
        const datas = await dbConn.raw(sqlStr);    
        return datas[0][0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
}

LoanList.getLoanNotPaidAll = async function(startDate,endDate)
{

    try {        

        let sqlStr = "Select "+tableName+".*,interest_period_list.period_name,loan_collateral_type.collateral_name,loan_payment.*,sl_users.*,loan_payment.id as loan_payment_id,sl_users.id as sl_users_id";    
        sqlStr += " From " + tableName;   
        sqlStr += " INNER JOIN loan_payment ON loan_payment.loan_id="+tableName+".id";
        sqlStr += " LEFT JOIN interest_period_list ON interest_period_list.id="+tableName+".period_unit_id";
        sqlStr += " LEFT JOIN loan_collateral_type ON loan_collateral_type.id="+tableName+".collateral_type_id";        
        sqlStr += " LEFT JOIN sl_users ON sl_users.id="+tableName+".member_id ";        
        sqlStr += " WHERE "+tableName+".approved=1";
        sqlStr += " AND loan_payment.closed=0 AND loan_payment.rejected=0 AND loan_payment.paid=0 ";
        sqlStr += " AND (loan_payment.due_date>='"+ timerHelper.convertDatetimeToStringNoT(startDate)+"' AND loan_payment.due_date<='"+ timerHelper.convertDatetimeToStringNoT(endDate)+"' )";
        sqlStr += " ORDER BY due_date desc";
        
        const datas = await dbConn.raw(sqlStr);    
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
}

LoanList.getPaymentAll = async function(startDate,endDate)
{

    try {        

        let sqlStr = "Select "+tableName+".*,interest_period_list.period_name,loan_collateral_type.collateral_name,loan_payment.*,sl_users.*,loan_payment.id as loan_payment_id,sl_users.id as sl_users_id";    
        sqlStr += " From " + tableName;   
        sqlStr += " INNER JOIN loan_payment ON loan_payment.loan_id="+tableName+".id";
        sqlStr += " LEFT JOIN interest_period_list ON interest_period_list.id="+tableName+".period_unit_id";
        sqlStr += " LEFT JOIN loan_collateral_type ON loan_collateral_type.id="+tableName+".collateral_type_id";        
        sqlStr += " LEFT JOIN sl_users ON sl_users.id="+tableName+".member_id ";        
        sqlStr += " WHERE "+tableName+".approved=1";        
        sqlStr += " AND (loan_payment.due_date>='"+ timerHelper.convertDatetimeToStringNoT(startDate)+"' AND loan_payment.due_date<='"+ timerHelper.convertDatetimeToStringNoT(endDate)+"' )";
        sqlStr += " ORDER BY due_date desc";
        
        const datas = await dbConn.raw(sqlStr);    
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
}

LoanList.getLoanNotPaidForStaff = async function(startDate,endDate,staff_id)
{

    try {        

        let sqlStr = "Select "+tableName+".*,interest_period_list.period_name,loan_collateral_type.collateral_name,loan_payment.*,sl_users.*,loan_payment.id as loan_payment_id,sl_users.id as sl_users_id";    
        sqlStr += " From " + tableName;   
        sqlStr += " INNER JOIN loan_payment ON loan_payment.loan_id="+tableName+".id";
        sqlStr += " LEFT JOIN interest_period_list ON interest_period_list.id="+tableName+".period_unit_id";
        sqlStr += " LEFT JOIN loan_collateral_type ON loan_collateral_type.id="+tableName+".collateral_type_id";  
        sqlStr += " LEFT JOIN sl_users ON sl_users.id="+tableName+".member_id ";              
        sqlStr += " WHERE "+tableName+".approved=1";
        sqlStr += " AND loan_payment.closed=0 AND loan_payment.rejected=0 AND loan_payment.paid=0 ";
        sqlStr += " AND loan_payment.staff_id='"+staff_id+"' ";
        sqlStr += " AND (loan_payment.due_date>='"+ timerHelper.convertDatetimeToStringNoT(startDate)+"' AND loan_payment.due_date<='"+ timerHelper.convertDatetimeToStringNoT(endDate)+"' )";
        sqlStr += " ORDER BY due_date desc";
        const datas = await dbConn.raw(sqlStr);    
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
}

LoanList.getLoanPaidOrClosedAll = async function(startDate,endDate)
{

    try {        

        let sqlStr = "Select "+tableName+".*,interest_period_list.period_name,loan_collateral_type.collateral_name,loan_payment.*,sl_users.*,loan_payment.id as loan_payment_id,sl_users.id as sl_users_id";    
        sqlStr += " From " + tableName;   
        sqlStr += " INNER JOIN loan_payment ON loan_payment.loan_id="+tableName+".id";
        sqlStr += " LEFT JOIN interest_period_list ON interest_period_list.id="+tableName+".period_unit_id";
        sqlStr += " LEFT JOIN loan_collateral_type ON loan_collateral_type.id="+tableName+".collateral_type_id";  
        sqlStr += " LEFT JOIN sl_users ON sl_users.id="+tableName+".member_id ";              
        sqlStr += " WHERE "+tableName+".approved=1";
        sqlStr += " AND (loan_payment.closed=1 or loan_payment.rejected=1 or loan_payment.paid=1) ";
        sqlStr += " AND (loan_payment.due_date>='"+ timerHelper.convertDatetimeToStringNoT(startDate)+"' AND loan_payment.due_date<='"+ timerHelper.convertDatetimeToStringNoT(endDate)+"' )";
        sqlStr += " ORDER BY due_date desc";
        
        const datas = await dbConn.raw(sqlStr);    
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
}

LoanList.getLoanPaidOrClosedForStaff = async function(startDate,endDate,staffId)
{

    try {        

        let sqlStr = "Select "+tableName+".*,interest_period_list.period_name,loan_collateral_type.collateral_name,loan_payment.*,sl_users.*,loan_payment.id as loan_payment_id,sl_users.id as sl_users_id";    
        sqlStr += " From " + tableName;   
        sqlStr += " INNER JOIN loan_payment ON loan_payment.loan_id="+tableName+".id";
        sqlStr += " LEFT JOIN interest_period_list ON interest_period_list.id="+tableName+".period_unit_id";
        sqlStr += " LEFT JOIN loan_collateral_type ON loan_collateral_type.id="+tableName+".collateral_type_id";        
        sqlStr += " LEFT JOIN sl_users ON sl_users.id="+tableName+".member_id ";        
        sqlStr += " WHERE "+tableName+".approved=1";
        sqlStr += " AND (loan_payment.closed=1 or loan_payment.rejected=1 or loan_payment.paid=1) ";
        sqlStr += " AND loan_payment.staff_id='"+staffId+"' ";
        sqlStr += " AND (loan_payment.due_date>='"+ timerHelper.convertDatetimeToStringNoT(startDate)+"' AND loan_payment.due_date<='"+ timerHelper.convertDatetimeToStringNoT(endDate)+"' )";
        sqlStr += " ORDER BY due_date desc";

        
        const datas = await dbConn.raw(sqlStr);    
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
}

LoanList.getPaymentAll = async function(startDate,endDate)
{

    try {        

        let sqlStr = "Select "+tableName+".*,interest_period_list.period_name,loan_collateral_type.collateral_name,loan_payment.*,sl_users.*,loan_payment.id as loan_payment_id,sl_users.id as sl_users_id";    
        sqlStr += " From " + tableName;   
        sqlStr += " INNER JOIN loan_payment ON loan_payment.loan_id="+tableName+".id";
        sqlStr += " LEFT JOIN interest_period_list ON interest_period_list.id="+tableName+".period_unit_id";
        sqlStr += " LEFT JOIN loan_collateral_type ON loan_collateral_type.id="+tableName+".collateral_type_id";  
        sqlStr += " LEFT JOIN sl_users ON sl_users.id="+tableName+".member_id ";              
        sqlStr += " WHERE "+tableName+".approved=1";        
        sqlStr += " AND (loan_payment.due_date>='"+ timerHelper.convertDatetimeToStringNoT(startDate)+"' AND loan_payment.due_date<='"+ timerHelper.convertDatetimeToStringNoT(endDate)+"' )";
        sqlStr += " ORDER BY due_date desc";
        
        const datas = await dbConn.raw(sqlStr);    
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
}

LoanList.getLoanAllForStaff = async function(startDate,endDate,staffId)
{

    try {        

        let sqlStr = "Select "+tableName+".*,interest_period_list.period_name,loan_collateral_type.collateral_name,loan_payment.*,sl_users.*,loan_payment.id as loan_payment_id,sl_users.id as sl_users_id";    
        sqlStr += " From " + tableName;   
        sqlStr += " INNER JOIN loan_payment ON loan_payment.loan_id="+tableName+".id";
        sqlStr += " LEFT JOIN interest_period_list ON interest_period_list.id="+tableName+".period_unit_id";
        sqlStr += " LEFT JOIN loan_collateral_type ON loan_collateral_type.id="+tableName+".collateral_type_id";        
        sqlStr += " LEFT JOIN sl_users ON sl_users.id="+tableName+".member_id ";        
        sqlStr += " WHERE "+tableName+".approved=1";        
        sqlStr += " AND loan_payment.staff_id='"+staffId+"' ";
        sqlStr += " AND (loan_payment.due_date>='"+ timerHelper.convertDatetimeToStringNoT(startDate)+"' AND loan_payment.due_date<='"+ timerHelper.convertDatetimeToStringNoT(endDate)+"' )";
        sqlStr += " ORDER BY due_date desc";

        
        const datas = await dbConn.raw(sqlStr);    
        return datas[0];
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
}

LoanList.assignPaymentById = async function(id,staff_id, result) {    
    try {
        let cTime = new Date();
        cTime = new Date(cTime.getTime() + (offsetTime));

        //console.log(updateData);

        const datas = await dbConn.raw("UPDATE loan_payment set "                       
            +"staff_id=? "            
            +" WHERE id=?"
        , [ 
            staff_id,            
            id
        ]);    
        return true;
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
        
    }
    
};

LoanList.updatePaymentById = async function(id,total_received_amount,received_by,paid,paid_at
                            ,note1,note1_at,note1_by,ref_img1
                            ,note2,note2_at,note2_by,ref_img2
                            ,note3,note3_at,note3_by,ref_img3
                            ,note4,note4_at,note4_by,ref_img4
                            ,loanData,loanPayment
    , result) 
{    
    try {
        

        let cTime = new Date();
        cTime = new Date(cTime.getTime() + (offsetTime));

        await dbConn.transaction(async (trx) => {
        
            const datas = await trx.raw("UPDATE loan_payment set "                       
                +"paid=? "            
                +",total_received_amount=? "  
                +",received_by=? "  
                +",paid_at=? "  

                +",note1=? "  
                +",note1_at=? "  
                +",note1_by=? "  
                +",ref_img1=? "  

                +",note2=? "  
                +",note2_at=? "  
                +",note2_by=? "  
                +",ref_img2=? " 

                +",note3=? "  
                +",note3_at=? "  
                +",note3_by=? "  
                +",ref_img3=? " 

                +",note4=? "  
                +",note4_at=? "  
                +",note4_by=? "  
                +",ref_img4=? " 

                +" WHERE id=?"
            , [ 
                paid     
                ,total_received_amount
                ,received_by
                ,timerHelper.convertDateToString(paid_at)

                ,note1
                ,(note1_at=="null")?null:note1_at
                ,(note1_by=="null")?null:note1_by
                ,(ref_img1=="null")?null:ref_img1

                ,note2
                ,(note2_at=="null")?null:note2_at
                ,(note2_by=="null")?null:note2_by
                ,(ref_img2=="null")?null:ref_img2

                ,note3
                ,(note3_at=="null")?null:note3_at
                ,(note3_by=="null")?null:note3_by
                ,(ref_img3=="null")?null:ref_img3

                ,note4
                ,(note4_at=="null")?null:note4_at
                ,(note4_by=="null")?null:note4_by
                ,(ref_img4=="null")?null:ref_img4

                ,id
            ]);  

            if (paid==1) 
            {
                let current_fine_amount = parseFloat(loanPayment.fine_amount);
                let current_interest_amount = parseFloat(loanPayment.interest_amount);
                let current_principle_amount = parseFloat(loanPayment.principle_amount);

                let remain_loan = parseFloat(loanData.remain_loan);
                let remain_interest = parseFloat(loanData.remain_interest);
                let remain_fine = parseFloat(loanData.remain_fine);

                let cal_every_number = parseInt(loanData.period_number);
                let interest = parseFloat(loanData.interest);
                
                let current_total_amount = current_principle_amount + current_interest_amount + current_fine_amount;

                if (total_received_amount==current_total_amount) {

                    remain_fine -= current_fine_amount;
                    remain_interest -= current_interest_amount;
                    remain_loan -= current_principle_amount;

                    let new_interest = remain_loan * interest /100;
                    remain_interest += new_interest;
                    
                    const datas = await trx.raw("UPDATE loan_list set "                       
                        +"remain_fine=? "            
                        +",remain_interest=? "  
                        +",remain_loan=? "  
                        
                        +" WHERE id=?"
                    , [ 
                        remain_fine     
                        ,remain_interest
                        ,remain_loan

                        ,loanData.loan_list_id
                    ]);
                }
                else
                {
                    let cal_received_amount = total_received_amount;
                    let paid_fine_amount = 0;
                    let paid_interest_amount = 0;
                    let paid_priciple_amount = 0;

                    let current_remain_fine_amount = parseFloat(loanPayment.fine_amount);
                    let current_remain_interest_amount = parseFloat(loanPayment.interest_amount);
                    let current_remain_principle_amount = parseFloat(loanPayment.principle_amount);

                    if (cal_received_amount>=current_fine_amount) {
                        paid_fine_amount = current_fine_amount;
                        cal_received_amount -= paid_fine_amount;
                    } else {
                        paid_fine_amount = cal_received_amount;
                        cal_received_amount -= paid_fine_amount;
                    }

                    if (cal_received_amount>=current_interest_amount) {
                        paid_interest_amount = current_interest_amount;
                        cal_received_amount -= paid_interest_amount;
                    } else {
                        paid_interest_amount = cal_received_amount;
                        cal_received_amount -= paid_interest_amount;
                    }

                    if (cal_received_amount>=current_principle_amount) {
                        paid_priciple_amount = current_principle_amount;
                        cal_received_amount -= paid_priciple_amount;
                    } else {
                        paid_priciple_amount = cal_received_amount;
                        cal_received_amount -= paid_priciple_amount;
                    }

                    current_remain_fine_amount -= paid_fine_amount;
                    current_remain_interest_amount -= paid_interest_amount;
                    current_remain_principle_amount -= paid_priciple_amount;
                    
                    remain_fine -= paid_fine_amount;
                    remain_interest -= paid_interest_amount;
                    remain_loan -= paid_priciple_amount;

                    let new_interest = remain_loan * interest /100;                    
                    
                    const datas = await trx.raw("UPDATE loan_list set "                       
                        +"remain_fine=? "            
                        +",remain_interest=? "  
                        +",remain_loan=? "  
                        
                        +" WHERE id=?"
                    , [ 
                        remain_fine     
                        ,remain_interest + new_interest
                        ,remain_loan

                        ,loanData.loan_list_id
                    ]);

                    let nextLoanPayment = await LoanList.getNextLoanPaymentByPaymentId(loanPayment.id);
                    
                    if (nextLoanPayment) 
                    {
                        
                        let next_total_amount = parseFloat(nextLoanPayment['total_amount']);
                        next_total_amount = next_total_amount + current_remain_fine_amount + current_remain_interest_amount+current_remain_principle_amount + new_interest;

                        let total_interest = parseFloat(nextLoanPayment['interest_amount']) + new_interest;

                        const datas2 = await trx.raw("UPDATE loan_payment set "                       
                        +"total_amount=? "            
                        +",interest_amount=? "
                        +",unpaid_previous_principle_amount=? "  
                        +",unpaid_previous_interest_amount=? "  
                        +",unpaid_previous_fine_amount=? " 
                        
                        +" WHERE id=?"
                        , [ 
                            next_total_amount     
                            ,total_interest
                            ,current_remain_principle_amount
                            ,current_remain_interest_amount
                            ,current_remain_fine_amount
                            ,nextLoanPayment.loan_payment_id
                        ]);

                    }
                    else
                    {
                        let lastLoanPayment = await LoanList.getLastLoanPaymentByPaymentId(loanPayment.id);
                        
                        const nextPaidDue = lastLoanPayment.due_date;
                        let next_total_amount = remain_fine + remain_interest + remain_loan + new_interest;
                        nextPaidDue.setDate(nextPaidDue.getDate()+cal_every_number);
                        nextPaidDue.setHours(0,0,0);

                        const datasPayment = await trx.raw("INSERT INTO loan_payment ("
                            +"loan_id,"
                            +"principle_amount,"
                            +"interest_amount,"
                            +"total_amount,"
                            +"fine_amount,"

                            +"unpaid_previous_principle_amount, "  
                            +"unpaid_previous_interest_amount, "  
                            +"unpaid_previous_fine_amount, " 
                            
                            +"due_date,"
                            +"create_at,"                            
                            +"paid"
                            + ")VALUES(?,?,?,?,? ,?,?,? ,?,?,? ) "
                        , [
                            loanData.loan_list_id,
                            remain_loan,
                            remain_interest + new_interest,
                            next_total_amount,
                            remain_fine,

                            0,
                            0,
                            0,

                            nextPaidDue,
                            timerHelper.convertDatetimeToString(cTime),                            
                            0         
                        ]); 

                    }

                }

            }
        })

          
        return true;
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
        
    }
    
};

LoanList.updateFinePaymentById = async function(id,fine_amount,notefine,notefine_by,notefine_at,total_amount,loanData,loanPayment
    , result) 
{    
    try {
        //console.log(fine_amount,notefine,notefine_by,notefine_at);

        let cTime = new Date();
        cTime = new Date(cTime.getTime() + (offsetTime));

        await dbConn.transaction(async (trx) => {
        
            const datas = await trx.raw("UPDATE loan_payment set "                       
                +"fine_amount=? "            
                +",notefine=? "  
                +",notefine_by=? "  
                +",notefine_at=? " 

                +",total_amount =  ? "

                +" WHERE id=?"
                , [ 
                    fine_amount     
                ,notefine
                ,notefine_by
                ,timerHelper.convertDatetimeToString(notefine_at)
                ,total_amount 
                ,id
            ]);  

            let old_fine_amount = parseFloat(loanPayment.fine_amount);
            let remain_fine = parseFloat(loanData.remain_fine);

            let diff_fine = fine_amount - old_fine_amount;
            remain_fine += diff_fine;
            
            const datas2 = await trx.raw("UPDATE loan_list set "                       
                +"remain_fine=? "            
                +" WHERE id=?"
            , [ 
                remain_fine     
                ,loanData.loan_list_id
            ]);


        });

          
        return true;
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};

    }

};

LoanList.updateNextPaymentById = async function(nextLoanPayment,currentPayment,admin_id
    , result) 
{    
    try {
       

        let cTime = new Date();
        cTime = new Date(cTime.getTime() + (offsetTime));

        await dbConn.transaction(async (trx) => {
            
            let total_amount = parseFloat(nextLoanPayment.principle_amount)+parseFloat(nextLoanPayment.interest_amount)+parseFloat(nextLoanPayment.fine_amount)
            + parseFloat(currentPayment.principle_amount) + parseFloat(currentPayment.interest_amount) + parseFloat(currentPayment.fine_amount)
            + parseFloat(currentPayment.unpaid_previous_principle_amount) + parseFloat(currentPayment.unpaid_previous_interest_amount) + parseFloat(unpaid_previous_fine_amount.fine_amount)
            ;

            const datas = await trx.raw("UPDATE loan_payment set "                       
                +"unpaid_previous_principle_amount=? "            
                +",unpaid_previous_interest_amount=? "  
                +",unpaid_previous_fine_amount=? "  
                
                +",total_amount =  ? "

                +" WHERE id=?"
                , [ 
                    currentPayment.principle_amount     
                    ,currentPayment.interest_amount
                    ,currentPayment.fine_amount     

                    ,total_amount 

                    ,nextLoanPayment.loan_payment_id
            ]);  

            const datas2 = await trx.raw("UPDATE loan_payment set "                       
            +"closed=? "            
            +",close_at=? "  
            +",close_by=? "  
            
            +" WHERE id=?"
            , [ 
                1   
                ,timerHelper.convertDatetimeToStringNoT(cTime)
                ,admin_id     
                ,currentPayment.id
            ]);    


        });
          
        
        return true;
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};

    }

};

LoanList.updateClosePaymentById = async function(id,admin_id
    , result) 
{    
    try {
        //console.log(fine_amount,notefine,notefine_by,notefine_at);

        let cTime = new Date();
        cTime = new Date(cTime.getTime() + (offsetTime));

        const datas = await dbConn.raw("UPDATE loan_payment set "                       
            +"closed=? "            
            +",close_at=? "  
            +",close_by=? "  
            
            +" WHERE id=?"
            , [ 
                1   
                ,timerHelper.convertDatetimeToStringNoT(cTime)
                ,admin_id     
                ,id
        ]);    
        return true;
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};

    }

};

LoanList.getAllApproveLoan = async function(startDate,endDate)
{

    try {        
        let sqlStr = "";
        sqlStr = "SELECT loan_share.*,admins.fullName FROM loan_share LEFT JOIN admins ON admins.adminName=loan_share.owner_id ";
        const dataShare = await dbConn.raw(sqlStr);
        const listLoanId = dataShare[0].map(x=>x.loan_id);
        const listLoanIdStr = listLoanId.join(',');

        if (listLoanId.length==0) 
        {
            return [];    
        }
        
        sqlStr = "Select  ";     
        sqlStr += " loan_list.id, loan_list.member_id , loan_list.loan_amount , loan_list.create_by, loan_list.period_number,";     
        sqlStr += " loan_list.create_at, loan_list.owner_admin_id , loan_list.staff_id , loan_list.interest_name, ";     
        sqlStr += " loan_list.approve_by, loan_list.close_by , loan_list.closed , loan_list.approve_note , loan_list.close_note,";
        sqlStr += " loan_list.remain_loan, loan_list.remain_interest , loan_list.remain_fine,  ";
        sqlStr += " loan_list.collateral_img1, loan_list.collateral_img2 , loan_list.collateral_img3 , loan_list.collateral_img4 ,";
        sqlStr += " loan_list.loan_longtime_number, loan_list.approve_at , loan_list.close_at , loan_list.reject_by ,";
        sqlStr += " loan_list.rejected, loan_list.reject_at , loan_list.interest , loan_list.effective_rate ,";
        sqlStr += " loan_list.reject_note, loan_list.loan_start_at,";
        sqlStr += " interest_period_list.period_unit, ";
        
        sqlStr += " interest_period_list.period_name,loan_collateral_type.collateral_name, ";     
        sqlStr += " sl_users.id as sl_users_id, sl_users.fullname as sl_users_fullname, ";   
        sqlStr += " sum(loan_payment.total_received_amount) as payment_total_received_amount, ";  
        sqlStr += " sum(loan_payment.fine_amount) as payment_fine_amount, ";
        sqlStr += " COUNT(CASE WHEN loan_payment.paid = 1 THEN 1 ELSE NULL END) as payment_paid_count, ";        
        sqlStr += " COUNT(loan_payment.id) as payment_count ";
        
        sqlStr += " From loan_list ";   
        sqlStr += " LEFT JOIN interest_period_list ON interest_period_list.id=loan_list.period_unit_id ";
        sqlStr += " LEFT JOIN loan_collateral_type ON loan_collateral_type.id=loan_list.collateral_type_id ";
        sqlStr += " LEFT JOIN sl_users ON sl_users.id=loan_list.member_id "; 
        sqlStr += " LEFT JOIN loan_payment ON loan_payment.loan_id=loan_list.id "; 

        sqlStr += " WHERE 1=1 AND loan_list.approved=1";
        sqlStr += " AND loan_list.id in ("+ listLoanIdStr +")";
        sqlStr += " AND (loan_list.approve_at >='"+ timerHelper.convertDateToString(startDate) +"' AND loan_list.approve_at <='"+timerHelper.convertDateToString(endDate)+"' )";

        sqlStr += " GROUP BY ";
        sqlStr += " loan_list.id, loan_list.member_id , loan_list.loan_amount , loan_list.create_by, loan_list.period_number,";     
        sqlStr += " loan_list.create_at, loan_list.owner_admin_id , loan_list.staff_id , loan_list.interest_name, ";     
        sqlStr += " loan_list.approve_by, loan_list.close_by , loan_list.closed , loan_list.approve_note , loan_list.close_note,";
        sqlStr += " loan_list.remain_loan, loan_list.remain_interest , loan_list.remain_fine,  ";
        sqlStr += " loan_list.collateral_img1, loan_list.collateral_img2 , loan_list.collateral_img3 , loan_list.collateral_img4 ,";
        sqlStr += " loan_list.loan_longtime_number, loan_list.approve_at , loan_list.close_at , loan_list.reject_by ,";
        sqlStr += " loan_list.rejected, loan_list.reject_at , loan_list.interest , loan_list.effective_rate ,";
        sqlStr += " loan_list.reject_note, loan_list.loan_start_at,";
        sqlStr += " interest_period_list.period_unit, ";
        sqlStr += " interest_period_list.period_name,loan_collateral_type.collateral_name, ";     
        sqlStr += " sl_users_id, sl_users_fullname  "; 

        sqlStr += " ORDER BY loan_list.create_at DESC";
        const datas = await dbConn.raw(sqlStr); 
        
        let resultData = datas[0];
        for (let index = 0; index < resultData.length; index++) {

            let sharePerson =JSON.parse(JSON.stringify(dataShare[0].filter(x=> x.loan_id==resultData[index]['id'])));

            const loanAmount = parseFloat(resultData[index]['loan_amount']);
            const totalReceiveAmount = parseFloat(resultData[index]['payment_total_received_amount']);
            const profitAmount = totalReceiveAmount-loanAmount;

            resultData[index]['profitAmount'] = profitAmount;

            for (let indexPerson = 0; indexPerson < sharePerson.length; indexPerson++) {
                sharePerson[indexPerson]['profitAmount'] = profitAmount * parseFloat(sharePerson[indexPerson]['share_percent'])/100;
            }            
            resultData[index]['shareData'] = sharePerson;            
        }
        
        return resultData;
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
}

LoanList.getApproveLoanByOwnerId = async function(owner_id,startDate,endDate)
{

    try {        
        let sqlStr = "SELECT loan_share.*,admins.fullName FROM loan_share LEFT JOIN admins ON admins.adminName=loan_share.owner_id ";
        const dataShare = await dbConn.raw(sqlStr);        
        const listLoanId = dataShare[0].filter(x=>x.owner_id==owner_id).map(x=>x.loan_id);
        const listLoanIdStr = listLoanId.join(',');

        if (listLoanId.length==0) 
        {
            return [];    
        }

        sqlStr = "Select  ";     
        sqlStr += " loan_list.id, loan_list.member_id , loan_list.loan_amount , loan_list.create_by, loan_list.period_number, ";     
        sqlStr += " loan_list.create_at, loan_list.owner_admin_id , loan_list.staff_id , loan_list.interest_name, ";     
        sqlStr += " loan_list.approve_by, loan_list.close_by , loan_list.closed , loan_list.approve_note , loan_list.close_note,";
        sqlStr += " loan_list.remain_loan, loan_list.remain_interest , loan_list.remain_fine,  ";
        sqlStr += " loan_list.collateral_img1, loan_list.collateral_img2 , loan_list.collateral_img3 , loan_list.collateral_img4 ,";
        sqlStr += " loan_list.loan_longtime_number, loan_list.approve_at , loan_list.close_at , loan_list.reject_by ,";
        sqlStr += " loan_list.rejected, loan_list.reject_at , loan_list.interest , loan_list.effective_rate ,";
        sqlStr += " loan_list.reject_note, loan_list.loan_start_at,";
        sqlStr += " interest_period_list.period_unit, ";
        sqlStr += " interest_period_list.period_name,loan_collateral_type.collateral_name, ";     
        sqlStr += " sl_users.id as sl_users_id, sl_users.fullname as sl_users_fullname, ";   
        sqlStr += " sum(loan_payment.total_received_amount) as payment_total_received_amount, ";  
        sqlStr += " sum(loan_payment.fine_amount) as payment_fine_amount, ";
        sqlStr += " COUNT(CASE WHEN loan_payment.paid = 1 THEN 1 ELSE NULL END) as payment_paid_count, ";        
        sqlStr += " COUNT(loan_payment.id) as payment_count ";
        
        sqlStr += " From loan_list ";   
        sqlStr += " LEFT JOIN interest_period_list ON interest_period_list.id=loan_list.period_unit_id ";
        sqlStr += " LEFT JOIN loan_collateral_type ON loan_collateral_type.id=loan_list.collateral_type_id ";
        sqlStr += " LEFT JOIN sl_users ON sl_users.id=loan_list.member_id "; 
        sqlStr += " LEFT JOIN loan_payment ON loan_payment.loan_id=loan_list.id ";

        sqlStr += " WHERE 1=1 AND loan_list.approved=1";
        sqlStr += " AND loan_list.id in ("+ listLoanIdStr +")";
        sqlStr += " AND (loan_list.approve_at >='"+ timerHelper.convertDateToString(startDate) +"' AND loan_list.approve_at <='"+timerHelper.convertDateToString(endDate)+"' )";

        sqlStr += " GROUP BY ";
        sqlStr += " loan_list.id, loan_list.member_id , loan_list.loan_amount , loan_list.create_by, loan_list.period_number,";     
        sqlStr += " loan_list.create_at, loan_list.owner_admin_id , loan_list.staff_id , loan_list.interest_name, ";     
        sqlStr += " loan_list.approve_by, loan_list.close_by , loan_list.closed , loan_list.approve_note , loan_list.close_note,";
        sqlStr += " loan_list.remain_loan, loan_list.remain_interest , loan_list.remain_fine,  ";
        sqlStr += " loan_list.collateral_img1, loan_list.collateral_img2 , loan_list.collateral_img3 , loan_list.collateral_img4 ,";
        sqlStr += " loan_list.loan_longtime_number, loan_list.approve_at , loan_list.close_at , loan_list.reject_by ,";
        sqlStr += " loan_list.rejected, loan_list.reject_at , loan_list.interest , loan_list.effective_rate ,";
        sqlStr += " loan_list.reject_note, loan_list.loan_start_at,";
        sqlStr += " interest_period_list.period_unit, ";
        sqlStr += " interest_period_list.period_name,loan_collateral_type.collateral_name, ";     
        sqlStr += " sl_users_id, sl_users_fullname "; 

        sqlStr += " ORDER BY loan_list.create_at DESC";
        const datas = await dbConn.raw(sqlStr);    

        let resultData = datas[0];
        for (let index = 0; index < resultData.length; index++) {

            let sharePerson =JSON.parse(JSON.stringify(dataShare[0].filter(x=> x.loan_id==resultData[index]['id'])));

            const loanAmount = parseFloat(resultData[index]['loan_amount']);
            const totalReceiveAmount = parseFloat(resultData[index]['payment_total_received_amount']);
            const profitAmount = totalReceiveAmount-loanAmount;

            resultData[index]['profitAmount'] = profitAmount;

            for (let indexPerson = 0; indexPerson < sharePerson.length; indexPerson++) {
                sharePerson[indexPerson]['profitAmount'] = profitAmount * parseFloat(sharePerson[indexPerson]['share_percent'])/100;
            }            
            resultData[index]['shareData'] = sharePerson;            
        }
        
        return resultData;

    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
}

LoanList.getAllPaidPayment = async function(startDate,endDate)
{

    try {        
        let sqlStr = "";
        sqlStr = "SELECT loan_share.*,admins.fullName FROM loan_share LEFT JOIN admins ON admins.adminName=loan_share.owner_id ";
        const dataShare = await dbConn.raw(sqlStr);
        const listLoanId = dataShare[0].map(x=>x.loan_id);
        const listLoanIdStr = listLoanId.join(',');

        if (listLoanId.length==0) 
        {
            return [];    
        }
        
        sqlStr = "Select  ";     
        sqlStr += " loan_payment.*,  "; 
        sqlStr += " loan_list.member_id , loan_list.loan_amount , loan_list.create_by, loan_list.period_number, ";     
        sqlStr += " loan_list.create_at, loan_list.owner_admin_id , loan_list.staff_id , loan_list.interest_name, ";     
        sqlStr += " loan_list.approve_by, loan_list.close_by , loan_list.closed , loan_list.approve_note , loan_list.close_note,";
        sqlStr += " loan_list.remain_loan, loan_list.remain_interest , loan_list.remain_fine,  ";
        sqlStr += " loan_list.collateral_img1, loan_list.collateral_img2 , loan_list.collateral_img3 , loan_list.collateral_img4 ,";
        sqlStr += " loan_list.loan_longtime_number, loan_list.approve_at , loan_list.close_at , loan_list.reject_by ,";
        sqlStr += " loan_list.rejected, loan_list.reject_at , loan_list.interest , loan_list.effective_rate ,";
        sqlStr += " loan_list.reject_note, loan_list.loan_start_at,";
        sqlStr += " interest_period_list.period_unit, ";
        sqlStr += " interest_period_list.period_name,loan_collateral_type.collateral_name, ";   
        sqlStr += " sl_users.id as sl_users_id, sl_users.fullname as sl_users_fullname ";   
        sqlStr += " From loan_payment ";   
        sqlStr += " LEFT JOIN loan_list ON loan_list.id=loan_payment.loan_id ";
        sqlStr += " LEFT JOIN interest_period_list ON interest_period_list.id=loan_list.period_unit_id ";
        sqlStr += " LEFT JOIN loan_collateral_type ON loan_collateral_type.id=loan_list.collateral_type_id ";
        sqlStr += " LEFT JOIN sl_users ON sl_users.id=loan_list.member_id "; 
        
        sqlStr += " WHERE 1=1 AND loan_payment.paid=1";
        sqlStr += " AND loan_payment.loan_id in ("+ listLoanIdStr +")";
        sqlStr += " AND (loan_payment.due_date >='"+ timerHelper.convertDateToString(startDate) +"' AND loan_payment.due_date <='"+timerHelper.convertDateToString(endDate)+"' )";
       
        sqlStr += " ORDER BY loan_payment.due_date ";
        const datas = await dbConn.raw(sqlStr); 
        
        let resultData = datas[0];
        for (let index = 0; index < resultData.length; index++) {

            let sharePerson =JSON.parse(JSON.stringify(dataShare[0].filter(x=> x.loan_id==resultData[index]['loan_id'])));

            const totalReceiveAmount = parseFloat(resultData[index]['total_received_amount']);
            const totalPrincipleAmount = parseFloat(resultData[index]['principle_amount']);
        
            for (let indexPerson = 0; indexPerson < sharePerson.length; indexPerson++) {
                sharePerson[indexPerson]['totalReceiveAmount'] = totalReceiveAmount * parseFloat(sharePerson[indexPerson]['share_percent'])/100;
                sharePerson[indexPerson]['totalPrincipleAmount'] = totalPrincipleAmount * parseFloat(sharePerson[indexPerson]['share_percent'])/100;
            }            
            resultData[index]['shareData'] = sharePerson;            
        }
        
        return resultData;
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
}

LoanList.getPaidPaymentByOwnerId = async function(owner_id,startDate,endDate)
{

    try {        
        let sqlStr = "SELECT loan_share.*,admins.fullName FROM loan_share LEFT JOIN admins ON admins.adminName=loan_share.owner_id ";
        const dataShare = await dbConn.raw(sqlStr);        
        const listLoanId = dataShare[0].filter(x=>x.owner_id==owner_id).map(x=>x.loan_id);
        const listLoanIdStr = listLoanId.join(',');

        if (listLoanId.length==0) 
        {
            return [];    
        }

        sqlStr = "Select  ";     
        sqlStr += " loan_payment.*,  "; 
        sqlStr += " loan_list.member_id , loan_list.loan_amount , loan_list.create_by, loan_list.period_number, ";     
        sqlStr += " loan_list.create_at, loan_list.owner_admin_id , loan_list.staff_id , loan_list.interest_name, ";     
        sqlStr += " loan_list.approve_by, loan_list.close_by , loan_list.closed , loan_list.approve_note , loan_list.close_note,";
        sqlStr += " loan_list.remain_loan, loan_list.remain_interest , loan_list.remain_fine,  ";
        sqlStr += " loan_list.collateral_img1, loan_list.collateral_img2 , loan_list.collateral_img3 , loan_list.collateral_img4 ,";
        sqlStr += " loan_list.loan_longtime_number, loan_list.approve_at , loan_list.close_at , loan_list.reject_by ,";
        sqlStr += " loan_list.rejected, loan_list.reject_at , loan_list.interest , loan_list.effective_rate ,";
        sqlStr += " loan_list.reject_note, loan_list.loan_start_at,";
        sqlStr += " interest_period_list.period_unit, ";
        sqlStr += " interest_period_list.period_name,loan_collateral_type.collateral_name, ";  
        sqlStr += " sl_users.id as sl_users_id, sl_users.fullname as sl_users_fullname ";  

        sqlStr += " From loan_payment ";   
        sqlStr += " LEFT JOIN loan_list ON loan_list.id=loan_payment.loan_id ";
        sqlStr += " LEFT JOIN interest_period_list ON interest_period_list.id=loan_list.period_unit_id ";
        sqlStr += " LEFT JOIN loan_collateral_type ON loan_collateral_type.id=loan_list.collateral_type_id ";
        sqlStr += " LEFT JOIN sl_users ON sl_users.id=loan_list.member_id "; 
        
        sqlStr += " WHERE 1=1 AND loan_payment.paid=1";
        sqlStr += " AND loan_payment.loan_id in ("+ listLoanIdStr +")";
        sqlStr += " AND (loan_payment.due_date >='"+ timerHelper.convertDateToString(startDate) +"' AND loan_payment.due_date <='"+timerHelper.convertDateToString(endDate)+"' )";
       
        sqlStr += " ORDER BY loan_payment.due_date ";
        const datas = await dbConn.raw(sqlStr);    

        let resultData = datas[0];
        for (let index = 0; index < resultData.length; index++) {

            let sharePerson =JSON.parse(JSON.stringify(dataShare[0].filter(x=> x.loan_id==resultData[index]['loan_id'])));

            const totalReceiveAmount = parseFloat(resultData[index]['total_received_amount']);
        
            for (let indexPerson = 0; indexPerson < sharePerson.length; indexPerson++) {
                sharePerson[indexPerson]['totalReceiveAmount'] = totalReceiveAmount * parseFloat(sharePerson[indexPerson]['share_percent'])/100;
            }            
            resultData[index]['shareData'] = sharePerson;            
        }
        
        return resultData;

    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
}

LoanList.getLoanBySharePersonId = async function(share_person_id)
{

    try {        
        let sqlStr = "";
        sqlStr = "SELECT loan_share.* FROM loan_share WHERE owner_id='"+share_person_id+"'";
        const dataShare = await dbConn.raw(sqlStr);
        const listLoanId = dataShare[0].map(x=>x.loan_id);
    
        if (listLoanId.length==0) 
        {
            return [];    
        }
        else
        {
            return listLoanId;
        }
        
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
}

LoanList.getLoanByAssignId = async function(assign_id)
{

    try {        
        let sqlStr = "";
        sqlStr = "SELECT loan_payment.* FROM loan_payment WHERE staff_id='"+assign_id+"'";
        const dataShare = await dbConn.raw(sqlStr);
        const listLoanId = dataShare[0].map(x=>x.loan_id);
    
        if (listLoanId.length==0) 
        {
            return [];    
        }
        else
        {
            return listLoanId;
        }
        
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
}

LoanList.getLoanByListId = async function(listLoanId)
{    
    if (listLoanId.length==0) {
        return []; 
    }

    const listLoanIdStr = listLoanId.join(',');
    try {        
        let sqlStr = "";
        sqlStr = "SELECT member_id FROM loan_list WHERE id in ("+listLoanIdStr+")";
        const data = await dbConn.raw(sqlStr);
        const listMemberId = data[0].map(x=>x.member_id);
    
        if (listMemberId.length==0) 
        {
            return [];    
        }
        else
        {
            return listMemberId;
        }
        
    } catch (error) {
        console.log(error);
        return {errorMessage : error.message};
    }
    
}

module.exports = LoanList;